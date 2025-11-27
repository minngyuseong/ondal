"use client";

import { useRef, useEffect } from "react";
import { useCards, type CardData } from "../contexts/CardContext";
import CardImage from "./CardImage";

interface DashedBoxProps {
  index: number;
}

export default function DashedBox({ index }: DashedBoxProps) {
  const {
    selectedCards,
    setSelectedCard,
    draggingCard,
    ghostPos,
    dropTargetIndex,
    setDropTargetIndex,
  } = useCards();
  const boxRef = useRef<HTMLDivElement>(null);

  const card = selectedCards[index];

  useEffect(() => {
    if (!draggingCard || !ghostPos || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const isOver =
      ghostPos.x > rect.left &&
      ghostPos.x < rect.right &&
      ghostPos.y > rect.top &&
      ghostPos.y < rect.bottom;

    // Only set the drop target to this index when the ghost is over this box.
    // If not over this box, only clear the target if it was previously set to this box.
    setDropTargetIndex((prev) => (isOver ? index : prev === index ? null : prev));

    // no local setState here; dropTargetIndex drives highlight
  }, [ghostPos, draggingCard, index, setDropTargetIndex, dropTargetIndex]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = () => {
    // no-op: visual driven by dropTargetIndex
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // visual is driven by dropTargetIndex; no local state to clear

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
      ref={boxRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={card ? handleRemove : undefined}
      className={`aspect-square h-full w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all ${
        card
          ? "border-primary-70 hover:border-primary-90 border-4 border-solid hover:shadow-lg"
          : "border-4 border-dashed border-gray-300"
      } ${dropTargetIndex === index ? "border-primary-100 bg-primary-20" : ""} `}
    >
      {card ? (
        <CardImage card={card} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          카드를 드래그하세요
        </div>
      )}
    </div>
  );
}
