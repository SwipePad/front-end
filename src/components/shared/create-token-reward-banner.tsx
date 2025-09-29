import { SpeakerIcon, WorldCoinSmallIcon } from "@/components/shared/icons";
import { sendHapticAction } from "@/utils/miniapp";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import GiftIcon from "@/assets/icons/gift1.svg?react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useUser } from "@/components/providers/user-provider";
import { ResponseClaimParamDtoClaimState } from "@/services/models";
import useClaimCreateTokenReward from "@/hooks/contracts/use-claim-create-token-reward";
import { Loader2 } from "lucide-react";

const CreateTokenHighLightBanner = ({ extendClass }: { extendClass?: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className={`flex h-[34px] items-center justify-center gap-1 px-3 py-2.5 ${extendClass} light-sweep-animation`}
      style={{
        background: "linear-gradient(90deg, #00E24F 0%, #FFDB58 50%, #FF9616 100%)",
      }}
      onClick={() => {
        navigate({ to: "/create-token" });
        sendHapticAction();
      }}
    >
      <SpeakerIcon />

      <p className="text-border-black">
        {t("shared.createTokenHighLightBanner.createTokenAndEarnUpTo")}
      </p>

      <div className="scale-animation ml-1 flex items-center gap-1">
        <div className="relative h-5 w-5">
          <WorldCoinSmallIcon style={{ position: "absolute", top: 0, left: 0 }} />

          <span className="text-border-black absolute bottom-[-8px] left-[35%] w-max !text-[7px] uppercase">
            {t("shared.createAndEarnBanner.upto")}
          </span>
        </div>

        <p className="text-border-black ml-[3px]">100 WLD</p>
      </div>
    </div>
  );
};

const ArrowBottomIcon = () => {
  return (
    <svg
      width="7"
      height="5"
      viewBox="0 0 7 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-1/2 top-[calc(100%+2px)] -translate-y-1/2"
    >
      <path d="M0.5 0H6.5L3.5 5L0.5 0Z" fill="#F15918" />
    </svg>
  );
};

export const CreateAndEarnBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="absolute -top-[35px] left-1/2 flex w-max -translate-x-1/2 items-center gap-1 rounded-lg bg-[#F15918] p-1">
      <ArrowBottomIcon />
      <div className="text-border-white text-xs">
        {t("shared.createAndEarnBanner.createAndEarn")}
      </div>

      <WorldCoinSmallIcon style={{ transform: "scale(0.8)" }} />
    </div>
  );
};

export const ClaimCreateTokenRewardBanner = () => {
  const { t } = useTranslation();
  const { handleClaimCreateTokenReward, loading, canClaim } = useClaimCreateTokenReward();
  const { user } = useUser();

  return (
    <div
      className={`light-sweep-animation flex h-[34px] items-center justify-between gap-1 px-3 py-2.5`}
      style={{
        background: "linear-gradient(90deg, #88E200 0%, #58FF63 50%, #77FF16 100%)",
      }}
    >
      <div className="flex items-center gap-1">
        <WorldCoinSmallIcon style={{ transform: "scale(0.8)" }} />

        <p className="text-border-black">
          {t("shared.claimCreateTokenRewardBanner.claimUpTo100Wld")}
        </p>
      </div>

      <Button
        className="animation-border-claim relative !h-[26px] !w-[108px] !gap-[4px] !p-[1px] text-[13px] text-[#000]"
        onClick={() => {
          canClaim && handleClaimCreateTokenReward();
        }}
      >
        {loading ? (
          <Loader2 className="text-primary relative z-10 h-4 w-4 animate-spin" />
        ) : (
          <>
            <GiftIcon className="relative z-10 h-[18px] w-[18px]" />

            <span className="relative z-10 text-[13px] !font-semibold">
              {t(
                user?.claimState === ResponseClaimParamDtoClaimState.active
                  ? "shared.claimCreateTokenRewardBanner.claimNow"
                  : "shared.claimCreateTokenRewardBanner.claimed"
              )}
            </span>
          </>
        )}
      </Button>
    </div>
  );
};

export const CreateTokenRewardBanner = () => {
  const { user } = useUser();

  if (user?.claimState !== ResponseClaimParamDtoClaimState.ineligible) {
    return <ClaimCreateTokenRewardBanner />;
  }

  return <CreateTokenHighLightBanner />;
};

export default CreateTokenHighLightBanner;
