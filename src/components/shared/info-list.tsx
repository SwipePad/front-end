import { cn } from "@/lib/utils";

export interface InfoItem {
  key: string;
  value: string;
  valueClassName?: string;
}

interface InfoListProps {
  items: InfoItem[];
  className?: string;
  keyClassName?: string;
  size?: "sm" | "md";
}

export function InfoList({ items, className, keyClassName, size = "md" }: InfoListProps) {
  const textSizes = {
    sm: "text-sm",
    md: "text-base",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className={cn("text-white/80", textSizes[size], keyClassName)}>{item.key}</span>
          <span className={cn("font-bold text-white", textSizes[size], item.valueClassName)}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
