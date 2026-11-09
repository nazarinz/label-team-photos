import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { isAuthed } from "../../../lib/auth";

export async function POST(request) {
  const body = await request.json();
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Hanya dicek saat token dibuat; callback selesai-upload datang dari Vercel tanpa cookie
        if (!isAuthed()) throw new Error("Belum login");
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/heic",
            "image/avif",
          ],
          maximumSizeInBytes: 30 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
