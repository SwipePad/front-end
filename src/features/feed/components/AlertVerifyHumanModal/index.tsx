import { BottomDraw } from "@/components/shared/bottom-draw";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import HumanIcon from "@/assets/icons/human.svg?react";
import WhiteSquareIcon from "@/assets/icons/white-square.svg?react";
import UserScanIcon from "@/assets/icons/user-scan.svg?react";
import { toast } from "sonner";
import { MiniAppVerifyActionErrorPayload, MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { VERIFY_HUMAN_ACTION, ZERO_ADDRESS } from "@/constants/common";
import { getAddress } from "viem";
import { makeApiPostRequest } from "@/services/trading-chart/helpers";
import { useTranslation } from "react-i18next";
import { sendHapticAction } from "@/utils/miniapp";
import { MemeResponse } from "@/services/models";
import { toCurrency } from "@/lib/number";

type AlertVerifyHumanBottomDrawProps = {
  open: boolean;
  memeDetail?: MemeResponse;
  setOpen: (open: boolean) => void;
  refetch?: () => void;
};
const DEFAULT_NON_HUMAN_TOKEN = 10000000;

const AlertVerifyHumanBottomDraw = ({
  open,
  setOpen,
  memeDetail,
}: AlertVerifyHumanBottomDrawProps) => {
  const { t } = useTranslation();
  const address = localStorage.getItem("address");

  const handleVerifyHuman = async () => {
    try {
      if (!address) {
        sendHapticAction("notification", "error");
        toast.error(t("profile.somethingWentWrong"));
        return;
      }

      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: VERIFY_HUMAN_ACTION,
        verification_level: VerificationLevel.Orb,
        signal: getAddress(address || ZERO_ADDRESS),
      });

      if (finalPayload?.status === "error") {
        const message =
          ((finalPayload as MiniAppVerifyActionErrorPayload)?.error_code as string) ==
          "user_rejected"
            ? t("toaster.userRejectedTheTransaction")
            : t("profile.somethingWentWrong");

        sendHapticAction("notification", "error");
        toast.error(message);
        setOpen(false);
        return;
      }

      const { status, ...verifyBody } = finalPayload;

      const res = await makeApiPostRequest("/api/user/verify-human", {
        action: VERIFY_HUMAN_ACTION,
        signal: getAddress(address || ZERO_ADDRESS),
        payload: verifyBody,
      });
      if (!!res) {
        sendHapticAction("notification", "success");
        toast.success(t("feed.verifyHumanSuccessfully"));
      } else {
        sendHapticAction("notification", "error");
        toast.error(t("feed.verifyHumanFailed"));
      }

      setOpen(false);
    } catch (error) {
      sendHapticAction("notification", "error");
      toast.error(t("feed.verifyHumanFailed"));
    }
  };

  return (
    <BottomDraw isOpen={open} onClose={() => setOpen(false)} title={t("feed.purchaseLimitReached")}>
      <div className="flex flex-col gap-5 px-2.5">
        <h4 className="text-center text-[13px] font-medium text-[#777E90]">
          {t("feed.nonHumanDescription")}
        </h4>

        <div className="flex gap-3">
          <div
            className="relative flex h-[124px] flex-1 flex-col justify-between gap-3 rounded-[20px] border-[3px] border-[#2F89FF] p-4"
            style={{ background: "linear-gradient(180deg, #007CEF 0%, #002078 100%)" }}
          >
            <WhiteSquareIcon className="absolute left-0 top-0 z-10" />

            <div className="flex items-center gap-1 opacity-70">
              <HumanIcon className="h-4 w-4 text-white" />
              <p className="text-sm font-medium text-[#fff]">{t("feed.human")}</p>
            </div>

            <div className="text-sm font-medium text-[#fff]">{t("feed.fireUnlimited")}</div>
          </div>

          <div className="flex h-[124px] flex-1 flex-col justify-between gap-3 rounded-[20px] border-[3px] border-[#E6E8EC] bg-[#F4F5F6] p-4">
            <div className="flex items-center text-[#A3A8B5]">{t("feed.nonHuman")}</div>

            <div className="text-sm font-medium">
              {toCurrency(Number(memeDetail?.currentPriceByUsd) * DEFAULT_NON_HUMAN_TOKEN, {
                decimals: 4,
              })}
              $
            </div>
          </div>
        </div>

        <Button onClick={handleVerifyHuman}>
          <UserScanIcon className="h-4 w-4" />
          {t("profile.verifyHuman")}
        </Button>
      </div>
    </BottomDraw>
  );
};

export default AlertVerifyHumanBottomDraw;
