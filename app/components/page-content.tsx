"use client";

import { useState } from "react";
import Link from "next/link";
import { PhotoGallery } from "./photo-gallery";

type Photo = {
  id: string;
  urls: { small: string; raw: string };
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
};

export function PageContent({
  initialPhotos,
  initialWallpapers: wallpapers,
  prevPage,
  nextPage,
}: PageContentProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/photos?page=${page}`);
      const data = await res.json();
      setPhotos(data.results);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <PhotoGallery
        photos={photos}
        wallpapers={wallpapers}
        isLoading={isLoading}
      />
      <div className="flex justify-between mt-6 max-w-sm mx-auto">
        {prevPage ? (
          <Link
            href={`/?page=${prevPage}`}
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
            href={`/?page=${nextPage}`}
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
