import { useMemeControllerCreateSwapHumanMode } from "@/services/queries";
import { MemeAbi } from "@/smart-contracts/abi";
import { useMemo } from "react";
import { formatEther, getAddress } from "viem";
import { useReadContract } from "wagmi";

type UseGetBuyNonHumanProps = {
  tokenId: string;
  isGuarded: boolean;
  isUserVerified: boolean;
};

const useGetBuyNonHuman = ({
  tokenId,
  isGuarded = false,
  isUserVerified,
}: UseGetBuyNonHumanProps) => {
  const { data: humanVerifiedData } = useMemeControllerCreateSwapHumanMode(
    {
      tokenAddress: getAddress(tokenId),
    },
    {
      query: {
        enabled: !!tokenId && !!isGuarded,
      },
    }
  );

  const { data: quoteAmountInData } = useReadContract({
    address: import.meta.env.VITE_TOKEN_MEME_ADDRESS,
    abi: MemeAbi,
    functionName: "quoteAmountIn",
    args: [tokenId, BigInt(humanVerifiedData?.remainingTokenAmountAllocation || 0), true],
    query: {
      enabled: !!tokenId && !!isGuarded,
    },
  });

  const nonHumanMaxWldCanBuy = quoteAmountInData ? formatEther((quoteAmountInData as any)[1]) : "0";

  const listNonHumanSelectedQuickBuy = useMemo(() => {
    if (!isUserVerified && Number(nonHumanMaxWldCanBuy) > 0 && !!isGuarded) {
      const percentages = [0.2, 0.5, 0.7];

      const percentOptions = percentages.map(percent => {
        const value = Number(nonHumanMaxWldCanBuy) * percent;
        return {
          label: `${value.toFixed(2)} WLD`,
          value: `${value}WLD`,
        };
      });

      const maxOption = {
        label: `MAX`,
        value: `${nonHumanMaxWldCanBuy}WLD`,
      };

      return [...percentOptions, maxOption];
    }

    return [];
  }, [nonHumanMaxWldCanBuy, isUserVerified, isGuarded]);

  return { listNonHumanSelectedQuickBuy, nonHumanMaxWldCanBuy, humanVerifiedData };
};

export default useGetBuyNonHuman;
