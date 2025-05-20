import Link from "next/link";
import PhotoGallery from "./components/photo-gallery";

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
  const query = searchParams.query || "scenery";
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
    <div className="p-4">
      <PhotoGallery
        photos={data.results}
        wallpapers={wallpapersData.wallpapers}
      />
      <div className="flex justify-between mt-6 max-w-sm mx-auto">
        {getPage(links.prev) ? (
          <Link href={`/?page=${getPage(links.prev)}`}>← Prev</Link>
        ) : (
          <a className="text-gray-400 inline-flex">← Prev</a>
        )}
        {getPage(links.next) ? (
          <Link href={`/?page=${getPage(links.next)}`}>Next →</Link>
        ) : (
          <a className="text-gray-400 inline-flex">Next →</a>
        )}
      </div>
    </div>
  );
}
