"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, MousePointer, Trophy, RotateCcw, Globe } from "lucide-react";
import { SubmitScore } from "@/components/submit-score";
import { Leaderboard } from "@/components/leaderboard";
import { AdBanner } from "@/components/ad-banner";
import { ResponsiveAd, SquareAd } from "@/components/google-ads";

export default function ReactionSpeedTest() {
  // State for click test
  const [clickCount, setClickCount] = useState(0);
  const [clickTestActive, setClickTestActive] = useState(false);
  const [clickTestTimeLeft, setClickTestTimeLeft] = useState(10);
  const [clicksPerSecond, setClicksPerSecond] = useState(0);
  const [bestClicksPerSecond, setBestClicksPerSecond] = useState(0);

  // State for reaction test
  const [reactionState, setReactionState] = useState<
    "waiting" | "ready" | "clicking" | "results"
  >("waiting");
  const [reactionStartTime, setReactionStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestReactionTime, setBestReactionTime] = useState(
    Number.POSITIVE_INFINITY
  );
  // const [countdownTime, setCountdownTime] = useState(0)

  // Refs for timers
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load best scores from localStorage
  useEffect(() => {
    const storedBestClick = localStorage.getItem("best_click_score");
    if (storedBestClick) {
      setBestClicksPerSecond(Number.parseFloat(storedBestClick));
    }

    const storedBestReaction = localStorage.getItem("best_reaction_score");
    if (storedBestReaction) {
      setBestReactionTime(Number.parseFloat(storedBestReaction));
    }
  }, []);

  // Click test functions
  const startClickTest = () => {
    setClickCount(0);
    setClickTestTimeLeft(10);
    setClickTestActive(true);

    clickTimerRef.current = setInterval(() => {
      setClickTestTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(clickTimerRef.current as NodeJS.Timeout);
          setClickTestActive(false);
          const cps = clickCount / 10;
          setClicksPerSecond(cps);
          if (cps > bestClicksPerSecond) {
            setBestClicksPerSecond(cps);
            localStorage.setItem("best_click_score", cps.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClick = () => {
    if (clickTestActive) {
      setClickCount((prev) => prev + 1);
    }
  };

  // Reaction test functions
  const startReactionTest = () => {
    setReactionState("ready");

    // Random delay between 1-5 seconds
    const randomDelay = Math.floor(Math.random() * 4000) + 1000;
    // setCountdownTime(randomDelay)

    // Clear any existing timer
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);

    reactionTimerRef.current = setTimeout(() => {
      setReactionState("clicking");
      setReactionStartTime(Date.now());
    }, randomDelay);
  };

  const handleReactionClick = () => {
    if (reactionState === "waiting") {
      startReactionTest();
    } else if (reactionState === "ready") {
      // Clicked too early
      clearTimeout(reactionTimerRef.current as NodeJS.Timeout);
      setReactionState("waiting");
      setReactionTime(-1); // Indicate false start
    } else if (reactionState === "clicking") {
      const endTime = Date.now();
      const time = endTime - reactionStartTime;
      setReactionTime(time);

      if (time < bestReactionTime && time > 0) {
        setBestReactionTime(time);
        localStorage.setItem("best_reaction_score", time.toString());
      }

      setReactionState("results");
    } else if (reactionState === "results") {
      setReactionState("waiting");
    }
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearInterval(clickTimerRef.current);
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    };
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      {/* 상단 배너 광고 */}
      <AdBanner />

      <h1 className="text-4xl font-bold text-center mb-2">
        Reaction Speed Test
      </h1>
      <p className="text-center text-muted-foreground mb-8 flex items-center justify-center">
        <Globe className="h-4 w-4 mr-1" />
        Test your skills and compete globally
      </p>

      <Tabs defaultValue="click" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="click">Click Speed Test</TabsTrigger>
          <TabsTrigger value="reaction">Reaction Time Test</TabsTrigger>
        </TabsList>

        <TabsContent value="click">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 사이드바 광고 (데스크톱) */}
            <div className="hidden lg:block">
              <div className="sticky top-4">
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-2 text-center">
                    Advertisement
                  </div>
                  <SquareAd />
                </div>
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Click Speed Test</CardTitle>
                  <CardDescription>
                    Click as many times as you can in {clickTestTimeLeft}{" "}
                    seconds to test your clicking speed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-between w-full mb-6">
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-5 w-5" />
                        <span className="text-xl font-bold">
                          {clickCount} clicks
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span className="text-xl font-bold">
                          {clickTestTimeLeft}s left
                        </span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className={`w-64 h-64 rounded-full text-2xl transition-all ${
                        clickTestActive
                          ? "bg-green-500 hover:bg-green-600 active:scale-95"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      onClick={clickTestActive ? handleClick : startClickTest}
                      disabled={clickTestActive && clickTestTimeLeft === 0}
                    >
                      {clickTestActive ? "CLICK!" : "Start Test"}
                    </Button>

                    {!clickTestActive && clicksPerSecond > 0 && (
                      <div className="mt-8 text-center">
                        <h3 className="text-xl font-bold mb-2">Results</h3>
                        <p className="text-lg">
                          Your speed:{" "}
                          <Badge variant="secondary" className="text-lg ml-1">
                            {clicksPerSecond.toFixed(1)} clicks/second
                          </Badge>
                        </p>
                        <p className="text-lg mt-2">
                          Best score:{" "}
                          <Badge variant="outline" className="text-lg ml-1">
                            {bestClicksPerSecond.toFixed(1)} clicks/second
                          </Badge>
                        </p>

                        {/* 점수 제출 버튼 */}
                        <SubmitScore score={clicksPerSecond} testType="click" />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setClickCount(0);
                      setClicksPerSecond(0);
                      setClickTestTimeLeft(10);
                      if (clickTimerRef.current)
                        clearInterval(clickTimerRef.current);
                      setClickTestActive(false);
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </CardFooter>
              </Card>

              {/* 모바일 광고 */}
              <div className="lg:hidden mt-6">
                <ResponsiveAd className="bg-gray-50 border rounded-lg p-4" />
              </div>
            </div>

            {/* 랭킹 */}
            <div className="lg:col-span-1">
              <Leaderboard testType="click" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reaction">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 사이드바 광고 (데스크톱) */}
            <div className="hidden lg:block">
              <div className="sticky top-4">
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-2 text-center">
                    Advertisement
                  </div>
                  <SquareAd />
                </div>
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Reaction Time Test</CardTitle>
                  <CardDescription>
                    Wait for the green color to appear, then click as quickly as
                    possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center">
                    <Button
                      size="lg"
                      className={`w-64 h-64 rounded-full text-lg transition-colors duration-300 ${
                        reactionState === "waiting"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : reactionState === "ready"
                          ? "bg-yellow-500 hover:bg-yellow-500"
                          : reactionState === "clicking"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-purple-500 hover:bg-purple-600"
                      }`}
                      onClick={handleReactionClick}
                    >
                      {reactionState === "waiting" && "Click to start"}
                      {reactionState === "ready" && "Wait for green..."}
                      {reactionState === "clicking" && "CLICK NOW!"}
                      {reactionState === "results" &&
                        (reactionTime === -1
                          ? "Too early! Click to retry"
                          : `${reactionTime} ms - Click to retry`)}
                    </Button>

                    {reactionState === "results" && reactionTime > 0 && (
                      <div className="mt-8 text-center">
                        <h3 className="text-xl font-bold mb-2">Results</h3>
                        <p className="text-lg">
                          Your time:{" "}
                          <Badge variant="secondary" className="text-lg ml-1">
                            {reactionTime} ms
                          </Badge>
                        </p>
                        <p className="text-lg mt-2">
                          Best time:{" "}
                          <Badge variant="outline" className="text-lg ml-1">
                            {bestReactionTime} ms
                          </Badge>
                        </p>

                        {/* 점수 제출 버튼 */}
                        <SubmitScore score={reactionTime} testType="reaction" />
                      </div>
                    )}

                    {bestReactionTime < Number.POSITIVE_INFINITY &&
                      reactionState !== "results" && (
                        <div className="mt-8 text-center">
                          <h3 className="text-xl font-bold mb-2">Best Time</h3>
                          <div className="flex items-center justify-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <Badge variant="outline" className="text-lg">
                              {bestReactionTime} ms
                            </Badge>
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReactionState("waiting");
                      if (reactionTimerRef.current)
                        clearTimeout(reactionTimerRef.current);
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </CardFooter>
              </Card>

              {/* 모바일 광고 */}
              <div className="lg:hidden mt-6">
                <ResponsiveAd className="bg-gray-50 border rounded-lg p-4" />
              </div>
            </div>

            {/* 랭킹 */}
            <div className="lg:col-span-1">
              <Leaderboard testType="reaction" />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 하단 광고 */}
      <div className="mt-10">
        <ResponsiveAd className="bg-gray-50 border rounded-lg p-4" />
      </div>

      <div className="text-center mt-10 text-sm text-muted-foreground">
        <p>
          Test your reaction time and clicking speed. Compare with friends
          worldwide!
        </p>
      </div>
    </div>
  );
}
