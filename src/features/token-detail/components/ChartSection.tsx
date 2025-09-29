import LineTradingChart from "@/features/token-detail/components/line-tradingview-chart";

export function ChartSection({
  tokenAddress,
  currentPrice,
}: {
  tokenAddress: string | undefined;
  tokenSymbol: string | undefined;
  className?: string;
  currentPrice: string;
}) {
  if (!tokenAddress) return;

  return (
    <div className="h-[380px] w-full border-b border-[#E6E8EC]">
      {/* <TradingViewChart funId={tokenAddress} symbol={`PUMPE:${tokenSymbol}/WLD`} /> */}
      <LineTradingChart
        funId={tokenAddress}
        currentPrice={currentPrice}
        key={`${tokenAddress}/${new Date().getTime()}`}
      />
    </div>
  );
}
