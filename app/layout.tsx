import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3001";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", base).href;

  return {
    metadataBase: base,
    title: "FAGU · Stafrænn verkfærakassi",
    description: "Verkefnaborð FAGU með skýrum auðveldum, miðlungs og erfiðum verkefnahlutum.",
    openGraph: {
      title: "FAGU · Stafrænn verkfærakassi",
      description: "Veldu hversu langt þú ferð: auðvelt, miðlungs eða erfitt.",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "FAGU stafrænn verkfærakassi" }],
      locale: "is_IS",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "FAGU · Stafrænn verkfærakassi",
      description: "Veldu hversu langt þú ferð: auðvelt, miðlungs eða erfitt.",
      images: [socialImage],
    },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="is">
      <body>{children}</body>
    </html>
  );
}
