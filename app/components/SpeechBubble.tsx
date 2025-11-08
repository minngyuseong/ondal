interface SpeechBubbleProps {
  children: React.ReactNode;
}

export default function SpeechBubble({ children }: SpeechBubbleProps) {
  return (
    <div className="relative max-w-[280px] bg-white px-4 py-2.5 rounded-[20px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.10)] inline-flex justify-center items-center gap-2.5">
      <div className="justify-start text-base font-normal">{children}</div>
      <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[15px] border-r-white" />
    </div>
  );
}
