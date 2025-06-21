"use client";

import { useEffect, useState } from "react";
import { ImageCard } from "./image-card";
import { Photo } from "./page-content";

type Wallpaper = {
  id: string;
};

type PhotoGalleryProps = {
  photos: Photo[];
  wallpapers: Wallpaper[];
  isLoading?: boolean;
};

export function PhotoGallery({
  photos,
  wallpapers,
  isLoading = false,
}: PhotoGalleryProps) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    setLikedIds(new Set(wallpapers.map((w: Wallpaper) => w.id)));
  }, [wallpapers]);

  const handleLike = async (id: string) => {
    setLikedIds((prev) => new Set(prev).add(id));

    try {
      const baseUrl = window.location.origin;
      await fetch(`${baseUrl}/api/wallpapers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          type: "unsplash",
          url: photos.find((p) => p.id === id)?.urls.raw,
          title: photos.find((p) => p.id === id)?.alt_description || "Untitled",
          thumbnail: photos.find((p) => p.id === id)?.urls.regular,
          blurhash: photos.find((p) => p.id === id)?.blur_hash || "",
          author: photos.find((p) => p.id === id)?.user.name,
          source: `https://unsplash.com/photos/${id}`,
        }),
      });
    } catch (error) {
      setLikedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      console.error("Failed to save wallpaper:", error);
    }
  };

  return (
    <>
      <div
        className={`grid grid-cols-3 gap-4 ${isLoading ? "opacity-50" : ""}`}
      >
        {photos.map((p) => (
          <div key={p.id} className="relative group">
            <ImageCard
              photo={p}
              isLiked={likedIds.has(p.id)}
              onLike={() => handleLike(p.id)}
            />
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">
                {selectedPhoto.alt_description || "Untitled"}
              </h2>
              <p className="text-gray-600 mb-4">
                Photo by{" "}
                <a
                  href={`https://unsplash.com/@${selectedPhoto.user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {selectedPhoto.user.name}
                </a>
              </p>
            </div>
            <div className="relative aspect-[16/9]">
              <img
                src={selectedPhoto.urls.raw}
                alt={selectedPhoto.alt_description || "Photo"}
                className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
