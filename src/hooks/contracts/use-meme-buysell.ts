import { useUser } from "@/components/providers/user-provider";
import { MemeAbi } from "@/smart-contracts/abi";
import { MiniAppSendTransactionSuccessPayload, MiniKit } from "@worldcoin/minikit-js";
import { useCheckTransaction } from "./use-check-transaction";
import { toast } from "@/components/shared/toast";
import { parseUnits } from "viem";
import { swap } from "@/utils/holdstation-swap";
import { CreateMemeSwapRequestResponse } from "@/services/models";
import { useTranslation } from "react-i18next";
import { handleUserRejectTransaction } from "@/utils/handle-user-reject-transaction";
import { sendHapticAction } from "@/utils/miniapp";

export function useMemeBuySell() {
  const memeAddress = import.meta.env.VITE_TOKEN_MEME_ADDRESS;
  const nativeTokenAddress =
    import.meta.env.VITE_NATIVE_TOKEN_ADDRESS ?? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Default to native token address
  const { checkTransactionStatus } = useCheckTransaction();
  const { user } = useUser();
  const { t } = useTranslation();

  const buy = async ({
    tokenAddress,
    amountIn,
    minimumOut,
    tokenOutDecimals,
    isOnDex,
    slippage = "0.01", // Default slippage of 1%
    isGuarded = false,
    humanVerifiedData,
    tokenSymbol,
  }: {
    tokenAddress: string;
    amountIn: string;
    minimumOut: string;
    tokenOutDecimals: number;
    isOnDex?: boolean; // Optional parameter to indicate if the swap is on a DEX
    slippage?: string; // Optional slippage parameter, default is 0.01 (1%)
    isGuarded: boolean;
    humanVerifiedData: CreateMemeSwapRequestResponse;
    tokenSymbol?: string;
  }) => {
    if (!isOnDex) {
      const decimalsNative = 18; // Assuming native token has 18 decimals
      const minimumOutData = parseUnits(minimumOut, tokenOutDecimals).toString(); // Convert minimumOut to the correct format
      const permitData = {
        permitted: {
          token: nativeTokenAddress, // The token I'm sending
          amount: parseUnits(
            (Number(amountIn) * 1.05).toFixed(decimalsNative),
            decimalsNative
          ).toString(),
        },
        nonce: Date.now().toString(),
        deadline: Math.floor((Date.now() + 60 * 30 * 1000) / 1000).toString(), // 30 minutes
      };

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: memeAddress,
            abi: MemeAbi,
            functionName: "swapExactIn",
            args: [
              true, // usePermit2
              tokenAddress, // tokenAddress
              parseUnits(amountIn.toString(), decimalsNative).toString(), // amountIn
              minimumOutData, // minimumReceive
              true, // isBuyToken
              user.address, // recipient
              isGuarded ? humanVerifiedData.id : 0, // id
              isGuarded ? humanVerifiedData.remainingTokenAmountAllocation : 0, // nativeAllocation
              isGuarded ? humanVerifiedData.expiredBlockNumber : 0, // expiredBlockNumber
              isGuarded ? humanVerifiedData.signature : "0x",
              "PERMIT2_SIGNATURE_PLACEHOLDER_0", // signature
              [
                [permitData.permitted.token, permitData.permitted.amount],
                permitData.nonce,
                permitData.deadline,
              ], // permit2Signature
            ],
          },
        ],
        permit2: [
          {
            ...permitData,
            spender: memeAddress,
          },
        ],
        formatPayload: false,
      });
      if (finalPayload.status === "error") {
        console.error(finalPayload);
        handleUserRejectTransaction(finalPayload.error_code, "buy");
      }

      await checkTransactionStatus(
        (finalPayload as MiniAppSendTransactionSuccessPayload).transaction_id
      );
      sendHapticAction("notification", "success");
      toast.success(
        tokenSymbol
          ? t("toaster.buyTokenSymbolSuccessfully", { symbol: tokenSymbol })
          : t("toaster.buyTokenSuccessfully")
      );
      return true;
    } else {
      try {
        const res = await swap(nativeTokenAddress, tokenAddress, amountIn, slippage.toString());
        if (res.success === false) {
          console.error(res);
          handleUserRejectTransaction(res.errorCode, "buy");
        }
        sendHapticAction("notification", "success");
        toast.success(
          tokenSymbol
            ? t("toaster.buyTokenSymbolSuccessfully", { symbol: tokenSymbol })
            : t("toaster.buyTokenSuccessfully")
        );
        return true;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  };

  const buyExtractOutput = async ({
    tokenAddress,
    amountOut,
    maximumPay,
    isOnDex,
    slippage = "0.01",
    isGuarded = false,
    humanVerifiedData,
    tokenSymbol,
  }: {
    tokenAddress: string;
    amountOut: string;
    maximumPay: string;
    tokenOutDecimals: number;
    isOnDex?: boolean;
    slippage?: string;
    isGuarded: boolean;
    humanVerifiedData: CreateMemeSwapRequestResponse;
    tokenSymbol?: string;
  }) => {
    const decimalsNative = 18;

    if (!isOnDex) {
      const permitData = {
        permitted: {
          token: nativeTokenAddress,
          amount: parseUnits(
            (Number(maximumPay) * 1.05).toFixed(decimalsNative),
            decimalsNative
          ).toString(),
        },
        nonce: Date.now().toString(),
        deadline: Math.floor((Date.now() + 60 * 30 * 1000) / 1000).toString(), // 30 minutes
      };

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: memeAddress,
            abi: MemeAbi,
            functionName: "swapExactOut",
            args: [
              true, // usePermit2
              tokenAddress,
              amountOut, // amountOut
              parseUnits(maximumPay, decimalsNative).toString(), // maximumPay
              true, // isBuyToken
              user.address,
              isGuarded ? humanVerifiedData.id : 0,
              isGuarded ? humanVerifiedData.remainingTokenAmountAllocation : 0,
              isGuarded ? humanVerifiedData.expiredBlockNumber : 0,
              isGuarded ? humanVerifiedData.signature : "0x",
              "PERMIT2_SIGNATURE_PLACEHOLDER_0",
              [
                [permitData.permitted.token, permitData.permitted.amount],
                permitData.nonce,
                permitData.deadline,
              ],
            ],
          },
        ],
        permit2: [
          {
            ...permitData,
            spender: memeAddress,
          },
        ],
        formatPayload: false,
      });

      if (finalPayload.status === "error") {
        console.error(finalPayload);
        handleUserRejectTransaction(finalPayload.error_code, "buy");
      }

      await checkTransactionStatus(
        (finalPayload as MiniAppSendTransactionSuccessPayload).transaction_id
      );
      sendHapticAction("notification", "success");
      toast.success(
        tokenSymbol
          ? t("toaster.buyTokenSymbolSuccessfully", { symbol: tokenSymbol })
          : t("toaster.buyTokenSuccessfully")
      );
      return true;
    } else {
      try {
        const res = await swap(nativeTokenAddress, tokenAddress, maximumPay, slippage.toString());
        if (res.success === false) {
          console.error(res);
          handleUserRejectTransaction(res.errorCode, "buy");
        }

        sendHapticAction("notification", "success");
        toast.success(
          tokenSymbol
            ? t("toaster.buyTokenSymbolSuccessfully", { symbol: tokenSymbol })
            : t("toaster.buyTokenSuccessfully")
        );
        return true;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  };

  const sell = async ({
    tokenAddress,
    decimalsTokenIn,
    amountIn,
    minimumOut,
    isOnDex = false, // Default to false if not provided
    slippage = "0.01", // Default slippage of 1%
    tokenSymbol,
  }: {
    tokenAddress: string;
    decimalsTokenIn: number;
    amountIn: string;
    minimumOut: string;
    isOnDex?: boolean; // Optional parameter to indicate if the swap is on a DEX
    slippage?: string; // Optional slippage parameter, default is 0.01 (1%),
    tokenSymbol?: string;
  }) => {
    if (!isOnDex) {
      const decimalsNative = 18; // Assuming native token has 18 decimals
      const minimumOutData = parseUnits(minimumOut, decimalsNative).toString();
      const permitData = {
        permitted: {
          token: tokenAddress, // The token I'm sending
          amount: parseUnits(amountIn, decimalsTokenIn).toString(),
        },
        nonce: Date.now().toString(),
        deadline: Math.floor((Date.now() + 60 * 30 * 1000) / 1000).toString(), // 30 minutes
      };

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: memeAddress,
            abi: MemeAbi,
            functionName: "swapExactIn",
            args: [
              true, // usePermit2
              tokenAddress, // tokenAddress
              permitData.permitted.amount, // amountIn
              minimumOutData, // minimumReceive
              false, // isBuyToken
              user.address, // recipient
              0, // id
              0, // nativeAllocation
              0, // expiredBlockNumber
              "0x", // signature
              "PERMIT2_SIGNATURE_PLACEHOLDER_0", // permit2Signature
              [
                [permitData.permitted.token, permitData.permitted.amount],
                permitData.nonce,
                permitData.deadline,
              ], // permit
            ],
          },
        ],
        permit2: [
          {
            ...permitData,
            spender: memeAddress,
          },
        ],
        formatPayload: true,
      });

      if (finalPayload.status === "error") {
        console.error(finalPayload);
        handleUserRejectTransaction(finalPayload.error_code, "sell");
      }

      await checkTransactionStatus(
        (finalPayload as MiniAppSendTransactionSuccessPayload).transaction_id
      );
      sendHapticAction("notification", "success");

      toast.success(
        tokenSymbol
          ? t("toaster.sellTokenSymbolSuccessfully", { symbol: tokenSymbol })
          : t("toaster.sellTokenSuccessfully")
      );
      return true;
    } else {
      try {
        const res = await swap(tokenAddress, nativeTokenAddress, amountIn, slippage.toString());
        if (res.success === false) {
          console.error(res);

          handleUserRejectTransaction(res.errorCode, "sell");
        }
        sendHapticAction("notification", "success");

        toast.success(
          tokenSymbol
            ? t("toaster.sellTokenSymbolSuccessfully", { symbol: tokenSymbol })
            : t("toaster.sellTokenSuccessfully")
        );
        return true;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  };

  return {
    buy,
    buyExtractOutput,
    sell,
  };
}
