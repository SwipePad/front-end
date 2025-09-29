import { Loader2 } from "lucide-react";
import { PumpeAndPriceResponse } from "@/services/models";
import { TokenCard } from "./token-card";

interface TokenGridProps {
  tokens: readonly PumpeAndPriceResponse[];
}

export const TokenGrid = ({ tokens }: TokenGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tokens.map((token, index) => (
        <TokenCard key={index} {...token} />
      ))}
    </div>
  );
};

TokenGrid.Skeleton = function TokenGridSkeleton() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};
