import { NextResponse } from "next/server";
import { COOKIE, authToken, teamPassword } from "../../../lib/auth";

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  const expected = teamPassword();
  if (!expected || typeof password !== "string" || password.trim() !== expected) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, authToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
