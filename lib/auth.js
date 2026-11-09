import { cookies } from "next/headers";
import crypto from "crypto";

export const COOKIE = "lt_auth";

export function teamPassword() {
  return (process.env.TEAM_PASSWORD || "").trim();
}

export function authToken() {
  return crypto
    .createHash("sha256")
    .update(`${teamPassword()}|${process.env.AUTH_SECRET || ""}`)
    .digest("hex");
}

export function isAuthed() {
  if (!teamPassword()) return false;
  return cookies().get(COOKIE)?.value === authToken();
}
