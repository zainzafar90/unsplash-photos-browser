import PhotoDetails from "@/app/components/photo-details";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3001";

  const res = await fetch(`${baseUrl}/api/photos/${id}`, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    },
    cache: "no-store",
    next: {
      revalidate: 0,
    },
  });

  const photo = await res.json();

  return <PhotoDetails photo={photo} />;
}
