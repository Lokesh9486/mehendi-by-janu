import { galleryCategories, services } from "@/lib/site-data";
import type { GalleryCategory } from "@/lib/gallery-types";

const categoryGroups = galleryCategories.filter(
  (category) => category.label !== "All designs",
);

function categoryForTitle(title: string): GalleryCategory {
  const match = categoryGroups.find((group) => group.titles.includes(title));

  return (match?.label as GalleryCategory | undefined) ?? "Other";
}

export type BuiltInGalleryItem = {
  id: string;
  title: string;
  description: string;
  category: GalleryCategory;
  imagePath: string;
  createdAt: number;
};

/**
 * The designs the site shipped with. They are copied into SQLite on first run
 * so the studio can edit or delete them from the admin screen like any other
 * gallery image. The original files stay in /public because the services
 * section and social previews still use them.
 */
export function builtInGalleryItems(): BuiltInGalleryItem[] {
  const now = Date.now();

  return services.map((service, index) => ({
    id: `builtin-${service.image.replace(/^.*\//, "").replace(/\.[a-z]+$/i, "")}`,
    title: service.title,
    description: "",
    category: categoryForTitle(service.title),
    imagePath: service.image,
    // Keep the original order when listing newest first.
    createdAt: now - index,
  }));
}
