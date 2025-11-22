import Header from "./components/Header";
import CardGrid from "./components/CardGrid";
import BottomSection from "./components/BottomSection";
import { CardProvider } from "./contexts/CardContext";

export default function Home() {
  return (
    <CardProvider>
      <div className="bg-primary-100 flex min-h-screen touch-none flex-col p-13">
        <Header />
        <div className="-mt-[4.5vw]">
          <CardGrid />
        </div>
        <BottomSection />
      </div>
    </CardProvider>
  );
}
