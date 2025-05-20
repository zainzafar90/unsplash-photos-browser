"use client";

import Image from "next/image";
import { Eye, Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type Photo = {
  id: string;
  urls: {
    small: string;
    regular: string;
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

export function ImageCard({ photo, isLiked, onLike }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    try {
      onLike?.();
    } catch (error) {
      console.error("Failed to save wallpaper:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group">
      <a
        href={`${photo.urls.raw || photo.urls.regular}&w=2400&q=100`}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 bg-black"
      >
        <Image
          src={photo.urls.regular}
          alt={photo.alt_description ?? ""}
          width={600}
          height={400}
          className="w-full h-56 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-base font-semibold">Photo by {photo.user.name}</p>
          <p className="text-xs opacity-80">@{photo.user.username}</p>
        </div>
      </a>
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`absolute top-4 right-4 z-20 p-3 rounded-full bg-white shadow-lg border-2 border-white transition-colors duration-200 hover:scale-110 focus:outline-none ${
          isLiked ? "text-red-500" : "text-gray-700"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Heart className="w-7 h-7" fill={isLiked ? "currentColor" : "none"} />
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
