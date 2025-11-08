"use client";

import { useState } from "react";
import Image from "next/image";
import { useCards, type CardData } from "../contexts/CardContext";

interface DashedBoxProps {
  index: number;
}

export default function DashedBox({ index }: DashedBoxProps) {
  const { selectedCards, setSelectedCard } = useCards();
  const [isDragOver, setIsDragOver] = useState(false);

  const card = selectedCards[index];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const cardDataString = e.dataTransfer.getData("cardData");
    if (cardDataString) {
      const cardData: CardData = JSON.parse(cardDataString);
      setSelectedCard(index, cardData);
    }
  };

  const handleRemove = () => {
    setSelectedCard(index, null);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={card ? handleRemove : undefined}
      className={`relative aspect-square flex-1 overflow-hidden rounded-2xl transition-all ${
        card
          ? "border-primary-70 hover:border-primary-90 cursor-pointer border-4 border-solid bg-white"
          : "border-4 border-dashed border-white"
      } ${isDragOver ? "border-primary-100 bg-primary-20 scale-105" : ""} `}
    >
      {card && (
        <>
          <Image
            src={card.imageData}
            alt={card.label || `선택된 카드 ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 33vw, 20vw"
          />
          {card.label && (
            <div className="absolute right-0 bottom-0 left-0 bg-black/50 px-2 py-1 text-center text-sm text-white">
              {card.label}
            </div>
          )}
        </>
      )}
    </div>
  );
}
