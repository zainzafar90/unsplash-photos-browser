import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const perPage = "30";
  const query = searchParams.get("query") || "scenery";

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&per_page=${perPage}&query=${query}&content_filter=high&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch photos");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}
