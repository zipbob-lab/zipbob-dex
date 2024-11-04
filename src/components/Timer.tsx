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

  const handleStart = () => {
    const totalMilliseconds = (inputHours * 60 * 60 + inputMinutes * 60 + inputSeconds) * 1000;
    setTimeLeft(totalMilliseconds);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
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
    <div>
      <div>
        <label>H:</label>
        <input
          type="number"
          value={String(Math.floor((timeLeft / (1000 * 60 * 60)) % 24)).padStart(2, "0")}
          onChange={handleHoursChange}
          min="0"
        />
        <label>M:</label>
        <input
          type="number"
          value={String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(2, "0")}
          onChange={handleMinutesChange}
          min="0"
        />
        <label>S:</label>
        <input
          type="number"
          value={String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0")}
          onChange={handleSecondsChange}
          min="0"
        />
      </div>
      <button onClick={handleStart}>시작</button>
      <button onClick={handleStop}>중지</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
});

Timer.displayName = "Timer";

export default Timer;
