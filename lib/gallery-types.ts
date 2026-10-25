/** A single image in the public Mehendi Gallery. */
export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category: GalleryCategory;
  imageUrl: string;
  /**
   * True for the studio illustrations that shipped with the site. Uploaded
   * client work is not illustrative, so the public captions can stay honest.
   */
  isIllustrative: boolean;
  createdAt: string;
};

export const GALLERY_CATEGORIES = [
  "Bridal",
  "Arabic",
  "Traditional",
  "Simple & minimal",
  "Celebrations",
  "Other",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const DEFAULT_GALLERY_CATEGORY: GalleryCategory = "Other";

export function isGalleryCategory(value: unknown): value is GalleryCategory {
  return (
    typeof value === "string" &&
    (GALLERY_CATEGORIES as readonly string[]).includes(value)
  );
}

export const GALLERY_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_GALLERY_IMAGE_BYTES = 8 * 1024 * 1024;

export const MAX_GALLERY_TITLE_LENGTH = 120;

export const MAX_GALLERY_DESCRIPTION_LENGTH = 1_000;
