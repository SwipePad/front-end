import { useUser } from "@/components/providers/user-provider";
import { toast } from "@/components/shared/toast";
import { useCheckTransaction } from "@/hooks/contracts/use-check-transaction";
import { sleep } from "@/lib/utils";
import { ResponseClaimParamDtoClaimState } from "@/services/models";
import { useUserControllerGetClaimFreeParam } from "@/services/queries";
import { makeApiRequest } from "@/services/trading-chart/helpers";
import { MemeHubAbi } from "@/smart-contracts/abi";
import { sendHapticAction } from "@/utils/miniapp";
import { MiniAppSendTransactionSuccessPayload, MiniKit } from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getAddress } from "viem";

const hubAddress = import.meta.env.VITE_TOKEN_HUB_ADDRESS;

// Local storage key for pending claims
const PENDING_CLAIM_KEY = "pending_claim_transaction";

const useClaimCreateTokenReward = () => {
  const [loading, setLoading] = useState(false);
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);

  const { t } = useTranslation();

  const { address, user, setUserData } = useUser();
  const { checkTransactionStatus } = useCheckTransaction();

  const { data: createTokenClaim } = useUserControllerGetClaimFreeParam({
    query: {
      refetchInterval: 3000,
    },
  });

  // Check for pending claims on mount
  useEffect(() => {
    const pendingTx = localStorage.getItem(PENDING_CLAIM_KEY);
    if (pendingTx) {
      setPendingTransactionId(pendingTx);
      setLoading(true);

      // Resume monitoring the pending transaction
      monitorPendingTransaction(pendingTx);
    }
  }, []);

  const monitorPendingTransaction = async (txId: string) => {
    try {
      await checkTransactionStatus(txId);
      await sleep(10000);

      await updateUserDataAfterClaim();

      // Transaction completed successfully
      localStorage.removeItem(PENDING_CLAIM_KEY);
      setPendingTransactionId(null);
      setLoading(false);

      // Update user data

      sendHapticAction("notification", "success");
    } catch (error) {
      // Transaction failed or timed out
      localStorage.removeItem(PENDING_CLAIM_KEY);
      setPendingTransactionId(null);
      setLoading(false);

      if (error instanceof Error && error.message.includes("timeout")) {
        toast.error(t("toaster.transactionTimeout"));
      } else {
        toast.error(t("shared.claimCreateTokenRewardBanner.claimFailed"));
      }
    }
  };

  const updateUserDataAfterClaim = async () => {
    try {
      const userDetail = await makeApiRequest(`/api/user/${getAddress(address as string)}`);

      if (userDetail && userDetail?.[0] && userDetail?.[0]?.claimState && userDetail?.[0]?.name) {
        setUserData(
          null,
          userDetail?.[0]?.name,
          address,
          userDetail?.[0]?.image,
          userDetail?.[0]?.claimState
        );
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  const handleClaimCreateTokenReward = async () => {
    // Check if there's already a pending claim
    if (pendingTransactionId || loading) {
      toast.error(t("shared.claimCreateTokenRewardBanner.claimAlreadyInProgress"));
      return;
    }

    if (
      user?.claimState !== ResponseClaimParamDtoClaimState.active ||
      !address ||
      !createTokenClaim
    ) {
      await updateUserDataAfterClaim();
      toast.error(t("shared.claimCreateTokenRewardBanner.ineligible"));
      return;
    }

    try {
      setLoading(true);
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: hubAddress,
            abi: MemeHubAbi,
            functionName: "claim",
            args: [
              createTokenClaim.adminAddress, // adminAddress
              createTokenClaim.tokenAddress, // token
              createTokenClaim.id, // id
              createTokenClaim.chainId, // chainId
              createTokenClaim.amount.toString(), // claimAmount
              createTokenClaim.payload, // payload
              createTokenClaim.expiredBlockNumber, // expiredBlockNumber
              createTokenClaim.recipient, // recipient
              createTokenClaim.signature, // signature
            ],
          },
        ],
        formatPayload: false,
      });

      if (finalPayload.status === "error") {
        if (finalPayload.error_code === "user_rejected") {
          toast.error(t("toaster.userRejectedTheTransaction"));
        } else {
          toast.error(t("shared.claimCreateTokenRewardBanner.claimFailed"));
        }
        setLoading(false);
        return;
      }

      const txId = (finalPayload as MiniAppSendTransactionSuccessPayload).transaction_id;

      // Store the transaction ID in localStorage to persist across navigation
      localStorage.setItem(PENDING_CLAIM_KEY, txId);
      setPendingTransactionId(txId);

      // Start monitoring the transaction
      monitorPendingTransaction(txId);
    } catch (error) {
      await updateUserDataAfterClaim();
      setLoading(false);
      toast.error(t("shared.claimCreateTokenRewardBanner.claimFailed"));
      console.log("error: ", error);
    }
  };

  // Check if user can claim (not already claimed and no pending transaction)
  const canClaim =
    user?.claimState === ResponseClaimParamDtoClaimState.active &&
    !pendingTransactionId &&
    !loading;

  return {
    loading: loading || !!pendingTransactionId,
    handleClaimCreateTokenReward,
    canClaim,
    pendingTransactionId,
  };
};

export default useClaimCreateTokenReward;
