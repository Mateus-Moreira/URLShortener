import { redirect } from "next/navigation";

export default async function RedirectPage(props: { params: Promise<{ shortUrl?: string }> }) {
  const { shortUrl } = await props.params;
  if (!shortUrl) {
    redirect("/");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URLS_URL}/urls/short/${shortUrl}`);
  if (!res.ok) {
    redirect("/");
  }
  const data = await res.json();
  redirect(data.originalUrl);
}

export async function generateStaticParams() {
  return [];
}
