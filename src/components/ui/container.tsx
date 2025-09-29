import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  xs: "max-w-screen-sm",
  sm: "max-w-screen-md",
  md: "max-w-screen-lg",
  lg: "max-w-screen-xl",
  xl: "max-w-screen-2xl",
};

export function Container({ size = "xl", className, ...props }: ContainerProps) {
  return <div className={cn("container mx-auto px-4", sizeClasses[size], className)} {...props} />;
}
