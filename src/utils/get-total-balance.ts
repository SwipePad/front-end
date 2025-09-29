import { MemeResponse } from "@/services/models";
import { TotalBalance } from "@/types/total-balance.type";

export const getTotalBalance = (
  memes: (MemeResponse & {
    rawBalance?: string;
    readableBalance?: string;
  })[]
): TotalBalance => {
  const currentTotalBalance = memes.reduce((acc, meme) => {
    return (
      acc + parseFloat(meme.readableBalance ?? "0") * parseFloat(meme.currentPriceByUsd ?? "0")
    );
  }, 0);

  const previousTotalBalance = memes.reduce((acc, meme) => {
    const currentPrice = parseFloat(meme.currentPriceByUsd ?? "0");
    const previousPrice = currentPrice / ((100 + (parseFloat(meme.price24hChange) ?? 0)) / 100);

    return acc + parseFloat(meme.readableBalance ?? "0") * previousPrice;
  }, 0);

  const change24h = currentTotalBalance - previousTotalBalance;

  return {
    currentTotalBalance,
    previousTotalBalance,
    change24h,
  };
};
