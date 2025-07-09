"use client";

import type React from "react";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function GoogleAd({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
  className = "",
}: GoogleAdProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}

// 배너 광고 컴포넌트
export function BannerAd({ className = "" }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="1234567890" // 실제 AdSense에서 생성된 슬롯 ID로 교체
      adFormat="horizontal"
      style={{ display: "block", width: "100%", height: "90px" }}
      className={className}
    />
  );
}

// 사각형 광고 컴포넌트
export function SquareAd({ className = "" }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="0987654321" // 실제 AdSense에서 생성된 슬롯 ID로 교체
      adFormat="rectangle"
      style={{ display: "block", width: "300px", height: "250px" }}
      className={className}
    />
  );
}

// 반응형 광고 컴포넌트
export function ResponsiveAd({ className = "" }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="1122334455" // 실제 AdSense에서 생성된 슬롯 ID로 교체
      adFormat="auto"
      style={{ display: "block" }}
      className={className}
    />
  );
}
