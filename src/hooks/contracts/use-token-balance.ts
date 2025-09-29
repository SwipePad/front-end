import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";

export function useTokenBalance(tokenAddress?: string) {
  const userAddress = localStorage.getItem("address");

  const { data: balance, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`],
    query: {
      enabled: Boolean(tokenAddress && userAddress),
    },
  });

  return { data: balance, refetch };
}
