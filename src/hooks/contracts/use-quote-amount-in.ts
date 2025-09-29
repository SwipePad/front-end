import { MemeAbi } from "@/smart-contracts/abi";
import { formatEther, parseEther } from "viem";
import { useReadContract } from "wagmi";
import { estimateSwap } from "@/utils/holdstation-swap";
import { useEffect, useState } from "react";

type UseQuoteAmountInProps = {
  tokenId: string;
  amountOut: number;
  isBuy?: boolean;
  isOnDex?: boolean;
};

const useQuoteAmountIn = ({
  tokenId,
  amountOut,
  isBuy = true,
  isOnDex = false,
}: UseQuoteAmountInProps) => {
  const [quoteWldAmountIn, setQuoteWldAmountIn] = useState<string>("0");

  const { data: quoteAmountInData } = useReadContract({
    address: import.meta.env.VITE_TOKEN_MEME_ADDRESS,
    abi: MemeAbi,
    functionName: "quoteAmountIn",
    args: [tokenId, parseEther(amountOut.toString()), isBuy],
    query: {
      enabled: !!tokenId && !isOnDex,
    },
  });

  useEffect(() => {
    if (isOnDex) {
      getQuoteOnDex().then(quote => {
        setQuoteWldAmountIn(quote);
      });
    } else {
      const quote = quoteAmountInData ? formatEther((quoteAmountInData as any)[1]) : "0";
      setQuoteWldAmountIn(quote);
    }
  }, [tokenId, amountOut, isBuy, isOnDex, quoteAmountInData]);

  const getQuoteOnDex = async (): Promise<string> => {
    try {
      if (!tokenId) {
        return "0";
      }
      const nativeToken = import.meta.env.VITE_NATIVE_TOKEN_ADDRESS as any;
      const tokenIn = !isBuy ? tokenId : nativeToken;
      const tokenOut = !isBuy ? nativeToken : tokenId;

      const data = await estimateSwap({
        tokenIn,
        tokenOut,
        amountIn: amountOut.toString(),
        slippage: "0.01", // Default slippage of 1%
      });

      return (data.addons?.outAmount ?? amountOut).toString();
    } catch (error) {
      console.error("Error getting quote on DEX:", error);
      return "0";
    }
  };

  return { quoteWldAmountIn };
};

export default useQuoteAmountIn;
