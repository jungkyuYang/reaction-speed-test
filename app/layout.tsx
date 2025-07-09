import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reaction Speed Test - Test Your Reflexes Online",
  description:
    "Test your reaction time and clicking speed with our free online tool. Compare your results with players worldwide and improve your gaming performance.",
  keywords:
    "reaction time test, click speed test, reflex test, gaming performance, online test",
  authors: [{ name: "Reaction Speed Test" }],
  openGraph: {
    title: "Reaction Speed Test - Test Your Reflexes Online",
    description:
      "Test your reaction time and clicking speed. Compare with players worldwide!",
    type: "website",
    url: "https://your-domain.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reaction Speed Test",
    description: "Test your reaction time and clicking speed online",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console 사이트 소유권 확인 메타 태그 */}
        <meta
          name="google-site-verification"
          content="bAh4jtN2eht-I2sar6pb9J7fM4vMXA63Jwi1-BRdzWU"
        />

        {/* Google AdSense 사이트 소유권 확인 메타 태그 */}
        <meta name="google-adsense-account" content="ca-pub-639237491255374" />

        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics (선택사항) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
