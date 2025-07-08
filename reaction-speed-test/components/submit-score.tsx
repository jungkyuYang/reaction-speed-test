"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/hooks/useUser"
import { Loader2 } from "lucide-react"

interface SubmitScoreProps {
  score: number
  testType: "click" | "reaction"
}

export function SubmitScore({ score, testType }: SubmitScoreProps) {
  const { userId, country, loading } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (loading || !userId || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      // 실제 환경에서는 Supabase에 점수 저장
      const { error } = await supabase.from("scores").insert([
        {
          user_id: userId,
          country,
          test_type: testType,
          score,
        },
      ])

      if (error) throw error

      setIsSubmitted(true)

      // 로컬 스토리지에 최고 점수 저장
      const bestScoreKey = `best_${testType}_score`
      const currentBest = localStorage.getItem(bestScoreKey)

      if (testType === "click") {
        if (!currentBest || Number.parseFloat(currentBest) < score) {
          localStorage.setItem(bestScoreKey, score.toString())
        }
      } else {
        // reaction - 낮을수록 좋음
        if (!currentBest || Number.parseFloat(currentBest) > score) {
          localStorage.setItem(bestScoreKey, score.toString())
        }
      }
    } catch (err) {
      console.error("Error submitting score:", err)
      setError("Failed to submit score. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return <div className="text-center text-green-600 mt-2">Score submitted successfully to global rankings!</div>
  }

  return (
    <div className="mt-4">
      <Button onClick={handleSubmit} disabled={loading || isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit to Global Rankings"
        )}
      </Button>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  )
}
