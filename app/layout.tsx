import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.RENDER_EXTERNAL_URL ?? "https://evently-4e2ce648.onrender.com";
const SITE_TITLE = "Evently · Discover and host great events";
const SITE_DESCRIPTION = "Discover upcoming events, register in seconds, and create and manage your own events with Evently.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s · Evently" },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Evently",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
