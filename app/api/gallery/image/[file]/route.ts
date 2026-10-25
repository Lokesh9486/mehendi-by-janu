import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/server/config";


const SAFE_FILE_NAME = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/;

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;

  if (!SAFE_FILE_NAME.test(file)) return notFound();

  const extension = path.extname(file).slice(1).toLowerCase();
  const mimeType = MIME_BY_EXTENSION[extension] ?? "application/octet-stream";

  try {
    const data = await readFile(
      /*turbopackIgnore: true*/ path.join(UPLOADS_DIR, file),
    );
    const body = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength,
    ) as ArrayBuffer;

    return new Response(body, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(data.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return notFound();
  }
}
