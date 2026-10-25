"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import {
  DEFAULT_GALLERY_CATEGORY,
  GALLERY_CATEGORIES,
  MAX_GALLERY_DESCRIPTION_LENGTH,
  MAX_GALLERY_IMAGE_BYTES,
  MAX_GALLERY_TITLE_LENGTH,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/gallery-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type GalleryManagerProps = {
  onSessionExpired: () => void;
};

const fieldClass =
  "rounded-none border-burgundy/25 bg-ivory/70 px-3.5 text-[13px] focus-visible:ring-burgundy/20";

const labelClass =
  "font-mono text-[9px] tracking-[0.14em] text-burgundy uppercase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function GalleryManager({ onSessionExpired }: GalleryManagerProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<GalleryCategory>(
    DEFAULT_GALLERY_CATEGORY,
  );
  const [editFile, setEditFile] = useState<File | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GalleryCategory>(
    DEFAULT_GALLERY_CATEGORY,
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [listSuccess, setListSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      try {
        const response = await fetch("/api/admin/gallery", {
          cache: "no-store",
        });

        if (cancelled) return;

        if (response.status === 401) {
          onSessionExpired();
          return;
        }

        const data = (await response.json().catch(() => ({}))) as {
          items?: GalleryItem[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Could not load the gallery.");
        }

        if (!cancelled) {
          setItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch (caught) {
        if (!cancelled) {
          setListError(
            caught instanceof Error
              ? caught.message
              : "Could not load the gallery. Please refresh.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadGallery();

    return () => {
      cancelled = true;
    };
  }, [onSessionExpired]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function setPreviewFile(next: File | null) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (!next) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(next);
    previewUrlRef.current = url;
    setPreviewUrl(url);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setSuccess(null);

    const selected = event.target.files?.[0] ?? null;

    if (!selected) {
      setFile(null);
      setPreviewFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Only JPG, PNG, or WebP images can be uploaded.");
      event.target.value = "";
      return;
    }

    if (selected.size > MAX_GALLERY_IMAGE_BYTES) {
      setError("The image is larger than the 8 MB limit.");
      event.target.value = "";
      return;
    }

    setFile(selected);
    setPreviewFile(selected);
  }

  function clearFile() {
    setFile(null);
    setPreviewFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("A title is required.");
      return;
    }

    if (!file) {
      setError("Please choose an image to upload.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("title", title.trim());
      formData.set("description", description.trim());
      formData.set("category", category);
      formData.set("image", file);

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (response.status === 401) {
        onSessionExpired();
        return;
      }

      const data = (await response.json().catch(() => ({}))) as {
        item?: GalleryItem;
        error?: string;
      };

      if (!response.ok || !data.item) {
        setError(data.error ?? "The image could not be uploaded.");
        return;
      }

      setItems((current) => [data.item as GalleryItem, ...current]);
      setTitle("");
      setDescription("");
      clearFile();
      setSuccess("Image added to the gallery.");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the server. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function requestDelete(item: GalleryItem) {
    setDeleteError(null);
    setDeleteTarget(item);
  }

  function closeDeleteDialog() {
    if (deletingId) return;
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function confirmDelete() {
    const item = deleteTarget;
    if (!item) return;

    setDeleteError(null);
    setListError(null);
    setListSuccess(null);
    setDeletingId(item.id);

    try {
      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        setDeleteTarget(null);
        onSessionExpired();
        return;
      }

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setDeleteError(data.error ?? "The image could not be deleted.");
        return;
      }

      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setDeleteTarget(null);
      toast.add({
        type: "success",
        title: "Image deleted",
        description: `"${item.title}" was removed from the gallery.`,
      });
    } catch (caught) {
      setDeleteError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the server. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function startEditing(item: GalleryItem) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditCategory(item.category);
    setEditFile(null);
    setListError(null);
    setListSuccess(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditCategory(DEFAULT_GALLERY_CATEGORY);
    setEditFile(null);
  }

  function handleEditFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setListError(null);
    setListSuccess(null);

    const selected = event.target.files?.[0] ?? null;

    if (!selected) {
      setEditFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setListError("Only JPG, PNG, or WebP images can be uploaded.");
      event.target.value = "";
      return;
    }

    if (selected.size > MAX_GALLERY_IMAGE_BYTES) {
      setListError("The image is larger than the 8 MB limit.");
      event.target.value = "";
      return;
    }

    setEditFile(selected);
  }

  async function handleSaveEdit(item: GalleryItem) {
    const nextTitle = editTitle.trim();

    if (!nextTitle) {
      setListError("A title is required.");
      return;
    }

    setListError(null);
    setListSuccess(null);
    setSavingId(item.id);

    try {
      const formData = new FormData();
      formData.set("title", nextTitle);
      formData.set("description", editDescription.trim());
      formData.set("category", editCategory);
      if (editFile) formData.set("image", editFile);

      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.status === 401) {
        onSessionExpired();
        return;
      }

      const data = (await response.json().catch(() => ({}))) as {
        item?: GalleryItem;
        error?: string;
      };

      if (!response.ok || !data.item) {
        setListError(data.error ?? "The details could not be saved.");
        return;
      }

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? (data.item as GalleryItem) : entry,
        ),
      );
      cancelEditing();
      setListSuccess("Details updated.");
    } catch (caught) {
      setListError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the server. Please try again.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-10">
      <form
        onSubmit={handleUpload}
        className="h-fit border border-burgundy/20 bg-paper p-6 md:p-7 lg:sticky lg:top-6"
        noValidate
      >
        <h2 className="font-serif text-[26px] leading-tight font-normal text-burgundy">
          Add a gallery image
        </h2>
        <p className="mt-2 text-[11px] leading-[1.7] text-[#6d635a]">
          Title, description and category appear with the photograph in the
          public gallery.
        </p>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="gallery-title" className={labelClass}>
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="gallery-title"
              name="title"
              required
              maxLength={MAX_GALLERY_TITLE_LENGTH}
              placeholder="Bridal mehendi, Tiruppur"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={`h-11 ${fieldClass}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gallery-description" className={labelClass}>
              Description
            </Label>
            <Textarea
              id="gallery-description"
              name="description"
              rows={3}
              maxLength={MAX_GALLERY_DESCRIPTION_LENGTH}
              placeholder="A short note about the design, occasion, or style."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`min-h-[92px] ${fieldClass}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gallery-category" className={labelClass}>
              Category
            </Label>
            <select
              id="gallery-category"
              name="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as GalleryCategory)
              }
              className={`h-11 w-full border ${fieldClass}`}
            >
              {GALLERY_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p className="font-mono text-[8px] leading-[1.5] tracking-[0.04em] text-[#857a6d]">
              Used by the filter buttons on the public gallery.
            </p>
          </div>

          <div className="space-y-2">
            <span className={labelClass}>
              Image <span className="text-destructive">*</span>
            </span>

            <input
              ref={fileInputRef}
              id="gallery-image"
              name="image"
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileChange}
              className="sr-only"
            />

            {previewUrl && file ? (
              <div className="relative">
                <div
                  role="img"
                  aria-label={`Preview of ${file.name}`}
                  className="aspect-[4/3] w-full border border-burgundy/15 bg-champagne bg-cover bg-center"
                  style={{ backgroundImage: `url(${previewUrl})` }}
                />
                <button
                  type="button"
                  onClick={clearFile}
                  aria-label="Remove selected image"
                  className="absolute top-2 right-2 flex size-8 items-center justify-center border border-burgundy/20 bg-paper/95 text-burgundy transition-colors hover:bg-burgundy hover:text-ivory"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
                <p className="mt-2 truncate font-mono text-[9px] tracking-[0.04em] text-[#857a6d]">
                  {file.name} · {formatSize(file.size)}
                </p>
              </div>
            ) : (
              <label
                htmlFor="gallery-image"
                className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-burgundy/30 bg-ivory/60 text-center transition-colors hover:border-burgundy/60 hover:bg-champagne/40"
              >
                <ImagePlus className="size-6 text-burgundy" aria-hidden="true" />
                <span className="font-mono text-[9px] tracking-[0.12em] text-burgundy uppercase">
                  Choose an image
                </span>
                <span className="font-mono text-[8px] tracking-[0.04em] text-[#857a6d]">
                  JPG, PNG or WebP · max 8 MB
                </span>
              </label>
            )}
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            aria-live="polite"
            className="mt-5 border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-[11px] leading-[1.6] text-destructive"
          >
            {error}
          </p>
        ) : null}

        {success ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 border border-olive/30 bg-olive/5 px-3.5 py-3 text-[11px] leading-[1.6] text-olive"
          >
            {success}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isUploading}
          className="mt-6 h-11 w-full rounded-none border border-burgundy bg-burgundy text-[11px] tracking-[0.08em] text-ivory transition-colors hover:border-olive hover:bg-olive"
        >
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Uploading…
            </>
          ) : (
            <>
              <ImagePlus className="size-4" aria-hidden="true" />
              Save to gallery
            </>
          )}
        </Button>
      </form>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-burgundy/15 pb-3">
          <h2 className="font-serif text-[26px] leading-tight font-normal text-burgundy">
            Gallery images
          </h2>
          <span className="font-mono text-[9px] tracking-[0.14em] text-[#857a6d] uppercase">
            {items.length} {items.length === 1 ? "image" : "images"}
          </span>
        </div>

        {listError ? (
          <p
            role="alert"
            aria-live="polite"
            className="mt-5 border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-[11px] leading-[1.6] text-destructive"
          >
            {listError}
          </p>
        ) : null}

        {listSuccess ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 border border-olive/30 bg-olive/5 px-3.5 py-3 text-[11px] leading-[1.6] text-olive"
          >
            {listSuccess}
          </p>
        ) : null}

        {isLoading ? (
          <p className="mt-8 flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-[#857a6d] uppercase">
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Loading gallery…
          </p>
        ) : items.length === 0 ? (
          <p className="mt-8 border border-dashed border-burgundy/20 bg-paper/60 px-5 py-10 text-center text-[12px] leading-[1.8] text-[#6d635a]">
            No images in the gallery yet. Add the first photograph using the
            form.
          </p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:gap-5">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "group flex flex-col overflow-hidden border border-burgundy/15 bg-paper transition-colors hover:border-burgundy/35",
                  editingId === item.id && "col-span-2",
                )}
              >
                <div
                  className={cn(
                    "relative overflow-hidden bg-champagne",
                    editingId === item.id ? "aspect-[16/7]" : "aspect-[4/3]",
                  )}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 border-b border-burgundy/10 px-3 py-2 font-mono text-[7px] tracking-[0.1em] uppercase sm:px-4 sm:text-[8px]">
                  <span className="bg-champagne/70 px-1.5 py-0.5 text-[#6d635a]">
                    {item.category}
                  </span>
                  {item.isIllustrative ? (
                    <span className="border border-burgundy/20 px-1.5 py-0.5 text-[#857a6d]">
                      Built-in
                    </span>
                  ) : (
                    <span className="border border-olive/30 px-1.5 py-0.5 text-olive">
                      Uploaded
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <Input
                        aria-label="Image title"
                        value={editTitle}
                        maxLength={MAX_GALLERY_TITLE_LENGTH}
                        onChange={(event) => setEditTitle(event.target.value)}
                        className={`h-9 ${fieldClass}`}
                      />
                      <Textarea
                        aria-label="Image description"
                        value={editDescription}
                        rows={3}
                        maxLength={MAX_GALLERY_DESCRIPTION_LENGTH}
                        onChange={(event) =>
                          setEditDescription(event.target.value)
                        }
                        className={`min-h-[80px] ${fieldClass}`}
                      />
                      <select
                        aria-label="Image category"
                        value={editCategory}
                        onChange={(event) =>
                          setEditCategory(
                            event.target.value as GalleryCategory,
                          )
                        }
                        className={`h-9 w-full border ${fieldClass}`}
                      >
                        {GALLERY_CATEGORIES.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <div className="space-y-1.5">
                        <input
                          key={`${item.id}-${editFile ? "file" : "empty"}`}
                          id={`gallery-edit-image-${item.id}`}
                          type="file"
                          accept={ALLOWED_TYPES.join(",")}
                          onChange={handleEditFileChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`gallery-edit-image-${item.id}`}
                          className="flex cursor-pointer items-center gap-2 border border-dashed border-burgundy/25 bg-ivory/60 px-2.5 py-2 font-mono text-[8px] tracking-[0.08em] text-burgundy uppercase transition-colors hover:border-burgundy/50 hover:bg-champagne/40"
                        >
                          <ImagePlus className="size-3.5" aria-hidden="true" />
                          Replace image (optional)
                        </label>
                        {editFile ? (
                          <p className="flex items-center justify-between gap-2 font-mono text-[8px] text-[#857a6d]">
                            <span className="truncate">
                              {editFile.name} · {formatSize(editFile.size)}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditFile(null)}
                              className="shrink-0 text-destructive hover:underline"
                            >
                              Remove
                            </button>
                          </p>
                        ) : (
                          <p className="font-mono text-[8px] leading-[1.5] text-[#857a6d]">
                            Leave empty to keep the current photograph.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          type="button"
                          size="sm"
                          disabled={savingId === item.id}
                          onClick={() => handleSaveEdit(item)}
                          className="rounded-none border border-burgundy bg-burgundy text-[10px] tracking-[0.04em] text-ivory hover:bg-olive"
                        >
                          {savingId === item.id ? (
                            <Loader2
                              className="size-3.5 animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <Check className="size-3.5" aria-hidden="true" />
                          )}
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          className="rounded-none text-[10px] tracking-[0.04em] text-burgundy hover:bg-champagne/50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="line-clamp-2 font-serif text-[15px] leading-snug text-burgundy sm:text-[17px]">
                        {item.title}
                      </h3>

                      {item.description ? (
                        <p className="mt-1.5 line-clamp-2 text-[10px] leading-[1.6] text-[#6d635a] sm:text-[11px]">
                          {item.description}
                        </p>
                      ) : null}

                      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                        <span className="truncate font-mono text-[7px] tracking-[0.08em] text-[#857a6d] uppercase">
                          {formatDate(item.createdAt)}
                        </span>

                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(item)}
                            aria-label={`Edit ${item.title}`}
                            className="h-7 rounded-none px-1.5 text-[10px] tracking-[0.04em] text-burgundy hover:bg-champagne/50 sm:h-8 sm:px-2.5"
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === item.id}
                            onClick={() => requestDelete(item)}
                            aria-label={`Delete ${item.title}`}
                            className="h-7 rounded-none border border-destructive/25 bg-transparent px-1.5 text-[10px] tracking-[0.04em] hover:bg-destructive/10 sm:h-8 sm:px-2.5"
                          >
                            {deletingId === item.id ? (
                              <Loader2
                                className="size-3.5 animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <Trash2 className="size-3.5" aria-hidden="true" />
                            )}
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="gap-0 rounded-none bg-ivory p-0 text-burgundy ring-burgundy/15 sm:max-w-[440px]"
        >
          <div className="border-b border-burgundy/15 px-5 py-4">
            <DialogTitle className="font-serif text-[24px] leading-tight font-normal text-burgundy">
              Delete this image?
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-[11px] leading-[1.7] text-[#6d635a]">
              This removes the item from the Mehendi Gallery.{" "}
              {deleteTarget?.isIllustrative
                ? "The shared illustration file stays on the site."
                : "The uploaded file is also deleted from the server."}{" "}
              This cannot be undone.
            </DialogDescription>
          </div>

          {deleteTarget ? (
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden border border-burgundy/15 bg-champagne">
                <Image
                  src={deleteTarget.imageUrl}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-[16px] leading-snug text-burgundy">
                  {deleteTarget.title}
                </p>
                <p className="mt-0.5 font-mono text-[8px] tracking-[0.1em] text-[#857a6d] uppercase">
                  {deleteTarget.category}
                  {deleteTarget.isIllustrative ? " · Built-in" : " · Uploaded"}
                </p>
              </div>
            </div>
          ) : null}

          {deleteError ? (
            <p
              role="alert"
              aria-live="polite"
              className="mx-5 border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-[11px] leading-[1.6] text-destructive"
            >
              {deleteError}
            </p>
          ) : null}

          <div className="mt-1 flex flex-col-reverse gap-2 border-t border-burgundy/15 bg-champagne/20 px-5 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={closeDeleteDialog}
              disabled={deletingId !== null}
              className="h-10 rounded-none border border-burgundy/25 text-[11px] text-burgundy hover:bg-champagne/50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletingId !== null}
              className="h-10 rounded-none border border-destructive bg-destructive text-[11px] text-white hover:bg-destructive/90"
            >
              {deletingId ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="size-4" aria-hidden="true" />
              )}
              Delete image
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
