"use client";
import { useEffect, useState } from "react";

const ADJECTIVES = ["Sad", "Angry", "Crying", "Broken", "Lost", "Sleepy", "Toxic", "Based", "Sigma", "Cursed", "Dank", "Savage"];
const NOUNS = ["Samurai", "Ninja", "Ronin", "Otaku", "Senpai", "Kouhai", "Gamer", "Coder", "Hacker", "Troll", "Demon", "Ghost"];

export function useAvatar() {
  const [avatar, setAvatar] = useState<string>("Anonymous");

  useEffect(() => {
    let stored = localStorage.getItem("chuddi_avatar");
    if (!stored) {
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      stored = `${adj} ${noun}`;
      localStorage.setItem("chuddi_avatar", stored);
    }
    setAvatar(stored);
  }, []);

  return avatar;
}
