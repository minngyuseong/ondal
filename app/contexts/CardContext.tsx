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
  resetSelectedCards: () => void; // 선택된 카드 초기화
}

const CardContext = createContext<CardContextType | undefined>(undefined);

// 기본 카드 데이터 정의
const DEFAULT_CARDS: CardData[] = [
  {
    imageData: "/images/1_I.png",
    label: "나",
  },
  {
    imageData: "/images/2_water.png",
    label: "물",
  },
  {
    imageData: "/images/3_rice.png",
    label: "밥",
  },
  {
    imageData: "/images/4_snack.png",
    label: "간식",
  },
  {
    imageData: "/images/5_bed.png",
    label: "침대",
  },
  {
    imageData: "/images/6_toilet.png",
    label: "화장실",
  },
  {
    imageData: "/images/7_home.png",
    label: "집",
  },
  {
    imageData: "/images/8_toy.png",
    label: "장난감",
  },
  {
    imageData: "/images/9_wanna_go.png",
    label: "가고싶어요",
  },
  {
    imageData: "/images/10_wanna_eat.png",
    label: "먹고싶어요",
  },
  {
    imageData: "/images/11_wanna_take.png",
    label: "주세요",
  },
  {
    imageData: "/images/12_sick.png",
    label: "아파요",
  },
  {
    imageData: "/images/13_no.png",
    label: "싫어요",
  },
];

// 기본 카드 개수를 export하여 Card 컴포넌트에서 사용
export const DEFAULT_CARDS_COUNT = DEFAULT_CARDS.length;

// 초기 상태를 함수로 지연 로드
function getInitialCards(): CardData[] {
  // 항상 기본 카드를 반환 (새로고침 시 초기화)
  return DEFAULT_CARDS;
}

export function CardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CardData[]>(getInitialCards);
  const [selectedCards, setSelectedCards] = useState<(CardData | null)[]>([null, null, null]);

  const addCard = (card: CardData) => {
    setCards((prev) => [...prev, card]);
  };

  const updateCard = (index: number, card: CardData) => {
    setCards((prev) => {
      const newCards = [...prev];
      newCards[index] = card;
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

  const resetSelectedCards = () => {
    setSelectedCards([null, null, null]);
  };

  return (
    <CardContext.Provider
      value={{ cards, addCard, updateCard, selectedCards, setSelectedCard, resetSelectedCards }}
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
