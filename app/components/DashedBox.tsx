"use client";

import { useState } from "react";
import { useCards, type CardData } from "../contexts/CardContext";
import CardImage from "./CardImage";

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
      className={`relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-md transition-all ${
        card
          ? "border-primary-70 hover:border-primary-90 border-4 border-solid hover:shadow-lg"
          : "border-4 border-dashed border-gray-300"
      } ${isDragOver ? "border-primary-100 bg-primary-20" : ""} `}
    >
      {card ? (
        <div className="relative h-full w-full">
          <CardImage card={card} />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          카드를 드래그하세요
        </div>
      )}
    </div>
  );
}
