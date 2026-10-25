import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  GALLERY_MIME_TYPES,
  MAX_GALLERY_IMAGE_BYTES,
} from "@/lib/gallery-types";
import { UPLOADS_DIR } from "@/lib/server/config";
import { storedImagePath } from "@/lib/server/gallery";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type ValidatedImage = {
  bytes: Buffer;
  mimeType: string;
  extension: string;
};

export type ImageValidation =
  | { ok: true; value: ValidatedImage }
  | { ok: false; status: number; error: string };

function looksLikeImage(bytes: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") {
    return (
      bytes.length > 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (mimeType === "image/png") {
    return (
      bytes.length > 8 &&
      bytes
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    );
  }

  if (mimeType === "image/webp") {
    return (
      bytes.length > 12 &&
      bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      bytes.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

/** Validate a multipart file field against the gallery upload rules. */
export async function validateImageFile(
  image: unknown,
): Promise<ImageValidation> {
  const isFile =
    typeof image === "object" &&
    image !== null &&
    typeof (image as Blob).arrayBuffer === "function" &&
    typeof (image as Blob).size === "number";

  if (!isFile) {
    return { ok: false, status: 400, error: "Please choose an image to upload." };
  }

  const file = image as File;
  const mimeType = file.type?.toLowerCase() ?? "";

  if (!(GALLERY_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return {
      ok: false,
      status: 400,
      error: "Only JPG, PNG, or WebP images can be uploaded.",
    };
  }

  if (file.size === 0) {
    return { ok: false, status: 400, error: "The image file is empty." };
  }

  if (file.size > MAX_GALLERY_IMAGE_BYTES) {
    return {
      ok: false,
      status: 413,
      error: "The image is larger than the 8 MB limit.",
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  if (!looksLikeImage(bytes, mimeType)) {
    return {
      ok: false,
      status: 400,
      error: "That file does not look like a valid image.",
    };
  }

  return {
    ok: true,
    value: { bytes, mimeType, extension: EXTENSION_BY_MIME[mimeType] },
  };
}

/** Write the bytes under .data/uploads and return the public URL. */
export async function writeStoredImage(fileName: string, bytes: Buffer) {
  await mkdir(/*turbopackIgnore: true*/ UPLOADS_DIR, { recursive: true });
  await writeFile(
    /*turbopackIgnore: true*/ path.join(UPLOADS_DIR, fileName),
    bytes,
  );

  return storedImagePath(fileName);
}

/** Remove an uploaded file. Built-in /images files have no file name. */
export async function deleteStoredImage(fileName: string | null) {
  if (!fileName) return;

  await unlink(
    /*turbopackIgnore: true*/ path.join(UPLOADS_DIR, fileName),
  ).catch(() => undefined);
}
