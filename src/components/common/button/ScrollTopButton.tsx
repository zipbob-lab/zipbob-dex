"use client";

import { useState, useEffect } from "react";
import ScrollUp from "@images/up.svg";
import Image from "next/image";

const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const halfWindowHeight = window.innerHeight / 2;
      setIsVisible(window.scrollY > halfWindowHeight);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleGoToTop}
      className="fixed bottom-6 right-16 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-colors duration-200 hover:bg-Primary-200"
    >
      <Image src={ScrollUp} alt="위로 가는 화살표" />
    </button>
  );
};

export default ScrollTopButton;
