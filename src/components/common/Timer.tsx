"use client";

import React, { useState, useEffect, memo } from "react";

import Image from "next/image";
import PlayButton from "@images/playButton.svg";
import StopButton from "@images/stopButton.svg";
import TimerClose from "@images/closeX.svg";

interface TimerProps {
  onClose?: () => void;
}

const Timer: React.FC<TimerProps> = memo(({ onClose }) => {
  const INTERVAL = 1000;
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [inputHours, setInputHours] = useState<number>(0);
  const [inputMinutes, setInputMinutes] = useState<number>(0);
  const [inputSeconds, setInputSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - INTERVAL);
      }, INTERVAL);
    } else if (timeLeft <= 0 && isRunning) {
      clearInterval(timer!);
      setIsRunning(false);
      alert("타이머가 종료되었습니다!");
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      const totalMilliseconds = (inputHours * 60 * 60 + inputMinutes * 60 + inputSeconds) * 1000;
      setTimeLeft(totalMilliseconds);
      setIsRunning(true);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputHours(value);
    setTimeLeft((value * 60 * 60 + inputMinutes * 60 + inputSeconds) * 1000);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputMinutes(value);
    setTimeLeft((inputHours * 60 * 60 + value * 60 + inputSeconds) * 1000);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputSeconds(value);
    setTimeLeft((inputHours * 60 * 60 + inputMinutes * 60 + value) * 1000);
  };

  return (
    <div className="flex h-[48px] w-[340px] items-center justify-between rounded-full border-2 p-2">
      <button onClick={handleStartStop} className="mr-4 w-1/4">
        {isRunning ? (
          <Image src={StopButton} width={32} height={32} alt="중지" className="h-full w-full" />
        ) : (
          <Image src={PlayButton} width={32} height={32} alt="시작" className="h-full w-full" />
        )}
      </button>

      <div className="flex items-center">
        <input
          type="number"
          value={String(Math.floor((timeLeft / (1000 * 60 * 60)) % 24)).padStart(2, "0")}
          onChange={handleHoursChange}
          min="0"
          className="w-[50px] appearance-none text-center text-[28px]"
        />
        <p className="mr-3 text-[20px]">시</p>
        <input
          type="number"
          value={String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(2, "0")}
          onChange={handleMinutesChange}
          min="0"
          className="w-[50px] appearance-none text-center text-[28px]"
        />
        <p className="mr-3 text-[20px]">분</p>
        <input
          type="number"
          value={String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0")}
          onChange={handleSecondsChange}
          min="0"
          className="w-[50px] appearance-none text-center text-[28px]"
        />
        <p className="mr-3 text-[20px]">초</p>
      </div>

      <button onClick={onClose} className="w-1/4">
        <Image src={TimerClose} width={20} height={20} alt="닫기 버튼" />
      </button>
    </div>
  );
});

Timer.displayName = "Timer";

export default Timer;
