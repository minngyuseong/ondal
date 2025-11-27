import type { Metadata, Viewport } from "next";

import "./globals.css";

import localFont from "next/font/local";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "온달",
  description: "어떤 단어 카드를 골라가서 맨 아래의 반칸에 낱글 재생 버튼을 눌러보세요!",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "온달",
  },
  icons: {
    icon: [{ url: "/logos/logo_icon.png" }],
    apple: [{ url: "/logos/logo_icon.png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FF7848",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased ${pretendard.variable}`}>{children}</body>
    </html>
  );
}
