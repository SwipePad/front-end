import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useUser } from "@/components/providers/user-provider";
import OnboardingCard from "@/features/tutorial-onboarding/onboarding-card";
import { useEffect, useState } from "react";
import SwipeIcon from "@/assets/icons/swipe-icon.svg?react";
import { sleep } from "@/lib/utils";
import SwipeOnboard from "@/features/feed/components/swipe-onboard";
import i18next from "i18next";

const seedMemeList: any = [
  {
    tokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
    caption: "The happiest frog leaping through the crypto pond. Show More",
    isUserLike: true,
    image: "/images/onboard/token1-image.png",
    banner: "/images/onboard/token1-banner.png",
    name: "Frogo",
    currentPriceByUsd: "0.3542",
    price24hChange: "12.8",
    listProgress: "100",
  },
  {
    tokenAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    caption: "The happiest frog leaping through the crypto pond. Show More",
    isUserLike: true,
    image: "/images/onboard/token1-image.png",
    banner: "/images/onboard/token1-banner.png",
    name: "Frogo",
    currentPriceByUsd: "0.3542",
    price24hChange: "12.8",
    listProgress: "100",
  },
];

const LoveOverlayTutorial = ({ currentStep }: { currentStep: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.85) 100%)",
        backdropFilter: "blur(18px)",
        height: "calc(100vh - 130px)",
        width: "100%",
        position: "absolute",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "26px",
      }}
    >
      <SwipeIcon className="h-10 w-10" />

      <div className="text-center text-xl font-semibold text-[#FFF]">
        <p>
          {currentStep === LIST_STEP.OVERLAY_LOVE
            ? i18next.t("feed.loveIt")
            : i18next.t("feed.notThisOne")}
        </p>
        <p>
          {currentStep === LIST_STEP.OVERLAY_LOVE
            ? i18next.t("feed.swipeRight")
            : i18next.t("feed.swipeLeft")}
        </p>
      </div>
    </motion.div>
  );
};
export const LIST_STEP = {
  NORMAL_CARD: 1,
  OVERLAY_LOVE: 2,
  SWIPE_LOVE: 3,
  OVERLAY_NAH: 4,
  SWIPE_NAH: 5,
  LAST_STEP: 6,
};

const OnboardingCardStack = () => {
  const { isHiddenHighLightBanner } = useUser();
  const [currentStep, setCurrentStep] = useState(LIST_STEP.NORMAL_CARD);

  useEffect(() => {
    const handleTutorial = async () => {
      await sleep(1000);

      setCurrentStep(LIST_STEP.OVERLAY_LOVE);
      await sleep(1000);

      setCurrentStep(LIST_STEP.SWIPE_LOVE);
      await sleep(2000);

      setCurrentStep(LIST_STEP.OVERLAY_NAH);
      await sleep(1000);

      setCurrentStep(LIST_STEP.SWIPE_NAH);
      await sleep(2000);

      setCurrentStep(LIST_STEP.LAST_STEP);
    };

    handleTutorial();
  }, []);

  return (
    <div
      className={clsx(
        "relative mx-auto w-full",
        isHiddenHighLightBanner ? "h-[calc(100vh-78px)]" : "h-[calc(100vh-120px)]"
      )}
    >
      <AnimatePresence>
        {[LIST_STEP.OVERLAY_LOVE, LIST_STEP.OVERLAY_NAH].includes(currentStep) && (
          <LoveOverlayTutorial currentStep={currentStep} />
        )}

        {currentStep === LIST_STEP.LAST_STEP && <SwipeOnboard />}
        {seedMemeList.map((meme: any, index: number) => (
          <motion.div
            key={`card-${meme.tokenAddress}`}
            className="absolute left-0 top-0 h-full w-full"
            style={{
              zIndex: seedMemeList.length - index,
            }}
          >
            {index === 0 ? (
              <OnboardingCard index={index} meme={meme} currentStep={currentStep} />
            ) : (
              <OnboardingCard index={index} meme={meme} currentStep={currentStep} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingCardStack;
