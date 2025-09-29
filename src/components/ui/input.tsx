import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    containerClassName?: string;
    rightSection?: React.ReactNode;
    leftSection?: React.ReactNode;
  }
>(({ className, type, containerClassName, rightSection, leftSection, ...props }, ref) => {
  return (
    <div
      className={cn(
        "hover:border-gradient focus-within:border-gradient pointer-events-none relative rounded-full border border-solid border-white/40 hover:border-transparent",
        containerClassName
      )}
    >
      {leftSection && <div className="absolute left-4 top-1/2 -translate-y-1/2">{leftSection}</div>}
      <input
        type={type}
        className={cn(
          "ring-offset-background file:text-foreground placeholder:text-muted-foreground user-invalid:border-red-500 pointer-events-auto flex w-full rounded-full border border-[#E6E8EC] px-4 py-[10px] text-sm leading-5 file:border-0 file:bg-transparent file:text-sm file:font-medium invalid:border-red-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          rightSection && "!pr-10",
          leftSection && "!pl-10",
          className
        )}
        ref={ref}
        {...props}
      />
      {rightSection && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSection}</div>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
