import SlideLeftIcon from "@/assets/icons/slide-left.svg?react";
import SlideRightIcon from "@/assets/icons/slide-right.svg?react";
import { useUser } from "@/components/providers/user-provider";
import { Image } from "@/components/ui/image";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const SwipeOnboard = () => {
  const { t } = useTranslation();
  const { setNotFirstUser } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[44px] z-[9999999999999] max-h-[calc(100%-60px)] min-h-[calc(100%-60px)] w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.85) 100%)",
        backdropFilter: "blur(18px)",
        height: "100%",
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
      <div className="z-10 h-full w-full">
        <div className="grid h-full grid-flow-col grid-rows-3">
          <div className="h-full w-full">
            <p className="flex h-full items-end justify-center text-xl font-semibold leading-normal text-white">
              {t("feed.letsGetStarted")}
            </p>
          </div>

          <div className="row-span-2 h-full w-full">
            <div className="flex h-full flex-col justify-end">
              <div className="flex items-end justify-evenly">
                <div className="flex flex-col items-center justify-center px-3 py-[80px] text-white">
                  <SlideLeftIcon className="mb-[27px]" />
                  <p className="text-center text-[16px] font-semibold leading-[20px] tracking-[-0.48px] text-white">
                    {t("feed.notYourTaste")}
                  </p>
                  <p className="text-center text-[16px] font-semibold leading-[20px] tracking-[-0.48px] text-white">
                    {t("feed.swipeLeft")}
                  </p>
                  <p className="pt-1 text-center text-[13px] font-medium leading-[18px] tracking-[-0.39px] text-white opacity-35">
                    {t("feed.passItBySwipingRight")}
                  </p>
                </div>
                <Image
                  src="/images/feed/dash-line.png"
                  className="absolute -bottom-[90px] scale-[0.6] self-end"
                  alt="white-light-shape"
                />

                <div className="inline-flex w-5 items-center justify-start gap-2.5 self-stretch px-2.5">
                  <div className="flex-1 origin-top-left -rotate-90 self-stretch outline outline-1 outline-offset-[-0.50px] outline-white/0"></div>
                </div>
                <div className="flex flex-col items-center justify-center px-3 py-[80px] text-white">
                  <SlideRightIcon className="mb-[27px]" />
                  <p className="text-center text-[16px] font-semibold leading-[20px] tracking-[-0.48px] text-white">
                    {t("feed.loveIt")}
                  </p>
                  <p className="text-center text-[16px] font-semibold leading-[20px] tracking-[-0.48px] text-white">
                    {t("feed.swipeRight")}
                  </p>
                  <p className="pt-1 text-center text-[13px] font-medium leading-[18px] tracking-[-0.39px] text-white opacity-35">
                    {t("feed.buyItBySwipingLeft")}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2">
                <Button
                  className="w-full bg-white text-black"
                  onClick={() => setNotFirstUser(true)}
                >
                  {t("feed.gotIt")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeOnboard;
