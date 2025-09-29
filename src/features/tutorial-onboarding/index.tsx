import { useUser } from "@/components/providers/user-provider";
import CreateTokenHighLightBanner from "@/components/shared/create-token-reward-banner";
import { ArrowBottomIcon } from "@/components/shared/icons";
import OnboardingCardStack from "@/features/tutorial-onboarding/onboarding-card-stack";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const TutorialOnboarding = () => {
  const { isHiddenHighLightBanner } = useUser();
  const { t } = useTranslation();
  const tab = "forYou";

  return (
    <div className="relative h-[calc(100vh-98px)]">
      {!Boolean(isHiddenHighLightBanner) && <CreateTokenHighLightBanner />}
      {/* HEADER */}
      <div
        className={clsx(
          "absolute left-0 z-[99] w-full p-4 text-white",
          !isHiddenHighLightBanner ? "top-[34px]" : "top-0"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <div
              className={`p-2 text-center not-italic text-white ${tab === "forYou" ? "text-[20px] font-semibold leading-[28px]" : "text-[16px] font-normal leading-[24px] opacity-50"}`}
            >
              {t("feed.forYou")}
            </div>
            <div
              className={`p-2 text-center not-italic text-white ${tab !== "forYou" ? "text-[20px] font-semibold leading-[28px]" : "text-[16px] font-normal leading-[24px] opacity-50"}`}
            >
              {t("feed.watchList")}
            </div>
          </div>
          <div>
            <Button variant="tertiary" size="sm" className="h-[26px] px-2 py-1">
              <span className="font-[13px] leading-[18px] text-[#808080]">{t("feed.amount")}</span>
              <span className="flex items-center gap-1">
                <span className="whitespace-nowrap font-[500]">1 $</span>
                {/* <span>
                  <Image src={WorldCoinIcon} alt="worldcoin-icon" />
                </span> */}
                <span>
                  <ArrowBottomIcon />
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      <OnboardingCardStack />

      <div
        className="absolute"
        style={{
          height: "98px",
          width: "100%",
          top: "100%",
          zIndex: 99999,
        }}
      ></div>
    </div>
  );
};

export default TutorialOnboarding;
