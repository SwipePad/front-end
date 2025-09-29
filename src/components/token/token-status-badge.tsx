import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const tokenStatusVariants = cva("", {
  variants: {
    variant: {
      active: "bg-gray-200 text-gray-800",
      voting: "bg-purple-200 text-purple-800",
      completed: "bg-green-200 text-green-800",
      upcoming: "bg-gray-200 text-gray-800",
    },
  },
  defaultVariants: {
    variant: "active",
  },
});

export type TokenStatus = "active" | "voting" | "completed" | "upcoming";

interface TokenStatusBadgeProps extends VariantProps<typeof tokenStatusVariants> {
  status: string;
}

export function TokenStatusBadge({ status }: TokenStatusBadgeProps) {
  const statusText = {
    active: "Bonding",
    voting: "Voting",
    completed: "DEX",
    upcoming: "Upcoming",
  };

  return (
    <Badge
      className={cn(
        "flex h-9 items-center gap-[5px] rounded-full px-5 text-base leading-none text-[#242424]",
        tokenStatusVariants({ variant: status as TokenStatus })
      )}
      variant="outline"
    >
      {statusText[status as TokenStatus]}
    </Badge>
  );
}
