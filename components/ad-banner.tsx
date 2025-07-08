"use client"

import { BannerAd } from "./google-ads"

export function AdBanner() {
  return (
    <div className="w-full bg-gray-50 border rounded-lg p-4 my-6">
      <div className="text-xs text-gray-500 mb-2 text-center">Advertisement</div>
      <BannerAd />
    </div>
  )
}
