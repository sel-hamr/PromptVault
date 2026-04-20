import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROUTES } from "@/constants/routes";

const AUTH_ROUTES = new Set([ROUTES.login, ROUTES.register, ROUTES.home]);
const PROTECTED_PREFIXES = ["/dashboard", "/settings", "/prompts", "/pieces", "/compose", "/collections"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;

  if (isLoggedIn && AUTH_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  if (!isLoggedIn && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/settings/:path*", "/prompts/:path*", "/pieces/:path*", "/compose/:path*", "/collections/:path*"],
};
