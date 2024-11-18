export const triggerNotification = async (setPopupMessage: (msg: string | null) => void) => {
  if (Notification.permission === "granted") {
    new Notification("타이머 종료", {
      body: "타이머가 종료되었습니다!",
      icon: "/images/mainLogo.svg"
    });
    setPopupMessage("타이머가 종료되었습니다!");
  } else if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification("타이머 종료", {
        body: "타이머가 종료되었습니다!"
      });
      setPopupMessage("타이머가 종료되었습니다!");
    }
  }
};

export const playSound = () => {
  const audio = new Audio("/audio/5-Handoff.mp3");
  audio.play();
};
