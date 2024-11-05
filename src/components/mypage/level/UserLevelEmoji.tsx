import React from "react";

interface UserLevelEmojiProps {
  userRank: number;
}

const levelEmojis: { [key: number]: string } = {
  0: "🌱",
  1: "🪺",
  2: "🥚",
  3: "🐣",
  4: "🐥",
  5: "🐓"
};

const UserLevelEmoji: React.FC<UserLevelEmojiProps> = ({ userRank }) => {
  const levelEmoji = levelEmojis[userRank] || "🧑🏻‍🍳";
  return <span className="text-xl">{levelEmoji}</span>;
};

export default UserLevelEmoji;
