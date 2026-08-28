import { NextRequest, NextResponse } from 'next/server';

const APP_KEY = process.env.DROPBOX_APP_KEY!;
const APP_SECRET = process.env.DROPBOX_APP_SECRET!;
const REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN!;

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  const res = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
      client_id: APP_KEY,
      client_secret: APP_SECRET,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Token refresh failed');
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken!;
}

async function dropboxPost(endpoint: string, body: any) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.dropboxapi.com/2/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Dropbox API error: ${error}`);
  }
  return res.json();
}

async function uploadFile(path: string, content: string | Buffer) {
  const token = await getAccessToken();
  const body = typeof content === 'string' ? content : new Uint8Array(content);
  const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({ path, mode: 'overwrite' }),
    },
    body,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Upload failed: ${error}`);
  }
  return res.json();
}

async function downloadFile(path: string) {
  const token = await getAccessToken();
  const res = await fetch('https://content.dropboxapi.com/2/files/download', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Dropbox-API-Arg': JSON.stringify({ path }),
    },
  });
  if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);
  return res.json();
}

// Get thumbnail as base64 data URL
async function getThumbnail(path: string, size: string = 'w128h128') {
  const token = await getAccessToken();
  const res = await fetch('https://content.dropboxapi.com/2/files/get_thumbnail', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Dropbox-API-Arg': JSON.stringify({ path, format: 'jpeg', size }),
    },
  });
  if (!res.ok) {
    // If thumbnail not supported, return null
    if (res.status === 400) {
      const errorText = await res.text();
      if (errorText.includes('unsupported_file')) return null;
    }
    throw new Error(`Thumbnail failed: ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  return `data:${contentType};base64,${base64}`;
}

export async function POST(req: NextRequest) {
  // 🔄 FORCE REFRESH TOKEN TO PICK UP NEW SCOPES
  cachedToken = null;
  tokenExpiry = null;

  try {
    // Parse body ONCE
    const { action, folder, path, newPath, filename, data, sourcePath, destPath, size } = await req.json();

    // ----- LIST (folder contents) -----
    if (action === 'list') {
      const dropboxPath = `/${folder}${path ? '/' + path : ''}`;
      const result = await dropboxPost('files/list_folder', { path: dropboxPath });
      const items = result.entries.map((entry: any) => ({
        name: entry.name,
        type: entry['.tag'] === 'folder' ? 'folder' : 'file',
        path_lower: entry.path_lower,
        size: entry.size || 0,
        modified: entry.server_modified || null,
      }));
      return NextResponse.json({ items });
    }

    // ----- CREATE FOLDER -----
    if (action === 'create_folder') {
      const fullPath = `/${folder}/${path}`;
      await dropboxPost('files/create_folder_v2', { path: fullPath, autorename: false });
      return NextResponse.json({ success: true });
    }

    // ----- RENAME FOLDER -----
    if (action === 'rename_folder') {
      const oldPath = `/${folder}/${path}`;
      const newFullPath = `/${folder}/${newPath}`;
      await dropboxPost('files/move_v2', { from_path: oldPath, to_path: newFullPath });
      return NextResponse.json({ success: true });
    }

    // ----- RENAME FILE -----
    if (action === 'rename_file') {
      const oldPath = `/${folder}/${filename}`;
      const newFullPath = `/${folder}/${newPath}`;
      await dropboxPost('files/move_v2', { from_path: oldPath, to_path: newFullPath });
      return NextResponse.json({ success: true });
    }

    // ----- DELETE FOLDER (recursive) -----
    if (action === 'delete_folder') {
      const fullPath = `/${folder}/${path}`;
      await dropboxPost('files/delete_v2', { path: fullPath });
      return NextResponse.json({ success: true });
    }

    // ----- MOVE FILE -----
    if (action === 'move_file') {
      await dropboxPost('files/move_v2', { from_path: sourcePath, to_path: destPath });
      return NextResponse.json({ success: true });
    }

    // ----- COPY FILE -----
    if (action === 'copy_file') {
      await dropboxPost('files/copy_v2', { from_path: sourcePath, to_path: destPath });
      return NextResponse.json({ success: true });
    }

    // ----- UPLOAD (save) -----
    if (action === 'upload') {
      const fullPath = `/${folder}/${filename}`;
      const content = JSON.stringify(data);
      await uploadFile(fullPath, content);
      return NextResponse.json({ success: true });
    }

    // ----- DOWNLOAD (load a single file) -----
    if (action === 'download') {
      const fullPath = `/${folder}/${filename}`;
      const fileData = await downloadFile(fullPath);
      return NextResponse.json(fileData);
    }

    // ----- DELETE FILE -----
    if (action === 'delete_file') {
      const fullPath = `/${folder}/${filename}`;
      await dropboxPost('files/delete_v2', { path: fullPath });
      return NextResponse.json({ success: true });
    }

    // ----- DOCUMENT VAULT FILE UPLOAD (with nested path) -----
    if (action === 'upload_document') {
      const fullPath = path
        ? `/${folder}/${path}/${filename}`
        : `/${folder}/${filename}`;

      const fileBuffer = Buffer.from(data, "base64");
      await uploadFile(fullPath, fileBuffer);
      return NextResponse.json({ success: true, uploadedTo: fullPath });
    }

    // ----- GET FILE LINK (preview & download) -----
    if (action === "temporary_link") {
      const fullPath = `/${folder}/${filename}`;
      const result = await dropboxPost("files/get_temporary_link", { path: fullPath });
      return NextResponse.json({ link: result.link });
    }

    // ----- GET THUMBNAIL (FIXED: use already-parsed `path` and `size`) -----
    if (action === "thumbnail") {
      const dataUrl = await getThumbnail(path, size || 'w128h128');
      if (!dataUrl) {
        return NextResponse.json({ error: "No thumbnail available" }, { status: 404 });
      }
      return NextResponse.json({ dataUrl });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}