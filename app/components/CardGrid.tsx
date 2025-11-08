"use client";

import Card from "./Card";
import { useCards } from "../contexts/CardContext";

export default function CardGrid() {
  const { cards } = useCards();

  return (
    <div className="bg-secondary-white mb-6 flex-1 rounded-3xl p-6">
      <div className="grid h-full grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card key={i} card={card} index={i} />
        ))}
        {/* 빈 카드 슬롯 (최대 16개까지) */}
        {Array.from({ length: Math.max(0, 16 - cards.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-white/50"
          />
        ))}
      </div>
    </div>
  );
}
