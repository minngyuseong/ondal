import Image from "next/image";
import SpeechBubble from "./SpeechBubble";
import AddCardButton from "./AddCardButton";

export default function Header() {
  return (
    <header className="flex justify-between">
      <div className="flex gap-4">
        {/* 온달 Logo */}
        <div className="flex flex-col gap-[7px]">
          <object data="/logos/logo_ko.svg" className="w-[10vw]" />
          <object data="/logos/logo_en.svg" className="w-[10vw]" />
        </div>

        {/* 수달 Character with Speech Bubble */}
        <div className="flex items-start gap-2">
          <Image
            src="/images/ondal.png"
            alt="온달 Logo"
            width={127}
            height={181}
            className="-mt-5 h-auto w-[12vw]"
          />
          <SpeechBubble>
            아래의 단어 카드를 끌어당겨서 <br />맨 아래의 빈칸에 넣고 재생 버튼을 누르면 <br />
            음성이 순서대로 흘러나와요!
          </SpeechBubble>
        </div>
      </div>

      {/* Right Icon */}
      <AddCardButton />
    </header>
  );
}
