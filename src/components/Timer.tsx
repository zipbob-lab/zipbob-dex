"use client";

import React, { useState, useEffect, memo } from "react";

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
    <div className="flex h-[48px] w-[240px] items-center justify-between">
      <button onClick={handleStartStop} className="w-1/4">
        {isRunning ? "중지" : "시작"}
      </button>

      <div className="flex justify-center space-x-2">
        <input
          type="number"
          value={String(Math.floor((timeLeft / (1000 * 60 * 60)) % 24)).padStart(2, "0")}
          onChange={handleHoursChange}
          min="0"
          className="w-8 text-center"
        />
        <p>시</p>
        <input
          type="number"
          value={String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(2, "0")}
          onChange={handleMinutesChange}
          min="0"
          className="w-8 text-center"
        />
        <p>분</p>

        <input
          type="number"
          value={String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0")}
          onChange={handleSecondsChange}
          min="0"
          className="w-8 text-center"
        />
        <p>초</p>
      </div>

      <button onClick={onClose} className="w-1/4">
        닫기
      </button>
    </div>
  );
});

Timer.displayName = "Timer";

export default Timer;
