// import "@/styles/shiny-image-reveal.css";

import { useEffect, useState } from "react";
import { CardStack } from "./components/card-stack";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { SetFeedAmountComponent } from "./components/set-feed-amount";
import { useUser } from "@/components/providers/user-provider";
import { ArrowBottomIcon } from "@/components/shared/icons";
import { CreateTokenRewardBanner } from "@/components/shared/create-token-reward-banner";
import clsx from "clsx";
import { useLocalStorage } from "@/hooks/utils/use-local-storage";
import { useTranslation } from "react-i18next";
import { useMemeControllerGetQuotePrice } from "@/services/queries";
import useNotification from "@/hooks/mini-app/use-notification";
import TutorialOnboarding from "@/features/tutorial-onboarding";

export const Feed = () => {
  const { t } = useTranslation();
  const { isHiddenHighLightBanner } = useUser();

  const notFirstUser = localStorage.getItem("notFirstUser") === "true";

  const [openSetFeedAmount, setOpenSetFeedAmount] = useState(false);
  const [tab, setTab] = useState<"forYou" | "watchList">("forYou");
  const { data: wldPrice } = useMemeControllerGetQuotePrice();

  const [quickBuyAmount, setQuickBuyAmount] = useLocalStorage<number>("quickBuyAmount", 3);

  const [isSetDefaultQuickBuyAmount, setIsSetDefaultQuickBuyAmount] = useLocalStorage<
    string | boolean
  >("isSetDefaultQuickBuyAmount", "false");

  useEffect(() => {
    if (isSetDefaultQuickBuyAmount === "false" || isSetDefaultQuickBuyAmount === false) {
      setIsSetDefaultQuickBuyAmount(true);
      setQuickBuyAmount(3);
    }
  }, [isSetDefaultQuickBuyAmount]);

  const { handleNotificationPermission } = useNotification();

  useEffect(() => {
    handleNotificationPermission();
  }, []);

  if (!notFirstUser) {
    return <TutorialOnboarding />;
  }

  return (
    <div className="h-[calc(100vh-98px)]">
      {!Boolean(isHiddenHighLightBanner) && <CreateTokenRewardBanner />}

      <div
        className={clsx(
          "absolute left-0 z-[99] w-full p-2.5 text-white",
          !isHiddenHighLightBanner ? "top-[34px]" : "top-0"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <div
              onClick={() => setTab("forYou")}
              className={`p-2 text-center not-italic text-white ${tab === "forYou" ? "text-[20px] font-semibold leading-[28px]" : "text-[16px] font-normal leading-[24px] opacity-50"}`}
            >
              {t("feed.forYou")}
            </div>
            <div
              onClick={() => setTab("watchList")}
              className={`p-2 text-center not-italic text-white ${tab !== "forYou" ? "text-[20px] font-semibold leading-[28px]" : "text-[16px] font-normal leading-[24px] opacity-50"}`}
            >
              {t("feed.watchList")}
            </div>
          </div>

          <div>
            <Button
              variant="tertiary"
              size="sm"
              className="h-[26px] px-2 py-1"
              onClick={() => setOpenSetFeedAmount(true)}
            >
              <span className="font-[13px] leading-[18px] text-[#808080]">{t("feed.amount")}</span>
              <span className="flex items-center gap-1">
                <span className="whitespace-nowrap font-[500]">{quickBuyAmount} $</span>
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

      <CardStack feedAmount={quickBuyAmount} tab={tab} wldPrice={wldPrice as any} />
      <SetFeedAmountComponent
        open={openSetFeedAmount}
        onClose={() => setOpenSetFeedAmount(false)}
        setValueState={value => setQuickBuyAmount(value)}
        value={quickBuyAmount}
      />
    </div>
  );
};
