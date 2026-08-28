const API_ENDPOINT = '/api/dropbox';

async function callAPI(action, folder, additionalParams = {}) {
  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, folder, ...additionalParams }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Dropbox API failed');
  }
  return res.json();
}

// ----- Folder management (used by Invoice/Quotation/Letter & Document Vault) -----
export async function listFolderContents(folder, path = '') {
  const result = await callAPI('list', folder, { path });
  return result.items || [];
}

export async function createFolder(folder, path) {
  return callAPI('create_folder', folder, { path });
}

export async function renameFolder(folder, oldPath, newPath) {
  return callAPI('rename_folder', folder, { path: oldPath, newPath });
}

export async function deleteFolder(folder, path) {
  return callAPI('delete_folder', folder, { path });
}

// ----- File operations (move/copy) -----
export async function moveFile(sourcePath, destPath) {
  return callAPI('move_file', '', { sourcePath, destPath });
}

export async function copyFile(sourcePath, destPath) {
  return callAPI('copy_file', '', { sourcePath, destPath });
}

// ----- Invoice functions -----
export async function saveInvoiceToDropbox(fileName, data, customPath = '') {
  try {
    const folder = 'invoices';
    const filename = customPath ? `${customPath}/${fileName}` : fileName;
    await callAPI('upload', folder, { filename, data });
    return true;
  } catch (e) {
    console.error('saveInvoiceToDropbox error', e);
    return false;
  }
}

export async function loadAllInvoicesFromDropbox(path = '') {
  try {
    const items = await listFolderContents('invoices', path);
    const files = items.filter(i => i.type === 'file').map(i => i.name);
    const invoices = [];
    for (const fileName of files) {
      const fullPath = path ? `${path}/${fileName}` : fileName;
      const invoice = await callAPI('download', 'invoices', { filename: fullPath });
      invoices.push(invoice);
    }
    invoices.sort((a, b) => b.id.localeCompare(a.id));
    return invoices;
  } catch (e) {
    console.error('loadAllInvoicesFromDropbox error', e);
    return [];
  }
}

export async function deleteInvoiceFromDropbox(fileName, customPath = '') {
  try {
    const folder = 'invoices';
    const filename = customPath ? `${customPath}/${fileName}` : fileName;
    await callAPI('delete_file', folder, { filename });
    return true;
  } catch (e) {
    console.error('deleteInvoiceFromDropbox error', e);
    return false;
  }
}

// ----- Quotation functions -----
export async function saveQuotationToDropbox(fileName, data, customPath = '') {
  try {
    const folder = 'quotations';
    const filename = customPath ? `${customPath}/${fileName}` : fileName;
    await callAPI('upload', folder, { filename, data });
    return true;
  } catch (e) { return false; }
}

export async function loadAllQuotationsFromDropbox(path = '') {
  try {
    const items = await listFolderContents('quotations', path);
    const files = items.filter(i => i.type === 'file').map(i => i.name);
    const quotes = [];
    for (const fileName of files) {
      const fullPath = path ? `${path}/${fileName}` : fileName;
      const quote = await callAPI('download', 'quotations', { filename: fullPath });
      quotes.push(quote);
    }
    quotes.sort((a, b) => b.id.localeCompare(a.id));
    return quotes;
  } catch (e) { return []; }
}

export async function deleteQuotationFromDropbox(fileName, customPath = '') {
  try {
    const folder = 'quotations';
    const filename = customPath ? `${customPath}/${fileName}` : fileName;
    await callAPI('delete_file', folder, { filename });
    return true;
  } catch (e) { return false; }
}

// ----- Letter functions -----
export async function saveLetterToDropbox(fileName, data, customPath = '') {
  try {
    const folder = 'letters';
    const filename = customPath ? `${customPath}/${fileName}` : fileName;
    await callAPI('upload', folder, { filename, data });
    return true;
  } catch (e) { return false; }
}

export async function loadAllLettersFromDropbox(path = '') {
  try {
    const items = await listFolderContents('letters', path);
    const files = items.filter(i => i.type === 'file').map(i => i.name);
    const letters = [];
    for (const fileName of files) {
      const fullPath = path ? `${path}/${fileName}` : fileName;
      const letter = await callAPI('download', 'letters', { filename: fullPath });
      letters.push(letter);
    }
    letters.sort((a, b) => b.id.localeCompare(a.id));
    return letters;
  } catch (e) { return []; }
}

export async function deleteLetterFromDropbox(fileName, customPath = '') {
  try {
    const folder = 'letters';
    const filename = customPath ? `${customPath}/${fileName}` : fileName;
    await callAPI('delete_file', folder, { filename });
    return true;
  } catch (e) { return false; }
}

// =============================
// DOCUMENT VAULT
// =============================

export async function listDocumentVaultFiles(
  folder,
  path = ""
) {
  try {
    const result = await callAPI("list", folder, { path });
    return result.items || [];
  } catch (e) {
    console.error("listDocumentVaultFiles", e);
    return [];
  }
}

export async function createDocumentVaultFolder(folder, path) {
  return callAPI("create_folder", folder, { path });
}

export async function deleteDocumentVaultFile(folder, filename) {
  try {
    await callAPI("delete_file", folder, { filename });
    return true;
  } catch (e) {
    console.error("deleteDocumentVaultFile", e);
    return false;
  }
}

export async function deleteDocumentVaultFolder(folder, path) {
  try {
    await callAPI("delete_folder", folder, { path });
    return true;
  } catch (e) {
    console.error("deleteDocumentVaultFolder", e);
    return false;
  }
}

// =============================
// RECYCLE BIN
// =============================

async function ensureRecycleBin() {
  try {
    await createDocumentVaultFolder("recycle-bin", "");
  } catch (e) {
    // Folder already exists – ignore
  }
}

