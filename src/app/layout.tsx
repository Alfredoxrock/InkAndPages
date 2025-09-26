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
    images: [
      {
        url: '/og-image.jpg', // We'll create this
        width: 1200,
        height: 630,
        alt: 'Ink & Pages - Where stories come to life',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ink & Pages - A Writer's Blog",
    description: "Where thoughts flow like ink onto pages, creating stories that inspire and connect.",
    creator: '@inkandpages', // Replace with your Twitter handle
    images: ['/og-image.jpg'],
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
  verification: {
    google: '', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
