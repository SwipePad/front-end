import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
}

const gapClasses = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export function Grid({ cols = 1, gap = "md", responsive = true, className, ...props }: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        responsive
          ? {
              1: "grid-cols-1",
              2: "grid-cols-1 sm:grid-cols-2",
              3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
              4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
              5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
              6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
              12: "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-12",
            }[cols]
          : `grid-cols-${cols}`,
        gapClasses[gap],
        className
      )}
      {...props}
    />
  );
}
