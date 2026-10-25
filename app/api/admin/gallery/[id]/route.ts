import { randomUUID } from "node:crypto";
import { getAdminSession } from "@/lib/server/auth";
import {
  MAX_GALLERY_DESCRIPTION_LENGTH,
  MAX_GALLERY_TITLE_LENGTH,
  isGalleryCategory,
} from "@/lib/gallery-types";
import {
  deleteGalleryRecord,
  getGalleryRecord,
  updateGalleryDetails,
  updateGalleryImage,
} from "@/lib/server/db";
import { toGalleryItem } from "@/lib/server/gallery";
import {
  deleteStoredImage,
  validateImageFile,
  writeStoredImage,
} from "@/lib/server/image-upload";

const unauthorized = () =>
  Response.json(
    { error: "Your session has ended. Please sign in again." },
    { status: 401 },
  );

type EditableFields = {
  title: string;
  description: string;
  category: string;
  image: unknown;
};

/** Accepts both JSON (text only) and multipart (text + optional new image). */
async function readFields(request: Request): Promise<EditableFields | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData().catch(() => null);
    if (!form) return null;

    return {
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      category: String(form.get("category") ?? ""),
      image: form.get("image"),
    };
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  if (!body) return null;

  return {
    title: typeof body.title === "string" ? body.title : "",
    description: typeof body.description === "string" ? body.description : "",
    category: typeof body.category === "string" ? body.category : "",
    image: null,
  };
}

function hasFile(image: unknown) {
  return (
    typeof image === "object" &&
    image !== null &&
    typeof (image as Blob).arrayBuffer === "function" &&
    typeof (image as Blob).size === "number" &&
    (image as Blob).size > 0
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const record = getGalleryRecord(id);

  if (!record) {
    return Response.json({ error: "Image not found." }, { status: 404 });
  }

  const fields = await readFields(request);

  if (!fields) {
    return Response.json(
      { error: "The changes could not be read. Please try again." },
      { status: 400 },
    );
  }

  const title = fields.title.trim();
  const description = fields.description.trim();
  const categoryValue = fields.category.trim();
  const category = isGalleryCategory(categoryValue)
    ? categoryValue
    : record.category;

  if (!title) {
    return Response.json({ error: "A title is required." }, { status: 400 });
  }

  if (title.length > MAX_GALLERY_TITLE_LENGTH) {
    return Response.json(
      {
        error: `Title must be ${MAX_GALLERY_TITLE_LENGTH} characters or fewer.`,
      },
      { status: 400 },
    );
  }

  if (description.length > MAX_GALLERY_DESCRIPTION_LENGTH) {
    return Response.json(
      {
        error: `Description must be ${MAX_GALLERY_DESCRIPTION_LENGTH} characters or fewer.`,
      },
      { status: 400 },
    );
  }

  let replacement: {
    fileName: string;
    imagePath: string;
    mimeType: string;
    sizeBytes: number;
  } | null = null;

  if (hasFile(fields.image)) {
    const validation = await validateImageFile(fields.image);

    if (!validation.ok) {
      return Response.json(
        { error: validation.error },
        { status: validation.status },
      );
    }

    const fileName = `${randomUUID()}.${validation.value.extension}`;
    const imagePath = await writeStoredImage(
      fileName,
      validation.value.bytes,
    );

    replacement = {
      fileName,
      imagePath,
      mimeType: validation.value.mimeType,
      sizeBytes: validation.value.bytes.length,
    };
  }

  try {
    updateGalleryDetails(id, title, description, category);

    if (replacement) {
      updateGalleryImage(id, { ...replacement, isIllustrative: false });
    }
  } catch (error) {
    if (replacement) await deleteStoredImage(replacement.fileName);
    console.error("Failed to update gallery item", error);
    return Response.json(
      { error: "The changes could not be saved. Please try again." },
      { status: 500 },
    );
  }

  // The old upload is unreachable once the row points at the new file.
  if (replacement) await deleteStoredImage(record.fileName);

  const updated = getGalleryRecord(id);

  return Response.json(
    { item: updated ? toGalleryItem(updated) : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();

  if (!session) return unauthorized();

  const { id } = await params;
  const record = getGalleryRecord(id);

  if (!record) {
    return Response.json({ error: "Image not found." }, { status: 404 });
  }

  deleteGalleryRecord(id);

  // Built-in illustrations have no file name, so the /public asset stays.
  await deleteStoredImage(record.fileName);

  return Response.json({ ok: true, id });
}
