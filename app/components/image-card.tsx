"use client";

import Image from "next/image";
import { Eye, Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type Photo = {
  id: string;
  urls: {
    small: string;
    raw: string;
  };
  alt_description: string | null;
  blur_hash?: string;
  user: {
    name: string;
    username: string;
  };
};

type ImageCardProps = {
  photo: Photo;
  isLiked: boolean;
  onLike?: () => void;
};

export function ImageCard({ photo, isLiked }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    const wallpaper = {
      id: photo.id,
      type: "unsplash",
      url: photo.urls.raw,
      title: photo.alt_description || "Untitled",
      thumbnail: photo.urls.small,
      blurhash: photo.blur_hash || "",
      author: photo.user.name,
      source: `https://unsplash.com/photos/s3EjzLRA4Yw`,
    };

    try {
      const baseUrl = window.location.origin;
      await fetch(`${baseUrl}/api/wallpapers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wallpaper),
      });
    } catch (error) {
      console.error("Failed to save wallpaper:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group">
      <a
        href={`${photo.urls.raw || photo.urls.small}&w=2400&q=100`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Image
          src={photo.urls.small}
          alt={photo.alt_description ?? ""}
          width={400}
          height={300}
          className="w-full h-auto rounded object-cover max-h-64 max-w-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-sm">Photo by {photo.user.name}</p>
          <p className="text-xs">@{photo.user.username}</p>
        </div>
      </a>
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full bg-black bg-opacity-50 transition-colors ${
          isLiked ? "text-red-500" : "text-white"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
      </button>

      <Link
        href={`/photos/${photo.id}`}
        target="_blank"
        className="absolute top-2 left-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Eye className="w-5 h-5 text-white" />
      </Link>
    </div>
  );
}
