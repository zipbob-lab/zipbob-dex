"use client";

import ScrollUp from "@images/up.svg";
import Image from "next/image";

const ScrollTopButton = () => {
  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      onClick={() => handleGoToTop()}
      className="fixed bottom-10 right-16 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md transition-colors duration-200 hover:bg-Primary-200"
    >
      <Image src={ScrollUp} alt="위로 가는 화살표" />
    </button>
  );
};

export default ScrollTopButton;
