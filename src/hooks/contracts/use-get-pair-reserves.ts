import { useAccount, useReadContracts } from "wagmi";
import type { Address } from "viem";
import { get } from "es-toolkit/compat";

import { UniswapV2PairAbi } from "@/smart-contracts/abi";

export const useGetPairReserves = (pairAddress: Address, projectTokenAddress: Address) => {
  const { chainId } = useAccount();

  const { data: pairInformation, refetch } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: pairAddress,
        abi: UniswapV2PairAbi,
        functionName: "token0",
        chainId,
      },
      {
        address: pairAddress,
        abi: UniswapV2PairAbi,
        functionName: "token1",
        chainId,
      },
      {
        address: pairAddress,
        abi: UniswapV2PairAbi,
        functionName: "getReserves",
        chainId,
      },
    ],
  });

  const token0 = get(pairInformation, [0]);
  const reserves = get(pairInformation, [2]);

  const projectTokenIndexInPair = token0 === projectTokenAddress ? 0 : 1;
  const tokenReserve = get(reserves, [projectTokenIndexInPair]);
  const ethReserve = get(reserves, [projectTokenIndexInPair === 0 ? 1 : 0]);

  return {
    data: {
      tokenReserve,
      ethReserve,
    },
    refetch,
  };
};
