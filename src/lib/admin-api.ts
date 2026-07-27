import { NextResponse } from "next/server";
import {
  createAdminSession,
  destroyAdminSession,
  getAdminSession,
  requireAdmin,
  verifyAdminCredentials,
} from "@/lib/auth/admin";

export async function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function withAdmin<T>(
  handler: () => Promise<T>,
): Promise<NextResponse> {
  try {
    await requireAdmin();
    const data = await handler();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized();
    }
    console.error("[admin]", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export {
  createAdminSession,
  destroyAdminSession,
  getAdminSession,
  verifyAdminCredentials,
};
