"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCards } from "../contexts/CardContext";
import { useState } from "react";

export default function ActionButtons() {
  const { selectedCards, resetSelectedCards } = useCards();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    // 선택된 카드들의 label만 추출
    const labels = selectedCards.filter((card) => card !== null).map((card) => card!.label);

    if (labels.length === 0) {
      alert("재생할 카드가 없습니다.");
      return;
    }

    // label들을 공백으로 이어서 문장 생성
    const text = labels.join(" ");
    console.log("재생할 텍스트:", text);

    setIsPlaying(true);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const { audioContent } = await response.json();

      // Base64 오디오를 재생
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.onended = () => setIsPlaying(false);
      await audio.play();
    } catch (error) {
      console.error("음성 재생 오류:", error);
      alert("음성 재생에 실패했습니다.");
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    resetSelectedCards();
  };

  return (
    <div className="flex w-48 flex-col gap-4">
      <Button
        onClick={handlePlay}
        disabled={isPlaying}
        variant="outline"
        className="h-20 rounded-2xl bg-white px-6 py-4 shadow-md hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50"
      >
        <span className="flex items-center gap-3">
          <Image src="/icons/speaker.svg" alt="재생" width={38} height={38} />
          <span className="text-sm font-medium">
            {isPlaying ? "재생 중..." : "놓은 카드 음성 재생"}
          </span>
        </span>
      </Button>
      <Button
        onClick={handleReset}
        variant="outline"
        className="h-auto rounded-2xl bg-white px-6 py-4 shadow-md hover:scale-105 hover:shadow-lg active:scale-95"
      >
        <span className="flex items-center gap-3">
          <Image src="/icons/refresh.svg" alt="초기화" width={38} height={38} />
          <span className="text-sm font-medium">카드 배치 세로 고침</span>
        </span>
      </Button>
    </div>
  );
}
