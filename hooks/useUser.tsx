"use client"

import { useState, useEffect } from "react"

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initUser() {
      // 로컬 스토리지에서 사용자 ID 확인
      const storedUserId = localStorage.getItem("userId")
      const storedCountry = localStorage.getItem("userCountry")

      if (storedUserId) {
        setUserId(storedUserId)
        setCountry(storedCountry || "OTHER")
        setLoading(false)
        return
      }

      // 국가 감지
      let detectedCountry = "OTHER"
      try {
        const res = await fetch("https://ipapi.co/json/")
        const data = await res.json()
        // 지원하는 국가 코드로 변환
        const supportedCountries = ["KR", "US", "JP", "CN", "GB", "DE", "FR", "CA", "AU", "BR", "RU", "IN"]
        detectedCountry = supportedCountries.includes(data.country_code) ? data.country_code : "OTHER"
      } catch (error) {
        console.error("Error detecting country:", error)
      }

      // 실제 환경에서는 Supabase에 익명 사용자 생성
      // 여기서는 클라이언트 측에서만 처리
      const newUserId = crypto.randomUUID()
      setUserId(newUserId)
      setCountry(detectedCountry)

      localStorage.setItem("userId", newUserId)
      localStorage.setItem("userCountry", detectedCountry)

      setLoading(false)
    }

    initUser()
  }, [])

  return { userId, country, loading }
}
