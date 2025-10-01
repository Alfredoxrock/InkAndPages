import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { GA_TRACKING_ID } from "@/lib/gtag";

export const metadata: Metadata = {
  title: "Ink & Pages - A Writer's Blog",
  description: "Where thoughts flow like ink onto pages, creating stories that inspire and connect. Discover personal essays, writing tips, and creative stories.",
  keywords: ["writing", "blog", "stories", "creativity", "personal essays", "inspiration", "writer"],
  authors: [{ name: "Ink & Pages" }],
  creator: "Ink & Pages",
  publisher: "Ink & Pages",
  metadataBase: new URL('https://inkandpages-6d158.web.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Ink & Pages - A Writer's Blog",
    description: "Where thoughts flow like ink onto pages, creating stories that inspire and connect.",
    url: 'https://inkandpages-6d158.web.app',
    siteName: "Ink & Pages",
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
