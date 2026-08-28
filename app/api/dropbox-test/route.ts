import { NextResponse } from 'next/server';

export async function GET() {
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;

  return NextResponse.json({
    appKeyExists: !!appKey,
    appSecretExists: !!appSecret,
    refreshTokenExists: !!refreshToken,
    appKeyPreview: appKey?.substring(0, 5),
    refreshTokenPreview: refreshToken?.substring(0, 10),
  });
}