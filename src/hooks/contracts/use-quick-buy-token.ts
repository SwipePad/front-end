import { useUser } from "@/components/providers/user-provider";
import { toast } from "@/components/shared/toast";
import {
  CreateMemeSwapRequestResponse,
  MemeDetailResponseStatus,
  MemeResponse,
  UserAndFollowStatusResponse,
} from "@/services/models";
import { makeApiRequest } from "@/services/trading-chart/helpers";
import { MemeAbi } from "@/smart-contracts/abi";
import { sendHapticFeedbackCommand } from "@/utils/send-haptic-feedback-command";
import { wagmiConfig } from "@/wagmi";
import { readContract } from "@wagmi/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { erc20Abi, getAddress } from "viem";

type UseQuickBuyTokenProps = {
  amount: number;
  tokenAddress: string;
};

const NATIVE_TOKEN_ADDRESS = import.meta.env.VITE_NATIVE_TOKEN_ADDRESS;
const TOKEN_MEME_ADDRESS = import.meta.env.VITE_TOKEN_MEME_ADDRESS;

const useQuickBuyToken = ({ tokenAddress, amount }: UseQuickBuyTokenProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const { address } = useUser();

  const quickBuyToken = async () => {
    try {
      setIsLoading(true);
      if (!address) {
        toast.error(t("buy.pleaseLoginToBuyToken"));
        return;
      }

      if (!amount || amount <= 0) {
        toast.error(t("buy.amountMustBeGreaterThan0"));
        return;
      }

      if (!tokenAddress) {
        toast.error("Token address is not available");
        return;
      }

      const userDetail: UserAndFollowStatusResponse[] | undefined = await makeApiRequest(
        `/api/user/${getAddress(address || "")}`
      );

      if (!userDetail || !userDetail.length) {
        toast.error(t("buy.cannotBuyTokenAtThisTime"));
        return;
      }

      console.log("userDetail[0].nullifierHash", userDetail[0].nullifierHash);
      const isUserVerified = !!userDetail[0].nullifierHash;
      console.log("isUserVerified: ", isUserVerified);

      // get token detail
      const tokenDetail: MemeResponse = await makeApiRequest(`/api/meme/${tokenAddress}`);
      console.log("tokenDetail: ", tokenDetail);

      if (!tokenDetail) {
        toast.error("Failed to fetch token details");
        return;
      }

      // token is migrating
      if (tokenDetail.status === MemeDetailResponseStatus.ended) {
        toast.error(t("tokenDetail.migrateToRaydiumInProgress"));
        sendHapticFeedbackCommand({
          hapticsType: "notification",
          style: "error",
        });

        return;
      }

      // get swap human mode
      const swapHumanMode: CreateMemeSwapRequestResponse =
        !isUserVerified &&
        (await makeApiRequest(`/api/meme/request/swap-human-mode?tokenAddress=${tokenAddress}`));

      if (!isUserVerified && !swapHumanMode) {
        toast.error(t("buy.cannotBuyTokenAtThisTime"));
        return;
      }

      // Get native token balance
      const userBalance = await readContract(wagmiConfig, {
        abi: erc20Abi,
        address: NATIVE_TOKEN_ADDRESS as `0x${string}`,
        functionName: "balanceOf",
        args: [`${address}` as `0x${string}`],
      });
      console.log("userBalance", userBalance);
      // if (Number(Number(formatUserBalance).toFixed(18)) < amount) {
      //   toast.error(t("buy.insufficientBalance"));
      //   return;
      // }

      if (!isUserVerified && tokenDetail.guarded) {
        const quoteAmountInData = await readContract(wagmiConfig, {
          abi: MemeAbi,
          address: TOKEN_MEME_ADDRESS as `0x${string}`,
          functionName: "quoteAmountIn",
          args: [tokenAddress, BigInt(swapHumanMode.remainingTokenAmountAllocation || 0), true],
        });

        console.log("quoteAmountInData", quoteAmountInData);
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error(t("buy.cannotBuyTokenAtThisTime"));
    } finally {
      setIsLoading(false);
    }
  };

  return { quickBuyToken, isLoading };
};

export default useQuickBuyToken;
