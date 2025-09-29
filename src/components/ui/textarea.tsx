import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    containerClassName?: string;
  }
>(({ className, containerClassName, ...props }, ref) => {
  return (
    <div
      className={cn(
        "hover:border-gradient focus-within:border-gradient pointer-events-none rounded-2xl border border-solid border-white/40 focus-within:border-transparent focus-within:before:rounded-2xl hover:border-transparent hover:before:rounded-2xl",
        containerClassName
      )}
    >
      <textarea
        className={cn(
          "ring-offset-background placeholder:text-muted-foreground pointer-events-auto flex min-h-[80px] w-full rounded-2xl bg-[#3B322F] px-3 py-2 text-base focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
