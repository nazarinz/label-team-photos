import { cookies } from "next/headers";
import crypto from "crypto";

export const COOKIE = "lt_auth";

export function authToken() {
  return crypto
    .createHash("sha256")
    .update(`${process.env.TEAM_PASSWORD || ""}|${process.env.AUTH_SECRET || ""}`)
    .digest("hex");
}

export function isAuthed() {
  if (!process.env.TEAM_PASSWORD) return false;
  return cookies().get(COOKIE)?.value === authToken();
}
