import type { Metadata } from "next";
import Providers from "./providers";
import "@/styles/reset.css";
import "./globals.css";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import localFont from "next/font/local";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "@/components/common/Searchbar";

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
        <SearchBar />
        <Providers>{children}</Providers>
        {/* <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        /> */}
      </body>
    </html>
    // </ReactQueryClientProvider>
  );
}
