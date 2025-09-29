import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import IconTrendingUp from "@/assets/icons/trending-up.svg?react";

interface PercentageChangeBadgeProps {
  value: number;
  className?: string;
}

export function PercentageChangeBadge({ value, className }: PercentageChangeBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);

  const variants = {
    positive: "bg-btn-gradient text-primary-foreground",
    negative: "bg-red-200 text-red-800",
    neutral: "bg-gray-200 text-gray-800",
  };

  const arrows = {
    positive: <IconTrendingUp />,
    negative: <IconTrendingUp className="scale-x-[-1] scale-y-[-1] transform" />,
    neutral: "",
  };

  const variant = isPositive ? "positive" : isNegative ? "negative" : "neutral";

  if (!absoluteValue) return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        variants[variant],
        "flex h-9 items-center gap-[5px] rounded-full px-[10px] text-base leading-none",
        className
      )}
    >
      {arrows[variant]} {absoluteValue.toFixed(2)}%
    </Badge>
  );
}
