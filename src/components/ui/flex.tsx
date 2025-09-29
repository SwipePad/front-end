import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  wrap?: boolean;
}

const gapClasses = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export function Flex({
  direction = "row",
  align = "start",
  justify = "start",
  gap = "none",
  wrap = false,
  className,
  ...props
}: FlexProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "col" && "flex-col",
        `items-${align}`,
        `justify-${justify}`,
        gapClasses[gap],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    />
  );
}
