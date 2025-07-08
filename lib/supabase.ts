import { createClient } from "@supabase/supabase-js"

// 실제 환경에서는 .env.local 파일에 이 값들을 설정해야 합니다
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-ref.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 국가 감지 함수
export async function detectCountry(): Promise<string> {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()

    // 지원하는 국가 코드로 변환
    const supportedCountries = ["KR", "US", "JP", "CN", "GB", "DE", "FR", "CA", "AU", "BR", "RU", "IN"]
    return supportedCountries.includes(data.country_code) ? data.country_code : "OTHER"
  } catch (error) {
    console.error("Error detecting country:", error)
    return "OTHER"
  }
}
