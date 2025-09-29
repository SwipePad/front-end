import { BottomDraw } from "@/components/shared/bottom-draw";
import { ChartSection } from "@/features/token-detail/components/ChartSection";
import { useTranslation } from "react-i18next";

type CommentsBottomDrawProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  tokenAddress: string;
  tokenSymbol: string;
  currentPrice: string;
};

export function ChartBottomDraw({
  open,
  setOpen,
  tokenAddress,
  tokenSymbol,
  currentPrice,
}: CommentsBottomDrawProps) {
  const { t } = useTranslation();
  return (
    <BottomDraw isOpen={open} onClose={() => setOpen(false)} title={t("feed.tradingViewChart")}>
      <div className="h-[450px] space-y-4 overflow-y-auto p-4">
        <ChartSection
          tokenAddress={tokenAddress}
          tokenSymbol={tokenSymbol}
          currentPrice={currentPrice}
        />
      </div>
    </BottomDraw>
  );
}
