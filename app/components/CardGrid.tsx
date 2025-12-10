"use client";

import Card from "./Card";
import { useCards } from "../contexts/CardContext";

export default function CardGrid() {
  const { cards } = useCards();

  return (
    <div className="bg-secondary-white mb-6 flex-1 overflow-auto rounded-3xl p-6">
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card key={i} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}
