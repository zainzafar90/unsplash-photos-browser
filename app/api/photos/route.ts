import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const parsedPerPage = parseInt(searchParams.get("per_page") || "30", 10);
  const perPage = Math.min(30, Math.max(1, isNaN(parsedPerPage) ? 30 : parsedPerPage));
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
      if (res.status === 403) {
        const rateLimitRemaining = res.headers.get("X-Ratelimit-Remaining");
        const rateLimitReset = res.headers.get("X-Ratelimit-Reset");
        const resetTime = rateLimitReset
          ? new Date(parseInt(rateLimitReset) * 1000).toISOString()
          : "unknown";

        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            details: `Remaining: ${rateLimitRemaining}, Resets at: ${resetTime}`,
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Remaining": rateLimitRemaining || "0",
              "X-RateLimit-Reset": rateLimitReset || "",
            },
          }
        );
      }
      throw new Error(`Unsplash API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch photos",
      },
      { status: 500 }
    );
  }
}
