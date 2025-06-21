import { PageContent } from "./components/page-content";

function parseLinkHeader(header: string) {
  return header.split(",").reduce<Record<string, string>>((acc, part) => {
    const m = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (m) acc[m[2]] = m[1];
    return acc;
  }, {});
}

export default async function Page(props: {
  searchParams: { page?: string; query?: string };
}) {
  const searchParams = await props.searchParams;
  const pageNum = parseInt(searchParams.page || "1", 10);
  const perPage = 30;
  const query =
    searchParams.query || "vibrant coastal cliffs sunrise no people";

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?page=${pageNum}&per_page=${perPage}&query=${query}&content_filter=high&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
        cache: "no-store",
        next: {
          revalidate: 0,
        },
      }
    );

    if (!res.ok) {
      console.log(res.status, res.headers);
      if (res.status === 403) {
        const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
        const rateLimitReset = res.headers.get("x-ratelimit-limit");
        const resetTime = rateLimitReset
          ? new Date(parseInt(rateLimitReset) * 1000).toISOString()
          : "unknown";

        throw new Error(
          `Rate limit exceeded. Remaining: ${rateLimitRemaining}, Resets at: ${resetTime}`
        );
      }
      throw new Error(`Unsplash API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const links = parseLinkHeader(res.headers.get("link") || "");
    const getPage = (url?: string) =>
      url ? Number(new URL(url).searchParams.get("page")) : undefined;

    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3001";
    const wallpapers = await fetch(`${baseUrl}/api/wallpapers`);
    const wallpapersData = await wallpapers.json();

    return (
      <div className="max-w-7xl mx-auto">
        <PageContent
          initialPhotos={data.results}
          initialWallpapers={wallpapersData.wallpapers}
          prevPage={getPage(links.prev)}
          nextPage={getPage(links.next)}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch photos:", error);

    return (
      <div className="max-w-7xl mx-auto">
        <PageContent
          initialPhotos={[]}
          initialWallpapers={[]}
          error={
            error instanceof Error ? error.message : "Failed to load photos"
          }
        />
      </div>
    );
  }
}
