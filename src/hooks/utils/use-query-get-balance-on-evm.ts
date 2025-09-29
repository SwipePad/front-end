import { QUERY_KEY } from "@/constants/query-key";
import { MemeResponse } from "@/services/models";
import getBalancesOnEvm from "@/utils/get-balances-on-evm";
import { useQuery } from "@tanstack/react-query";
import { getAddress } from "viem";

export const useQueryGetBalanceOnEvm = (address: string, memes?: readonly MemeResponse[]) => {
  return useQuery({
    queryKey: [QUERY_KEY.BALANCE_ON_EVM],
    queryFn: async () => {
      const balance = await getBalancesOnEvm(
        getAddress(address ?? ""),
        memes?.map(item => getAddress(item.tokenAddress)) ?? []
      );

      return balance;
    },
    enabled: !!address && !!memes,
  });
};
