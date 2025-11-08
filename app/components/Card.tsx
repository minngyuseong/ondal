"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCards } from "../contexts/CardContext";

interface CardProps {
  imageSrc: string;
  alt?: string;
  index: number;
}

export default function Card({ imageSrc, alt = "카드 이미지", index }: CardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateCard } = useCards();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("cardImage", imageSrc);
    e.dataTransfer.setData("cardIndex", index.toString());
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleEdit = (newImageData: string) => {
    updateCard(index, newImageData);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={() => setIsEditModalOpen(true)}
        className="relative aspect-square cursor-grab overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-lg active:cursor-grabbing"
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 25vw, 20vw"
        />
      </div>

      {/* 수정 모달 - AddCardButton과 동일한 그리기 기능 */}
      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEdit}
        initialImage={imageSrc}
      />
    </>
  );
}

// 카드 수정 모달 컴포넌트
function EditCardModal({
  isOpen,
  onClose,
  onSave,
  initialImage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageData: string) => void;
  initialImage: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);

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
    img.src = initialImage;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
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

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== "mousedown") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

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
    onSave(imageData);
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
          className="aspect-square w-full cursor-crosshair rounded-xl border-4 border-gray-300"
        />

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
