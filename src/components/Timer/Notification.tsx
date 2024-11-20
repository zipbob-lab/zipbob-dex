export const triggerNotification = async (): Promise<"popup" | "push"> => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isMobile && Notification.permission === "granted") {
    new Notification("타이머 종료", {
      body: "타이머가 종료되었습니다!",
      icon: "/images/mainLogo.svg"
    });
    return "push"; // 푸쉬 알림이 성공한 경우
  } else {
    return "popup"; // 토스트 알림이 필요한 경우
  }
};

export const playSound = () => {
  const audio = new Audio("/audio/5-Handoff.mp3");
  audio.play();
};
