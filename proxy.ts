import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {

  const token =
    request.cookies.get(
      "aafaq-admin-auth"
    );

  const pathname =
    request.nextUrl.pathname;

  if (
    pathname.startsWith("/invoice")
  ) {

    if (!token) {

      return NextResponse.redirect(
        new URL(
          "/admin-login",
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/invoice/:path*"],
};