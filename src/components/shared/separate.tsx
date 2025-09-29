import { cn } from "@/lib/utils";

interface SeparateProps {
  className?: string;
}

export function Separate({ className }: SeparateProps) {
  return (
    <div
      className={cn("h-[1px] w-full border-b border-dashed border-[#E6E8EC] py-1", className)}
    ></div>
  );
}
