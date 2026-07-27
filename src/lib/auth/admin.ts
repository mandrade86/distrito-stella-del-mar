import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "distrito_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-insecure-admin-secret-change-me";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encodeSession(data: { sub: string; email: string; exp: number }) {
  const body = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeSession(token: string) {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      sub: string;
      email: string;
      exp: number;
    };
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
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
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
