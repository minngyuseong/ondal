"use client";

import IconButton from "./IconButton";
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
    <div className="flex flex-col gap-4">
      <IconButton
        icon="/icons/speaker.svg"
        alt="재생"
        text={isPlaying ? "재생 중..." : "놓은 카드 음성 재생"}
        onClick={handlePlay}
        disabled={isPlaying}
      />
      <IconButton
        icon="/icons/refresh.svg"
        alt="초기화"
        text="놓은 카드 처음으로"
        onClick={handleReset}
      />
    </div>
  );
}
