// import { ZERO_ADDRESS } from "@/constants/common";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { type Address } from "viem";
import { metis } from "wagmi/chains";

interface TokenHolder {
  address: string;
  balance: bigint;
  percentage: number;
}

interface RouteApiResponse {
  items: {
    chainId: string;
    address: string;
    balance: string;
    percentage: number;
  }[];
  link: {
    next?: string;
    nextToken?: string;
  };
}

const TOTAL_TOKENS = BigNumber(1e9).multipliedBy(1e18);

export const useTokenHolders = (tokenAddress: Address, networkId: string = "mainnet") => {
  const buildHoldersUrl = (address: string) =>
    `https://api.routescan.io/v2/network/${networkId}/evm/${metis.id}/erc20/${address}/holders?limit=20`;

  return useQuery({
    queryKey: ["token-holders", tokenAddress, metis.id],
    queryFn: async () => {
      try {
        const response = await fetch(buildHoldersUrl(tokenAddress));
        if (!response.ok) {
          throw new Error("Failed to fetch token holders");
        }

        const data: RouteApiResponse = await response.json();

        const holders: TokenHolder[] = data.items.map(item => ({
          address: item.address,
          balance: BigInt(item.balance),
          percentage: BigNumber(item.balance).div(TOTAL_TOKENS).multipliedBy(100).toNumber(),
        }));

        // const totalPercentage = holders.reduce(
        // 	(sum, holder) => sum + holder.percentage,
        // 	0,
        // );

        // if (totalPercentage < 100) {
        // 	const remainingPercentage = 100 - totalPercentage;
        // 	const remainingBalance =
        // 		TOTAL_TOKENS.multipliedBy(remainingPercentage).div(100);

        // 	holders.push({
        // 		address: ZERO_ADDRESS,
        // 		balance: BigInt(remainingBalance.toFixed(0)),
        // 		percentage: remainingPercentage,
        // 	});
        // }

        return holders;
      } catch (error) {
        console.error("Error fetching token holders:", error);
        return [];
      }
    },
    enabled: !!tokenAddress && !!metis.id,
    staleTime: 5 * 60 * 1000,
  });
};
