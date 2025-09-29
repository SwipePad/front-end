import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
}

export function Center({ inline = false, className, ...props }: CenterProps) {
  return (
    <div
      className={cn("flex items-center justify-center", inline && "inline-flex", className)}
      {...props}
    />
  );
}
