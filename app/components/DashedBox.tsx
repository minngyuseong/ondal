"use client";

import { useState } from "react";
import Image from "next/image";
import { useCards } from "../contexts/CardContext";

interface DashedBoxProps {
  index: number;
}

export default function DashedBox({ index }: DashedBoxProps) {
  const { selectedCards, setSelectedCard } = useCards();
  const [isDragOver, setIsDragOver] = useState(false);

  const cardImage = selectedCards[index];

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

    const cardImage = e.dataTransfer.getData("cardImage");
    if (cardImage) {
      setSelectedCard(index, cardImage);
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
      onClick={cardImage ? handleRemove : undefined}
      className={`relative aspect-square flex-1 overflow-hidden rounded-2xl transition-all ${
        cardImage
          ? "border-primary-70 hover:border-primary-90 cursor-pointer border-4 border-solid bg-white"
          : "border-4 border-dashed border-white"
      } ${isDragOver ? "border-primary-100 bg-primary-20 scale-105" : ""} `}
    >
      {cardImage && (
        <Image
          src={cardImage}
          alt={`선택된 카드 ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, 20vw"
        />
      )}
    </div>
  );
}
