import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
}

const gapClasses = {
  none: "space-y-0",
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
};

export function Stack({ gap = "md", align = "stretch", className, ...props }: StackProps) {
  return (
    <div className={cn("flex flex-col", `items-${align}`, gapClasses[gap], className)} {...props} />
  );
}
