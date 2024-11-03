import type { Metadata } from "next";
import Providers from "./providers";
import "@/styles/reset.css";
import "./globals.css";

import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
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
