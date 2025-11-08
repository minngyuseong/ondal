interface SpeechBubbleProps {
  children: React.ReactNode;
}

export default function SpeechBubble({ children }: SpeechBubbleProps) {
  return (
    <div className="relative inline-flex max-w-[33vw] items-center justify-center gap-2.5 rounded-[20px] bg-white px-4 py-2.5 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.10)]">
      <div className="justify-start text-base font-normal">{children}</div>
      <div className="absolute top-1/2 left-0 h-0 w-0 -translate-x-full -translate-y-1/2 border-t-[15px] border-r-[15px] border-b-[15px] border-t-transparent border-r-white border-b-transparent" />
    </div>
  );
}
