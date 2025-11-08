"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CardData {
  imageData: string;
  label: string;
}

interface CardContextType {
  cards: CardData[];
  addCard: (card: CardData) => void;
  updateCard: (index: number, card: CardData) => void;
  selectedCards: (CardData | null)[]; // DashedBox에 놓인 카드들 (최대 3개)
  setSelectedCard: (boxIndex: number, cardOrNull: CardData | null) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

// 초기 상태를 함수로 지연 로드
function getInitialCards(): CardData[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem("cards");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load cards:", e);
      return [];
    }
  }
  return [];
}

export function CardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CardData[]>(getInitialCards);
  const [selectedCards, setSelectedCards] = useState<(CardData | null)[]>([null, null, null]);

  const addCard = (card: CardData) => {
    setCards((prev) => {
      const newCards = [...prev, card];
      localStorage.setItem("cards", JSON.stringify(newCards));
      return newCards;
    });
  };

  const updateCard = (index: number, card: CardData) => {
    setCards((prev) => {
      const newCards = [...prev];
      newCards[index] = card;
      localStorage.setItem("cards", JSON.stringify(newCards));
      return newCards;
    });
  };

  const setSelectedCard = (boxIndex: number, cardOrNull: CardData | null) => {
    setSelectedCards((prev) => {
      const newSelected = [...prev];
      newSelected[boxIndex] = cardOrNull;
      return newSelected;
    });
  };

  return (
    <CardContext.Provider value={{ cards, addCard, updateCard, selectedCards, setSelectedCard }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCards() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCards must be used within CardProvider");
  }
  return context;
}
