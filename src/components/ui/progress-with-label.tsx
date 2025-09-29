import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { isNotNil } from "es-toolkit";

interface ProgressWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  showLabel?: boolean;
  labelPosition?: "top" | "middle" | "bottom";
  labelClassName?: string;
}

const ProgressWithLabel = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressWithLabelProps
>(
  (
    { className, value, showLabel = false, labelPosition = "top", labelClassName, ...props },
    ref
  ) => {
    const renderLabel = () => (
      <div className={cn("flex justify-between text-sm", labelClassName)}>
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{value?.toFixed(2)}%</span>
      </div>
    );

    return (
      <div className="w-full">
        {showLabel && labelPosition === "top" && <div className="mb-2">{renderLabel()}</div>}

        <div className="relative">
          <ProgressPrimitive.Root
            ref={ref}
            className={cn(
              "relative h-5 w-full overflow-hidden rounded-full bg-[#34281C]",
              className
            )}
            {...props}
          >
            <ProgressPrimitive.Indicator
              className="bg-btn-gradient h-full w-full flex-1 rounded-full transition-all"
              style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
          </ProgressPrimitive.Root>

          {showLabel && labelPosition === "middle" && (
            <div
              className={cn(
                "text-primary-foreground absolute inset-0 flex items-center justify-center px-4",
                isNotNil(value) && value >= 55 && "text-primary-foreground",
                isNotNil(value) && value < 55 && "text-white"
              )}
            >
              <span className="text-sm font-bold">{value?.toFixed(2)}%</span>
            </div>
          )}
        </div>

        {showLabel && labelPosition === "bottom" && <div className="mt-2">{renderLabel()}</div>}
      </div>
    );
  }
);
ProgressWithLabel.displayName = "ProgressWithLabel";

export { ProgressWithLabel };
