"use client";

import Image from "next/image";
import { Save } from "lucide-react";

type Photo = {
  id: string;
  urls: { full: string; raw: string };
  alt_description: string | null;
  blur_hash?: string;
  user: { name: string; username: string };
  description: string | null;
  location: { title: string | null } | null;
  exif: {
    make: string | null;
    model: string | null;
    exposure_time: string | null;
    aperture: string | null;
    focal_length: string | null;
    iso: number | null;
  } | null;
};

export default function PhotoDetails({ photo }: { photo: Photo }) {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3001";

  const handleSave = async () => {
    if (!photo) return;
    try {
      const wallpaper = {
        id: photo.id,
        type: "static",
        url: photo.urls.raw,
        title: photo.alt_description || "Untitled",
        thumbnail: photo.urls.raw,
        blurhash: photo.blur_hash || "",
        author: photo.user.name,
        source: `https://unsplash.com/photos/${photo.id}`,
      };

      await fetch(`${baseUrl}/api/wallpapers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wallpaper),
      });
    } catch (error) {
      console.error("Failed to save wallpaper:", error);
    }
  };
  return (
    <div className="max-w-full mx-auto p-6">
      <div className="mb-4"></div>

      <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
        <Image
          src={photo.urls.full}
          alt={photo.alt_description || "Photo"}
          fill
          className="object-cover"
          priority
          blurDataURL={photo.blur_hash}
        />

        <button onClick={handleSave} className="absolute top-4 right-4">
          <Save className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">
            {photo.alt_description || "Untitled"}
          </h1>
          <p className="text-gray-600 mb-4">
            Photo by{" "}
            <a
              href={`https://unsplash.com/@${photo.user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {photo.user.name}
            </a>
          </p>
          {photo.description && (
            <p className="text-gray-700 mb-4">{photo.description}</p>
          )}
          {photo.location?.title && (
            <p className="text-gray-600 mb-4">
              Location: {photo.location.title}
            </p>
          )}
        </div>

        {photo.exif && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Photo Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              {photo.exif.make && (
                <>
                  <dt className="text-gray-600">Camera</dt>
                  <dd>{photo.exif.make}</dd>
                </>
              )}
              {photo.exif.model && (
                <>
                  <dt className="text-gray-600">Model</dt>
                  <dd>{photo.exif.model}</dd>
                </>
              )}
              {photo.exif.exposure_time && (
                <>
                  <dt className="text-gray-600">Exposure</dt>
                  <dd>{photo.exif.exposure_time}s</dd>
                </>
              )}
              {photo.exif.aperture && (
                <>
                  <dt className="text-gray-600">Aperture</dt>
                  <dd>f/{photo.exif.aperture}</dd>
                </>
              )}
              {photo.exif.focal_length && (
                <>
                  <dt className="text-gray-600">Focal Length</dt>
                  <dd>{photo.exif.focal_length}mm</dd>
                </>
              )}
              {photo.exif.iso && (
                <>
                  <dt className="text-gray-600">ISO</dt>
                  <dd>{photo.exif.iso}</dd>
                </>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
