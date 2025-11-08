"use client";

export default function ActionButtons() {
  const handlePlay = () => {
    console.log("배치 카드 음성 재생");
  };

  const handleReset = () => {
    console.log("카드 배치 세로 고쳐");
  };

  return (
    <div className="flex flex-col gap-4 w-48">
      <button
        onClick={handlePlay}
        className="bg-white rounded-2xl px-6 py-4 flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all active:scale-95"
      >
        <span className="text-2xl">▶️</span>
        <span className="text-sm font-medium">배치 카드 음성 재생</span>
      </button>
      <button
        onClick={handleReset}
        className="bg-white rounded-2xl px-6 py-4 flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all active:scale-95"
      >
        <span className="text-2xl">🔄</span>
        <span className="text-sm font-medium">카드 배치 세로 고쳐</span>
      </button>
    </div>
  );
}
