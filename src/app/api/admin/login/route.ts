import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-api";
import { getDbStatus } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const db = await getDbStatus();
    if (!db.ok) {
      return NextResponse.json(
        { ok: false, error: db.reason },
        { status: 503 },
      );
    }
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return NextResponse.json({ ok: false, error: "Credenciales incompletas" }, { status: 400 });
    }
    const user = await verifyAdminCredentials(body.email, body.password);
    if (!user) {
      return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
    }
    await createAdminSession(user);
    return NextResponse.json({
      ok: true,
      data: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("[admin/login]", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
