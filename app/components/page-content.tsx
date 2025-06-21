"use client";

import { useState } from "react";
import Link from "next/link";
import { PhotoGallery } from "./photo-gallery";

export type Photo = {
  id: string;
  urls: { small: string; raw: string; regular: string };
  alt_description: string | null;
  blur_hash?: string;
  user: { name: string; username: string };
};

type Wallpaper = {
  id: string;
};

type PageContentProps = {
  initialPhotos: Photo[];
  initialWallpapers: Wallpaper[];
  prevPage?: number;
  nextPage?: number;
  query?: string;
  error?: string;
};

export function PageContent({
  initialPhotos,
  initialWallpapers: wallpapers,
  prevPage,
  nextPage,
  query,
  error,
}: PageContentProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    const currentPhotos = photos;
    try {
      const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';
      const res = await fetch(`/api/photos?page=${page}${queryParam}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error + (data.details ? `: ${data.details}` : ""));
      }

      setPhotos(data.results);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
      setPhotos(currentPhotos);
      alert(error instanceof Error ? error.message : "Failed to load photos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
        {wallpapers.length} wallpapers
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 max-w-4xl mx-auto">
          <p className="font-semibold">Error loading photos</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <PhotoGallery
        photos={photos}
        wallpapers={wallpapers}
        isLoading={isLoading}
      />
      <div className="flex justify-between mt-6 max-w-sm mx-auto">
        {prevPage ? (
          <Link
            href={`/?page=${prevPage}${query ? `&query=${encodeURIComponent(query)}` : ''}`}
            onClick={() => handlePageChange(prevPage)}
            className={isLoading ? "opacity-50 pointer-events-none" : ""}
          >
            ← Prev
          </Link>
        ) : (
          <a className="text-gray-400 inline-flex">← Prev</a>
        )}
        {nextPage ? (
          <Link
            href={`/?page=${nextPage}${query ? `&query=${encodeURIComponent(query)}` : ''}`}
            onClick={() => handlePageChange(nextPage)}
            className={isLoading ? "opacity-50 pointer-events-none" : ""}
          >
            Next →
          </Link>
        ) : (
          <a className="text-gray-400 inline-flex">Next →</a>
        )}
      </div>
    </div>
  );
}
