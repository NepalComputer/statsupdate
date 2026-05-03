import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://statsupdate.com'),
  title: {
    default: "StatsUpdate | Your Source for Breaking News",
    template: "%s | StatsUpdate",
  },
  description: "Stay informed with StatsUpdate - your trusted source for breaking news, in-depth analysis, and stories that matter.",
  keywords: ["news", "articles", "sports", "politics", "pop culture", "breaking news"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "StatsUpdate",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "guCimrXiTfLDe5Y7IZl8mZWkVN097FQAHLoSHVoHjM8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5943753257510158"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T9LB8PNTES"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T9LB8PNTES');
          `}
        </Script>
        <meta name="google-adsense-account" content="ca-pub-5943753257510158"></meta>
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}