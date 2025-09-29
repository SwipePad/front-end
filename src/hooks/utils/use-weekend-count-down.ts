import { useEffect, useState } from "react";

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export function useCountdownToSunday(): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeUntilSunday());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilSunday());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

function getTimeUntilSunday(): TimeLeft {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday = 0

  // Days until Sunday
  const daysUntilSunday = (7 - dayOfWeek) % 7;
  const endOfSunday = new Date(now);
  endOfSunday.setDate(now.getDate() + daysUntilSunday);
  endOfSunday.setHours(23, 59, 59, 999);

  const diff = endOfSunday.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: padZero(days),
    hours: padZero(hours),
    minutes: padZero(minutes),
    seconds: padZero(seconds),
  };
}

function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}
