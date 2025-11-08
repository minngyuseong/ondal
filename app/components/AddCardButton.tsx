"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCards } from "../contexts/CardContext";

export default function AddCardButton() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const { addCard } = useCards();

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault(); // 터치 시 스크롤 방지
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
    // CSS 크기와 캔버스 해상도 비율 계산
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // 터치 이벤트와 마우스 이벤트 구분
    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      // 터치 이벤트
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }
    } else {
      // 마우스 이벤트
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
    addCard(imageData);
    // Dialog가 자동으로 닫힘 (DialogClose 버튼 클릭됨)
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="h-20 gap-[15px] rounded-[20px] bg-white px-[26px] shadow-lg"
        >
          <Image src="icons/plus.svg" alt="추가하기" width={38} height={38} />
          <span>새로운 카드 추가하기</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl" onOpenAutoFocus={initCanvas}>
        <DialogHeader>
          <DialogTitle>새 카드 그리기</DialogTitle>
        </DialogHeader>

        {/* 그리기 도구 */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">색상:</label>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-12 w-12 cursor-pointer p-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">두께:</label>
            <Input
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
