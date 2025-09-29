import { toCurrency } from "@/lib/number";

type CompactPriceProps = {
  price: number | string;
  maxDecimals?: number; // maximum decimals to scan
  className?: string;
};

export default function PriceTiny({ price, maxDecimals = 12, className = "" }: CompactPriceProps) {
  const n = typeof price === "number" ? price : parseFloat(price);

  if (!isFinite(n) || isNaN(n)) {
    return <span className={className}>-</span>;
  }

  // Integer >= 1 => normal display
  if (Math.abs(n) >= 0.001) {
    return (
      <span className={`${className} flex items-center text-3xl font-bold text-[#000]`}>
        {/* ${n.toFixed(4)} */}${toCurrency(n, { decimals: 4 })}
      </span>
    );
  }

  // Convert to fixed to get enough precision
  const fixed = n.toFixed(maxDecimals); // e.g., "0.000005320000"
  const [intPart, fracPartRaw] = fixed.split(".");
  const fracPart = fracPartRaw ?? "";

  // Remove trailing zeros
  const fracTrimmed = fracPart.replace(/0+$/, "");

  // Count leading zeros after decimal
  const match = fracTrimmed.match(/^0+/);
  const zeroCount = match ? match[0].length : 0;
  const significantDigits = fracTrimmed.slice(zeroCount);

  return (
    <span className={`${className} flex items-center text-3xl font-bold text-[#000]`}>
      ${intPart}.
      {zeroCount > 0 && (
        <div className="flex w-max items-center">
          <span>0</span>
          <span className="zero-count relative top-[10px] text-[16px]">{zeroCount}</span>
        </div>
      )}
      {significantDigits}
    </span>
  );
}
