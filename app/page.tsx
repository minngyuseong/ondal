"use client";
import Header from "./components/Header";
import CardGrid from "./components/CardGrid";
import BottomSection from "./components/BottomSection";
import { CardProvider, useCards } from "./contexts/CardContext";
import CardImage from "./components/CardImage";

function AppContent() {
  const { draggingCard, ghostPos } = useCards();

  return (
    <div className="bg-primary-100 flex min-h-screen touch-none flex-col p-13">
      <Header />
      <div className="-mt-[4.5vw]">
        <CardGrid />
      </div>
      <BottomSection />
      {draggingCard && ghostPos && (
        <div
          style={{
            position: "fixed",
            left: ghostPos.x,
            top: ghostPos.y,
            pointerEvents: "none",
            zIndex: 1000,
            width: 184,
            height: 184,
            opacity: 0.7,
          }}
        >
          <CardImage card={draggingCard} />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <CardProvider>
      <AppContent />
    </CardProvider>
  );
}
