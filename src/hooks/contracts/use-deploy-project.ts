import { MemeFactoryAbi } from "@/smart-contracts/abi";
import { MiniKit } from "@worldcoin/minikit-js";
import { useCheckTransaction } from "./use-check-transaction";
import { parseEther } from "viem";
import { useTranslation } from "react-i18next";

type BigNumberish = string | number | bigint;

export type MemeParams = {
  /** Tên token (ví dụ: “My Token”) */
  name: string;
  /** Ký hiệu token (ví dụ: “MTK”) */
  symbol: string;
  /** Số tiền nạp ban đầu (uint256, wei) */
  initialDeposit: number;
  /** Thời gian bắt đầu whitelist (timestamp, giây) */
  whitelistStartTs: BigNumberish;
  /** Thời gian kết thúc whitelist (timestamp, giây) */
  whitelistEndTs: BigNumberish;
  /** Địa chỉ creator (address) */
  creator: string; // address
  isGuarded: boolean; // true nếu cần Human Verified
  isFeeFree: boolean; // true nếu không tính phí
  submissionId: string;
};

export function useDeployProject() {
  const { checkTransactionStatus } = useCheckTransaction();
  const factoryAddress = import.meta.env.VITE_TOKEN_FACTORY_ADDRESS;
  const nativeTokenAddress =
    import.meta.env.VITE_NATIVE_TOKEN_ADDRESS ?? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Default to native token address
  if (!factoryAddress) {
    throw new Error("Factory address is not defined!");
  }
  const { t } = useTranslation();

  const deployProject = async (params: MemeParams) => {
    const creatorFee = params.isFeeFree ? 0 : 5;
    const totalAmountPermit2 = params.initialDeposit + creatorFee;

    const permitData = {
      permitted: {
        token: nativeTokenAddress,
        amount: parseEther(totalAmountPermit2.toString()).toString(),
      },
      nonce: Date.now().toString(),
      deadline: Math.floor((Date.now() + 30 * 30 * 1000) / 1000).toString(),
    };

    const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: factoryAddress,
          abi: MemeFactoryAbi,
          functionName: "submitMeme",
          args: [
            [
              true, // usePermit2
              params.isGuarded, // guarded
              params.isFeeFree, // feeFree
              params.name, // name
              params.symbol, // symbol
              params.submissionId, //submissionId
              parseEther(params.initialDeposit.toString()).toString(), // initialDeposit
              params.whitelistStartTs.toString(), // whitelistStartTs
              params.whitelistEndTs.toString(), // whitelistEndTs
              nativeTokenAddress, // native
              params.creator, // creator
              totalAmountPermit2 > 0 ? "PERMIT2_SIGNATURE_PLACEHOLDER_0" : "0x", // permit2Signature
              [
                [permitData.permitted.token, permitData.permitted.amount],
                permitData.nonce,
                permitData.deadline,
              ], // permit
            ],
          ],
        },
      ],

      ...(totalAmountPermit2 > 0
        ? {
            permit2: [
              {
                ...permitData,
                spender: factoryAddress,
              },
            ],
          }
        : {}),

      formatPayload: false,
    });
    if (finalPayload.status === "error") {
      console.error(finalPayload);
      const message =
        finalPayload.error_code === "user_rejected"
          ? t("toaster.userRejectedTheTransaction")
          : t("toaster.failToDeployProject");
      throw new Error(message);
    }

    await checkTransactionStatus(finalPayload.transaction_id as string);
  };

  return {
    deployProject,
  };
}
