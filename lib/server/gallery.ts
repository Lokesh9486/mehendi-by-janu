import {
  DEFAULT_GALLERY_CATEGORY,
  isGalleryCategory,
  type GalleryItem,
} from "@/lib/gallery-types";
import {
  deleteGalleryRecord,
  getGalleryRecord,
  getDb,
  listGalleryRecords,
  type GalleryRecord,
} from "@/lib/server/db";

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

export function listGalleryItems(limit?: number): GalleryItem[] {
  return listGalleryRecords(limit).map(toGalleryItem);
}

export { deleteGalleryRecord, getGalleryRecord, getDb };
