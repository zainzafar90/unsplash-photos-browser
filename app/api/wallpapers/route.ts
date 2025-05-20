import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type Wallpaper = {
  id: string;
  type: string;
  url: string;
  title: string;
  thumbnail: string;
  blurhash: string;
  author: string;
  source: string;
};

const WALLPAPERS_FILE = path.join(process.cwd(), "wallpapers.json");

function processUrls(wallpaper: Wallpaper): Wallpaper {
  const baseUrl = wallpaper.url.split("?")[0];
  return {
    ...wallpaper,
    url: `${baseUrl}?w=1920&fit=max`,
    thumbnail: `${baseUrl}?w=160&fit=max`,
    type: "static",
  };
}

export async function GET() {
  try {
    const data = await fs.readFile(WALLPAPERS_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ wallpapers: [] });
  }
}

export async function POST(request: Request) {
  try {
    const wallpaper = await request.json();
    const processedWallpaper = processUrls(wallpaper);
    const data = await fs.readFile(WALLPAPERS_FILE, "utf-8");
    const { wallpapers } = JSON.parse(data);

    if (!wallpapers.some((w: Wallpaper) => w.id === processedWallpaper.id)) {
      wallpapers.push(processedWallpaper);
      await fs.writeFile(
        WALLPAPERS_FILE,
        JSON.stringify({ wallpapers }, null, 2)
      );
    }

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save wallpaper" },
      { status: 500 }
    );
  }
}
