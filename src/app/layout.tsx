import type { Metadata } from "next";
import Providers from "./providers";
import "../styles/reset.css";
import "./globals.css";

import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "집밥도감",
  description: "요리 초보 사용자들을 위한 레시피 안내 서비스 사이트"
};

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap"
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ReactQueryClientProvider>
    <html lang="ko" className={pretendard.variable}>
      <body className="font-pretendard">
        <Providers>{children}</Providers>
      </body>
    </html>
    // </ReactQueryClientProvider>
  );
}
