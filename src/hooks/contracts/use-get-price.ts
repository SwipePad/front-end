import { useMemeControllerGetQuotePrice } from "@/services/queries";
import { useEffect } from "react";

const useGetPrice = (refetchTime: number | null = null) => {
  const { data: wldPrice, refetch: refetchPrice } = useMemeControllerGetQuotePrice();

  const convertUsdToWld = (usdAmount: number | string) => {
    if (typeof usdAmount === "string") {
      usdAmount = Number(usdAmount);
    }
    if (!wldPrice) return 0;
    return usdAmount / wldPrice;
  };

  const convertWldToUsd = (wldAmount: number | string) => {
    if (typeof wldAmount === "string") {
      wldAmount = Number(wldAmount);
    }
    if (!wldPrice) return 0;
    return wldAmount * wldPrice;
  };

  useEffect(() => {
    if (refetchTime === null) return;
    const interval = setInterval(() => {
      refetchPrice();
    }, refetchTime);
    return () => clearInterval(interval);
  }, [refetchTime, refetchPrice]);

  return {
    wldPrice,
    refetchPrice,
    convertUsdToWld,
    convertWldToUsd,
  };
};

export default useGetPrice;