// Helper: recursively create a folder path
async function ensureFolderExists(folder, path) {
  if (!path) return;
  const parts = path.split("/");
  let currentPath = "";
  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}/${part}` : part;
    try {
      await callAPI("create_folder", folder, { path: currentPath });
    } catch (e) {
      // Folder already exists – ignore
    }
  }
}

export async function moveToRecycleBin(folder, filename) {
  try {
    await ensureRecycleBin();

    // Encode subpath slashes as '|' to avoid Dropbox path issues
    const encodedSubpath = (filename || '').replace(/\//g, '|');
    const sourcePath = `/${folder}/${filename}`;
    const destPath = `/recycle-bin/${folder}__${encodedSubpath}`;

    await callAPI("move_file", "", {
      sourcePath,
      destPath,
    });

    return true;
  } catch (e) {
    console.error("moveToRecycleBin", e);
    return false;
  }
}

export async function restoreFromRecycleBin(filename) {
  try {
    await ensureRecycleBin();

    const separator = "__";

    // If the filename does NOT contain the separator, we cannot determine the original folder.
    // Fallback: try to restore to the vault root.
    if (!filename.includes(separator)) {
      console.warn("File missing original folder info, restoring to vault root:", filename);
      const sourcePath = `/recycle-bin/${filename}`;
      const destPath = `/${filename}`;
      await callAPI("move_file", "", {
        sourcePath,
        destPath,
      });
      return true;
    }

    // Extract original folder and encoded file path
    const originalFolder = filename.split(separator)[0];
    const encodedFilePath = filename.substring(filename.indexOf(separator) + 2);

    // Decode slashes back to '/'
    const originalFilePath = encodedFilePath.replace(/\|/g, '/');

    // Separate parent folder and file name
    const lastSlashIndex = originalFilePath.lastIndexOf("/");
    const originalFileParentPath = lastSlashIndex !== -1 ? originalFilePath.substring(0, lastSlashIndex) : "";
    const originalFileName = lastSlashIndex !== -1 ? originalFilePath.substring(lastSlashIndex + 1) : originalFilePath;

    // Build destination path
    const destFullPath = originalFileParentPath
      ? `/${originalFolder}/${originalFileParentPath}/${originalFileName}`
      : `/${originalFolder}/${originalFileName}`;

    // Ensure the destination folder exists
    if (originalFileParentPath) {
      await ensureFolderExists(originalFolder, originalFileParentPath);
    }

    // Check for file name conflict and auto-rename if needed
    let finalDestPath = destFullPath;
    let finalFileName = originalFileName;
    let counter = 1;

    try {
      const listResult = await callAPI("list", originalFolder, { path: originalFileParentPath });
      const existingFiles = listResult.items.filter((item) => item.name === originalFileName);
      while (existingFiles.some((f) => f.name === finalFileName)) {
        const nameParts = originalFileName.split(".");
        const ext = nameParts.length > 1 ? "." + nameParts.pop() : "";
        const baseName = nameParts.join(".");
        finalFileName = `${baseName}_restored_${counter}${ext}`;
        counter++;
      }
      if (finalFileName !== originalFileName) {
        finalDestPath = originalFileParentPath
          ? `/${originalFolder}/${originalFileParentPath}/${finalFileName}`
          : `/${originalFolder}/${finalFileName}`;
      }
    } catch (err) {
      // If listing fails, use the original path
    }

    const sourcePath = `/recycle-bin/${filename}`;

    await callAPI("move_file", "", {
      sourcePath,
      destPath: finalDestPath,
    });

    return true;
  } catch (e) {
    console.error("restoreFromRecycleBin", e);
    return false;
  }
}

export async function emptyRecycleBin() {
  const items = await listDocumentVaultFiles("recycle-bin");
  let successCount = 0;
  for (const item of items) {
    const ok = await deleteDocumentVaultFile("recycle-bin", item.name);
    if (ok) successCount++;
  }
  return { success: successCount, total: items.length };
}

// =============================
// DOCUMENT VAULT UPLOAD
// =============================

export async function uploadDocumentVaultFile(
  folder,
  file,
  currentPath = ""
) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    const base64 = btoa(binary);

    await callAPI("upload_document", folder, {
      filename: file.name,
      data: base64,
      path: currentPath,
    });

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function uploadMultipleDocumentVaultFiles(
  folder,
  files,
  currentPath = ""
) {
  const results = [];
  for (const file of files) {
    const result = await uploadDocumentVaultFile(
      folder,
      file,
      currentPath
    );
    results.push(result);
  }
  return results;
}

// =============================
// DOCUMENT VAULT FILE LINK
// =============================

export async function getDocumentVaultFileLink(
  folder,
  filename
) {
  try {
    const result = await callAPI(
      "temporary_link",
      folder,
      {
        filename,
      }
    );
    return result.link;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// =============================
// DOCUMENT VAULT RENAME
// =============================

export async function renameDocumentVaultFile(
  folder,
  filename,
  newPath
) {
  return callAPI(
    "rename_file",
    folder,
    {
      filename,
      newPath,
    }
  );
}

export async function renameDocumentVaultFolder(
  folder,
  oldName,
  newName
) {
  try {
    await callAPI("rename_folder", folder, {
      path: oldName,
      newPath: newName,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// =============================
// HELPERS
// =============================

export function isImageFile(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
}

// =============================
// DOCUMENT VAULT THUMBNAIL (plain JS)
// =============================

export async function getDocumentVaultThumbnail(fullPath, size = 'w128h128') {
  try {
    const result = await callAPI('thumbnail', '', { path: fullPath, size });
    return result.dataUrl || null;
  } catch (e) {
    console.warn('Thumbnail not available for', fullPath, e);
    return null;
  }
}