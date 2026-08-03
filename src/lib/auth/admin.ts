import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  ADMIN_SESSION_COOKIE,
  signSessionBody,
  verifyAdminSessionToken,
} from "@/lib/auth/session";

const MAX_AGE_SECONDS = 60 * 60 * 12;

function encodeSession(data: { sub: string; email: string; exp: number }) {
  const body = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${body}.${signSessionBody(body)}`;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function createAdminSession(user: { id: string; email: string }) {
  const token = encodeSession({
    sub: user.id,
    email: user.email,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  });
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
