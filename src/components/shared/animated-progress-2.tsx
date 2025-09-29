import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const AnimatedProgress2 = ({
  target = 90,
  duration = 7000,
  className = "",
}: {
  target?: number; // %
  duration?: number;
  className?: string;
}) => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setStarted(true));

    const finishTimer = setTimeout(() => setFinished(true), duration);

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(finishTimer);
    };
  }, [duration]);

  return (
    <div
      className={cn(
        "fixed top-[64px] z-50 h-2 w-[calc(100%-48px)] transform-none overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.12)] bg-[#C0F2CE]",
        className
      )}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundImage: "url('/images/token-detail/bg-progress.png')",
          backgroundSize: "200% 100%",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "0 0",
          transform: `translateX(${started ? -(100 - target) + "%" : "-100%"})`,
          transition: `transform ${duration}ms linear`,
          animation: finished ? "scroll-bg 2s linear infinite" : undefined,
        }}
      />
      <style>{`
        @keyframes scroll-bg {
          from {
            background-position: 40% 0;
          }
          to {
            background-position: 0 0;
          }
        }
      `}</style>
    </div>
  );
};
