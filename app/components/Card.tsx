"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCards, type CardData, DEFAULT_CARDS_COUNT } from "../contexts/CardContext";
import CardImage from "./CardImage";

interface CardProps {
  card: CardData;
  index: number;
}

export default function Card({ card, index }: CardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartTime = useRef<number>(0);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const { updateCard, setDraggingCard, setGhostPos, clearDrag } = useCards();

  // 기본 카드인지 확인 (index가 DEFAULT_CARDS_COUNT보다 작으면 기본 카드)
  const isDefaultCard = index < DEFAULT_CARDS_COUNT;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("cardData", JSON.stringify(card));
    e.dataTransfer.setData("cardIndex", index.toString());
    e.dataTransfer.effectAllowed = "copy";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartTime.current = Date.now();
    const touch = e.touches[0];
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
    setDraggingCard(card, index);
    setGhostPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true); // 터치 시작하자마자 드래그 시작
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setGhostPos({ x: touch.clientX, y: touch.clientY });
    e.preventDefault(); // 스크롤 방지
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragStartPos.current = null;
    clearDrag();
  };

  const handleEdit = (newCard: CardData) => {
    updateCard(index, newCard);
    setIsEditModalOpen(false);
  };

  const handleClick = () => {
    // 드래그 중이면 클릭 무시
    if (isDragging) return;

    // 기본 카드는 수정 불가
    if (!isDefaultCard) {
      setIsEditModalOpen(true);
    }
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className={`aspect-square touch-none overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-lg ${
          isDefaultCard ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        }`}
      >
        <CardImage card={card} />
      </div>

      {/* 수정 모달 - AddCardButton과 동일한 그리기 기능 */}
      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEdit}
        initialCard={card}
      />
    </>
  );
}

// 카드 수정 모달 컴포넌트
function EditCardModal({
  isOpen,
  onClose,
  onSave,
  initialCard,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: CardData) => void;
  initialCard: CardData;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [label, setLabel] = useState(initialCard.label);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 기존 이미지를 캔버스에 로드
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = initialCard.imageData;
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // 터치 이벤트와 마우스 이벤트 구분
    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL("image/png");
    onSave({ imageData, label });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" onOpenAutoFocus={initCanvas}>
        <DialogHeader>
          <DialogTitle>카드 수정하기</DialogTitle>
        </DialogHeader>

        {/* 그리기 도구 */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">색상:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-12 w-12 cursor-pointer rounded p-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">두께:</label>
            <input
              type="range"
              min={1}
              max={20}
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm">{lineWidth}px</span>
          </div>

          <Button onClick={clearCanvas} variant="secondary">
            지우기
          </Button>
        </div>

        {/* 캔버스 */}
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="aspect-square w-full cursor-crosshair rounded-xl border-4 border-gray-300"
        />

        {/* 단어 입력 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">단어:</label>
          <Input
            type="text"
            placeholder="카드에 표시할 단어를 입력하세요"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full"
          />
        </div>

        <DialogFooter className="gap-4">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSave} className="bg-primary-80 hover:bg-primary-90 flex-1">
              저장
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
