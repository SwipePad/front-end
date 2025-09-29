export const getTokenInForQuoteOut = (
  quoteReserve: bigint,
  tokenReserve: bigint,
  desiredQuote: bigint,
  fee: number = 0.003
): bigint => {
  if (desiredQuote >= quoteReserve) {
    throw new Error("Desired output exceeds quote reserve");
  }

  // Multiply first to preserve precision
  const numerator = desiredQuote * tokenReserve;
  const denominator = quoteReserve - desiredQuote;

  // apply fee adjustment
  const feeFactor = 1 - fee;

  // Since JS BigInt cannot handle decimals, scale feeFactor
  const SCALE = 1_000_000n; // 1e6 scaling
  const feeFactorScaled = BigInt(Math.floor(feeFactor * Number(SCALE)));

  return (numerator * SCALE) / (denominator * feeFactorScaled);
};
