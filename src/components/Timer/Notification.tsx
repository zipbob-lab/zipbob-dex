export const triggerNotification = () => {
  if (Notification.permission === "granted") {
    new Notification("타이머 종료", {
      body: "타이머가 종료되었습니다!"
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
};

export const playSound = () => {
  const audio = new Audio("/audio/5-Handoff.mp3");
  audio.play();
};
