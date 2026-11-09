import { NextResponse } from "next/server";
import { list, del } from "@vercel/blob";
import { isAuthed } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { blobs } = await list({ prefix: "photos/", limit: 1000 });
  const photos = blobs
    .map((b) => ({
      url: b.url,
      name: b.pathname.split("/").slice(2).join("/"),
      album: b.pathname.split("/")[1] || "umum",
      size: b.size,
      uploadedAt: b.uploadedAt,
    }))
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  return NextResponse.json({ photos });
}

export async function DELETE(request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { url } = await request.json();
  await del(url);
  return NextResponse.json({ ok: true });
}
