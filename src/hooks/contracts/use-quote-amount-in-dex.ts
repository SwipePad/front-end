import { MemeAbi } from "@/smart-contracts/abi";
import { Address, erc20Abi, formatEther, parseEther } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import { useEffect, useState } from "react";
import { getTokenInForQuoteOut } from "@/lib/swap";
import { NATIVE_TOKEN_ADDRESS } from "@/constants/blockchain";

type UseQuoteAmountInProps = {
  tokenId: string;
  amountOut: number;
  isBuy?: boolean;
  isOnDex?: boolean;
  pairAddress: string | undefined;
  minAmountOut?: number; // Optional minimum amount threshold
};

const useQuoteAmountInOnDex = ({
  tokenId,
  amountOut,
  pairAddress,
  isBuy = true,
  isOnDex = false,
  minAmountOut = 0.0001, // Default to 0 to allow any amount
}: UseQuoteAmountInProps) => {
  const [quoteWldAmountIn, setQuoteWldAmountIn] = useState<string>("0");

  const { data: quoteAmountInData } = useReadContract({
    address: import.meta.env.VITE_TOKEN_MEME_ADDRESS,
    abi: MemeAbi,
    functionName: "quoteAmountIn",
    args: [tokenId, parseEther(amountOut.toFixed(18)), isBuy],
    query: {
      enabled: !!tokenId && !isOnDex && amountOut >= minAmountOut && isFinite(amountOut),
    },
  });

  const { data: poolTokenBalance } = useReadContracts({
    contracts: [NATIVE_TOKEN_ADDRESS, tokenId].map(token => ({
      address: token as Address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [pairAddress as Address],
    })),
    query: {
      enabled: !!pairAddress && !!tokenId && !!isOnDex,
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

  const [isLoadingQuoteOnDex, setIsLoadingQuoteOnDex] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isOnDex && poolTokenBalance) {
      setIsLoadingQuoteOnDex(true);
      getQuoteOnDex()
        .then(quote => {
          if (isMounted) {
            setQuoteWldAmountIn(quote);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingQuoteOnDex(false);
          }
        });
    } else {
      setIsLoadingQuoteOnDex(false);
      const quote = quoteAmountInData ? formatEther((quoteAmountInData as any)[1]) : "0";
      setQuoteWldAmountIn(quote);
    }
    return () => {
      isMounted = false;
    };
  }, [tokenId, amountOut, isBuy, isOnDex, quoteAmountInData, poolTokenBalance]);

  const getQuoteOnDex = async (): Promise<string> => {
    try {
      if (!tokenId || !poolTokenBalance) {
        return "0";
      }

      const approximateAmountIn = getTokenInForQuoteOut(
        poolTokenBalance[0].result as bigint,
        poolTokenBalance[1].result as bigint,
        parseEther(amountOut.toFixed(18)),
        0.01
      );

      return formatEther(approximateAmountIn);
    } catch (error) {
      console.error("Error getting quote on DEX:", error);
      return "0";
    }
  };

  // Early return after all hooks have been called
  if (amountOut < minAmountOut || !isFinite(amountOut) || isNaN(amountOut)) {
    return { quoteWldAmountIn: "0", isLoadingQuoteOnDex: false };
  }

  return { quoteWldAmountIn, isLoadingQuoteOnDex };
};

export default useQuoteAmountInOnDex;
