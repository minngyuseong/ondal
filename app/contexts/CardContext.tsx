"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CardContextType {
  cardImages: string[];
  addCard: (imageData: string) => void;
  updateCard: (index: number, imageData: string) => void;
  selectedCards: (string | null)[]; // DashedBox에 놓인 카드들 (최대 3개)
  setSelectedCard: (boxIndex: number, cardImageOrNull: string | null) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

// 초기 상태를 함수로 지연 로드
function getInitialCards(): string[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem("cardImages");
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
  const [cardImages, setCardImages] = useState<string[]>(getInitialCards);
  const [selectedCards, setSelectedCards] = useState<(string | null)[]>([null, null, null]);

  const addCard = (imageData: string) => {
    setCardImages((prev) => {
      const newCards = [...prev, imageData];
      localStorage.setItem("cardImages", JSON.stringify(newCards));
      return newCards;
    });
  };

  const updateCard = (index: number, imageData: string) => {
    setCardImages((prev) => {
      const newCards = [...prev];
      newCards[index] = imageData;
      localStorage.setItem("cardImages", JSON.stringify(newCards));
      return newCards;
    });
  };

  const setSelectedCard = (boxIndex: number, cardImageOrNull: string | null) => {
    setSelectedCards((prev) => {
      const newSelected = [...prev];
      newSelected[boxIndex] = cardImageOrNull;
      return newSelected;
    });
  };

  return (
    <CardContext.Provider
      value={{ cardImages, addCard, updateCard, selectedCards, setSelectedCard }}
    >
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
