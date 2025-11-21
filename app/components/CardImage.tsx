import Image from "next/image";
import type { CardData } from "../contexts/CardContext";

interface CardImageProps {
  card: CardData;
}

export default function CardImage({ card }: CardImageProps) {
  return (
    <div className="relative h-full w-full p-4">
      <div className="relative h-full w-full">
        <Image
          src={card.imageData}
          alt={card.label || "카드 이미지"}
          fill
          className="object-contain"
        />
        {card.label && (
          <div className="bg-secondary absolute right-0 bottom-0 left-0 rounded-md py-1 text-center text-lg">
            {card.label}
          </div>
        )}
      </div>
    </div>
  );
}
