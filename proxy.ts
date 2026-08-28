import { NextRequest, NextResponse } from "next/server";

// Simple in‑memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (record && record.resetAt > now) {
    if (record.count >= limit) return true; // blocked
    record.count++;
    rateLimitMap.set(ip, { count: record.count, resetAt: record.resetAt });
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
  }
  return false;
}

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (record.resetAt <= now) rateLimitMap.delete(ip);
  }
}, 60 * 60 * 1000);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("aafaq-admin-auth");

  // ===== ADMIN PROTECTION =====
  if (pathname.startsWith("/invoice") || pathname.startsWith("/letter") || pathname.startsWith("/quotation")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  // ===== RATE LIMITING ON LOGIN =====
  if (pathname === "/admin-login" && request.method === "POST") {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (rateLimit(ip)) {
      return new NextResponse("Too many login attempts. Please try again later.", { status: 429 });
    }
  }

  // ===== SECURITY HEADERS =====
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.dropboxapi.com https://content.dropboxapi.com https://www.google-analytics.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/invoice/:path*",
    "/letter/:path*",
    "/quotation/:path*",
    "/admin-login",
  ],
};