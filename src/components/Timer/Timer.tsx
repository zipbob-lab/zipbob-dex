"use client";

import React, { useState, useEffect, memo } from "react";
import Image from "next/image";
import TimerIcon from "@images/timer/alarm.svg";
import PlayButton from "@images/timer/playButton.svg";
import StopButton from "@images/timer/stopButton.svg";
import TimerClose from "@images/timer/timerClose.svg";
import { playSound, triggerNotification } from "./Notification";

const Timer: React.FC = memo(() => {
  const INTERVAL = 1000;
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [inputMinutes, setInputMinutes] = useState<number>(0);
  const [inputSeconds, setInputSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - INTERVAL);
      }, INTERVAL);
    } else if (timeLeft <= 0 && isRunning) {
      clearInterval(timer!);
      setIsRunning(false);
      triggerNotification(); // 알림 호출
      playSound(); // 소리 재생
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      const totalMilliseconds = (inputMinutes * 60 + inputSeconds) * 1000;
      setTimeLeft(totalMilliseconds);
      setIsRunning(true);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputMinutes(value);
    setTimeLeft((value * 60 + inputSeconds) * 1000);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputSeconds(value);
    setTimeLeft((inputMinutes * 60 + value) * 1000);
  };

  return (
    <div className="fixed bottom-20 right-16 z-10">
      {/* 타이머 아이콘 버튼 */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md"
        >
          <Image src={TimerIcon} width={24} height={24} alt="타이머 아이콘" />
        </button>
      )}

      {/* 타이머 입력 UI */}
      {isVisible && (
        <div className="flex h-12 min-w-[186px] items-center justify-between gap-3 rounded-full border-2 bg-white p-2 shadow-lg">
          <button onClick={handleStartStop}>
            {isRunning ? (
              <Image src={StopButton} width={32} height={32} alt="중지" />
            ) : (
              <Image src={PlayButton} width={32} height={32} alt="시작" />
            )}
          </button>

          <div className="flex items-center">
            <input
              type="number"
              value={String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(2, "0")}
              onChange={handleMinutesChange}
              min="0"
              className="w-8 appearance-none text-center text-body-20"
            />
            <p className="text-body-16 text-Gray-400">분</p>
            <input
              type="number"
              value={String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0")}
              onChange={handleSecondsChange}
              min="0"
              className="w-8 appearance-none text-center text-body-20"
            />
            <p className="text-body-16 text-Gray-400">초</p>
          </div>

          <button onClick={() => setIsVisible(false)}>
            <Image src={TimerClose} width={20} height={20} alt="닫기 버튼" />
          </button>
        </div>
      )}
    </div>
  );
});

Timer.displayName = "Timer";

export default Timer;
