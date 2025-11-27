import Image from "next/image";
import { Button } from "@/components/ui/button";
import React from "react";

interface IconButtonProps {
  icon: string;
  alt: string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function IconButton({
  icon,
  alt,
  text,
  onClick,
  disabled = false,
}: IconButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      size="lg"
      className="h-20 w-60 rounded-2xl bg-white px-6 py-4 shadow-md hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50"
    >
      <span className="flex items-center justify-center gap-3">
        <Image src={icon} alt={alt} width={38} height={38} />
        <span className="text-lg font-semibold">{text}</span>
      </span>
    </Button>
  );
}
