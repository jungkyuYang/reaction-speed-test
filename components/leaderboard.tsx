"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Score {
  id: string;
  score: number;
  created_at: string;
}

interface LeaderboardProps {
  testType: "click" | "reaction";
}

const COUNTRIES = [
  { code: "KR", name: "🇰🇷 Korea" },
  { code: "US", name: "🇺🇸 United States" },
  { code: "JP", name: "🇯🇵 Japan" },
  { code: "CN", name: "🇨🇳 China" },
  { code: "GB", name: "🇬🇧 United Kingdom" },
  { code: "DE", name: "🇩🇪 Germany" },
  { code: "FR", name: "🇫🇷 France" },
  { code: "CA", name: "🇨🇦 Canada" },
  { code: "AU", name: "🇦🇺 Australia" },
  { code: "BR", name: "🇧🇷 Brazil" },
  { code: "RU", name: "🇷🇺 Russia" },
  { code: "IN", name: "🇮🇳 India" },
  { code: "OTHER", name: "🌍 Other Countries" },
];

// 더미 데이터 생성 함수
function generateDummyData(testType: "click" | "reaction"): Score[] {
  const count = 20;
  const result: Score[] = [];

  for (let i = 0; i < count; i++) {
    let score: number;

    if (testType === "click") {
      // 클릭 테스트: 5-15 clicks/s
      score = 5 + Math.random() * 10;
    } else {
      // 반응 테스트: 150-500ms
      score = 150 + Math.random() * 350;
    }

    // 상위 랭킹일수록 더 좋은 점수
    if (i < 3) {
      if (testType === "click") {
        score += 2 + Math.random() * 3; // 상위권은 더 높은 점수
      } else {
        score = Math.max(150, score - 50 - Math.random() * 50); // 상위권은 더 낮은 시간
      }
    }

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    result.push({
      id: `dummy-${i}`,
      score: Number(score.toFixed(1)),
      created_at: date.toISOString(),
    });
  }

  // 정렬
  if (testType === "click") {
    result.sort((a, b) => b.score - a.score); // 높을수록 좋음
  } else {
    result.sort((a, b) => a.score - b.score); // 낮을수록 좋음
  }

  return result;
}

export function Leaderboard({ testType }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("KR");
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);

      try {
        // 실제 환경에서는 Supabase에서 데이터 가져오기
        // const { data, error } = await supabase
        //   .from('scores')
        //   .select('id, score, created_at')
        //   .eq('test_type', testType)
        //   .eq('country', country)
        //   .order('score', { ascending: testType === 'reaction' })
        //   .range(page * 20, (page + 1) * 20 - 1)

        // 여기서는 더미 데이터 사용
        const dummyData = generateDummyData(testType);

        // 지연 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 500));

        setScores(dummyData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, [testType, country, page]);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setPage(0); // 국가 변경 시 첫 페이지로 리셋
  };

  return (
    <div className="mt-4 bg-white rounded-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold">
            {testType === "click" ? "Click Speed" : "Reaction Time"} Rankings
          </h2>
        </div>

        <Select value={country} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score, index) => (
                <TableRow key={score.id}>
                  <TableCell className="font-medium">
                    {page * 20 + index + 1}
                    {index < 3 && (
                      <Badge
                        className={`ml-1 ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : "bg-amber-600"
                        }`}
                      >
                        {index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-bold">
                    {testType === "click"
                      ? `${score.score.toFixed(1)} clicks/s`
                      : `${score.score} ms`}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(score.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}

              {scores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No scores yet for this country.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              size="sm"
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground py-2">
              Page {page + 1}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={scores.length < 20}
              size="sm"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
