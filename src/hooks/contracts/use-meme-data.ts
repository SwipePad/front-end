import { useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { MemeAbi } from "@/smart-contracts/abi";
import { estimateSwap } from "@/utils/holdstation-swap";
import { useEffect, useState } from "react";

export type MemeDataResponse = {
  actualAmountIn: string;
  amountOut: string;
  nativeFee: string;
  refund: string;
};
const nativeToken = import.meta.env.VITE_NATIVE_TOKEN_ADDRESS as any;

export const useMemeData = (
  memeAddress: string,
  amount: string | number,
  isBuy: boolean,
  slippage: number = 0.01, // Default slippage of 1%
  isOnDex: boolean,
  enabled: boolean = true
) => {
  const [state, setState] = useState<MemeDataResponse | null>(null);
  const { data: quoteAmountOut } = useReadContract({
    address: import.meta.env.VITE_TOKEN_MEME_ADDRESS as any,
    abi: MemeAbi,
    functionName: "quoteAmountOut",
    args: [memeAddress, parseEther(amount.toString()), isBuy],
    query: {
      enabled: !isOnDex && !!memeAddress && !!amount,
    },
  });

  const DEFAULT_MEME_DATA_ISNOT_ON_DEX = {
    actualAmountIn: quoteAmountOut ? formatEther((quoteAmountOut as any)[0]) : "0",
    amountOut: quoteAmountOut ? formatEther((quoteAmountOut as any)[1]) : "0",
    nativeFee: quoteAmountOut ? (quoteAmountOut as any)[2] : "0",
    refund: quoteAmountOut ? formatEther((quoteAmountOut as any)[3]) : "0",
  };

  useEffect(() => {
    if (!enabled) {
      setState(null);
      return;
    }

    if (isOnDex && amount && nativeToken) {
      getDataOnDex().then(data => {
        setState(data);
      });
    } else {
      setState(DEFAULT_MEME_DATA_ISNOT_ON_DEX);
    }
  }, [amount, quoteAmountOut, nativeToken]);

  const getDataOnDex = async (): Promise<MemeDataResponse | null> => {
    try {
      if (!memeAddress || !amount || !nativeToken) {
        return null;
      }
      const tokenIn = !isBuy ? memeAddress : nativeToken;
      const tokenOut = !isBuy ? nativeToken : memeAddress;
      const data = await estimateSwap({
        tokenIn,
        tokenOut,
        amountIn: amount.toString(),
        slippage: slippage.toString(),
      });
      return {
        actualAmountIn: amount.toString(),
        amountOut: (data.addons?.outAmount ?? 0).toString(),
        nativeFee: (data.addons?.feeAmountOut ?? 0).toString(),
        refund: "0",
      };
    } catch (error) {
      return null;
    }
  };

  return {
    state,
    getDataOnDex,
    DEFAULT_MEME_DATA_ISNOT_ON_DEX,
  };
};
