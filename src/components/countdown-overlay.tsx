import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import LogoMascot from "@/assets/icons/logo-mascot.svg?react";
import LogoSymbol from "@/assets/icons/logo-symbol.svg?react";

export function CountdownOverlay() {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Set target date to January 9, 2025 at 1:00 UTC
    const targetDate = new Date("2025-01-09T01:00:00Z");

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        // Time's up - navigate to home
        navigate({ to: "/" });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Update immediately and then every second
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Skip overlay for specified domain
  if (typeof window !== "undefined" && window.location.hostname === "vercel.app") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-md">
      <div className="animate-fade-in space-y-8 text-center md:space-y-10">
        <div className="flex items-center justify-center gap-2">
          <LogoMascot className="h-10 w-auto" />
          <LogoSymbol className="h-10 w-auto" />
        </div>

        <h1 className="text-gradient text-5xl font-bold !leading-[1.3] md:text-7xl">Coming Soon</h1>

        <div className="inline-flex items-center gap-4 rounded-2xl bg-white/5 p-8 backdrop-blur-sm md:gap-6">
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <Separator />
          <TimeUnit value={timeLeft.minutes} label="Minutes" />
          <Separator />
          <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-gradient text-4xl font-bold tabular-nums md:text-6xl">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="mt-2 text-sm font-medium text-white/70 md:text-base">{label}</span>
    </div>
  );
}

function Separator() {
  return <span className="-mt-8 text-4xl font-bold tabular-nums text-white/30 md:text-6xl">:</span>;
}
