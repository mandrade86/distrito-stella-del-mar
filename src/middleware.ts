import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  hasValidAdminSession,
  isSiteAccessExempt,
} from "@/lib/auth/session-edge";

/**
 * - Inyecta x-pathname para el layout
 * - Si SITE_LIVE=false, bloquea el sitio público salvo sesión admin
 *   (el toggle CMS se aplica en el layout; env es el corte rápido en Edge)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const envLive = process.env.SITE_LIVE?.trim().toLowerCase();
  const envForcesPrivate = envLive === "false" || envLive === "0";

  if (envForcesPrivate && !isSiteAccessExempt(pathname)) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const ok = await hasValidAdminSession(token);
    if (!ok) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Sitio no público. Inicie sesión en /admin." },
          { status: 403 },
        );
      }
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$).*)",
  ],
};
