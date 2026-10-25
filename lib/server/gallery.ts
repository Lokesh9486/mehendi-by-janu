import {
  DEFAULT_GALLERY_CATEGORY,
  isGalleryCategory,
  type GalleryItem,
} from "@/lib/gallery-types";
import {
  deleteGalleryRecord,
  getGalleryRecord,
  getDb,
  hasPersistentStorage,
  listGalleryRecords,
  type GalleryRecord,
} from "@/lib/server/db";
import { builtInGalleryItems } from "@/lib/server/gallery-seed";

/** Public URL of an uploaded file (the built-in images use their /images path). */
export function storedImagePath(fileName: string) {
  return `/api/gallery/image/${encodeURIComponent(fileName)}`;
}

/** Map a database row onto the shape the pages and API return. */
export function toGalleryItem(record: GalleryRecord): GalleryItem {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    category: isGalleryCategory(record.category)
      ? record.category
      : DEFAULT_GALLERY_CATEGORY,
    imageUrl: record.imagePath,
    isIllustrative: record.isIllustrative,
    createdAt: new Date(record.createdAt).toISOString(),
  };
}

function builtInGalleryRecords(): GalleryRecord[] {
  return builtInGalleryItems().map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    imagePath: item.imagePath,
    fileName: null,
    mimeType: null,
    sizeBytes: null,
    isIllustrative: true,
    createdAt: item.createdAt,
  }));
}

function builtInPublicItems(limit?: number): GalleryItem[] {
  const items = builtInGalleryRecords()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(toGalleryItem);

  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export function listGalleryItems(limit?: number): GalleryItem[] {
  if (!hasPersistentStorage()) return builtInPublicItems(limit);

  try {
    return listGalleryRecords(limit).map(toGalleryItem);
  } catch (error) {
    console.warn(
      "Could not read the gallery from the database; using built-in designs.",
      error,
    );
    return builtInPublicItems(limit);
  }
}

export { deleteGalleryRecord, getGalleryRecord, getDb };
