import { randomUUID } from "node:crypto";
import { getAdminSession } from "@/lib/server/auth";
import {
  DEFAULT_GALLERY_CATEGORY,
  MAX_GALLERY_DESCRIPTION_LENGTH,
  MAX_GALLERY_TITLE_LENGTH,
  isGalleryCategory,
} from "@/lib/gallery-types";
import { insertGalleryRecord } from "@/lib/server/db";
import {
  deleteStoredImage,
  validateImageFile,
  writeStoredImage,
} from "@/lib/server/image-upload";
import { listGalleryItems, toGalleryItem } from "@/lib/server/gallery";

const unauthorized = () =>
  Response.json(
    { error: "Your session has ended. Please sign in again." },
    { status: 401 },
  );

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  return Response.json(
    { items: listGalleryItems() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "The upload could not be read. Please try again." },
      { status: 400 },
    );
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryValue = String(formData.get("category") ?? "").trim();
  const category = isGalleryCategory(categoryValue)
    ? categoryValue
    : DEFAULT_GALLERY_CATEGORY;
  const image = formData.get("image");

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

  const validation = await validateImageFile(image);

  if (!validation.ok) {
    return Response.json(
      { error: validation.error },
      { status: validation.status },
    );
  }

  const id = randomUUID();
  const fileName = `${id}.${validation.value.extension}`;
  const imagePath = await writeStoredImage(fileName, validation.value.bytes);
  const createdAt = Date.now();

  try {
    insertGalleryRecord({
      id,
      title,
      description,
      category,
      imagePath,
      fileName,
      mimeType: validation.value.mimeType,
      sizeBytes: validation.value.bytes.length,
      createdAt,
    });
  } catch (error) {
    await deleteStoredImage(fileName);
    console.error("Failed to save gallery item", error);
    return Response.json(
      { error: "The image could not be saved. Please try again." },
      { status: 500 },
    );
  }

  return Response.json(
    {
      item: toGalleryItem({
        id,
        title,
        description,
        category,
        imagePath,
        fileName,
        mimeType: validation.value.mimeType,
        sizeBytes: validation.value.bytes.length,
        isIllustrative: false,
        createdAt,
      }),
    },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
