import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MemeResponse } from "@/services/models";
import { Image } from "@/components/ui/image";
import { LoveItOverLay, NahOverLay } from "@/features/feed/components/swipe-overlay";
import clsx from "clsx";
import { AnimatedProgress } from "@/features/create-token/components/step-1";
import { cn, sleep } from "@/lib/utils";
import { ChartIcon, MessageIcon, TickIcon, XIcon } from "@/features/feed/components/fead-icon";
import { LIST_STEP } from "@/features/tutorial-onboarding/onboarding-card-stack";
import { useTranslation } from "react-i18next";

type CardProps = {
  meme: MemeResponse;
  index: number;
  currentStep: number;
};
const OnboardingCard: React.FC<CardProps> = ({ index, meme, currentStep }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const text = meme.caption;
  const isLongText = text.length > 100;
  const { t } = useTranslation();

  const [currentSwipeDirection, setCurrentSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Trigger swipe when release beyond threshold
  const handleDragEnd = (_: any, __: any) => {
    setIsDragging(false);
    setCurrentSwipeDirection(null);
  };

  const liked = useMemo(() => {
    return meme.isUserLike;
  }, [meme.isUserLike]);

  const isShowOverlay = isDragging && currentSwipeDirection !== null && index === 0;
  const isShowOverlayLeft = isShowOverlay && currentSwipeDirection === "left";
  const isShowOverlayRight = isShowOverlay && currentSwipeDirection === "right";

  const generateOverlay = () => {
    if (isShowOverlay) {
      return currentSwipeDirection === "left" ? (
        <NahOverLay style={{ opacity: 100 }} />
      ) : (
        <LoveItOverLay style={{ opacity: 100 }} />
      );
    }
  };

  useEffect(() => {
    const handleSwipe = async () => {
      if ([LIST_STEP.SWIPE_LOVE, LIST_STEP.SWIPE_NAH].includes(currentStep) && index === 0) {
        const isSwipeRight = LIST_STEP.SWIPE_LOVE === currentStep;
        await sleep(500);
        setIsDragging(true);
        setCurrentSwipeDirection(isSwipeRight ? "right" : "left");

        animate(x, isSwipeRight ? 150 : -150, {
          duration: 0.5,
          ease: "easeInOut",
        });

        await sleep(500);

        animate(x, 0, {
          duration: 0.5,
          ease: "easeInOut",
        });

        setIsDragging(false);
        setCurrentSwipeDirection(null);
      }
    };

    handleSwipe();
  }, [currentStep]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ borderRadius: "24px !important" }}
    >
      <motion.div
        className={cn(
          "absolute left-0 top-0 flex h-full w-full cursor-grab select-none items-center justify-center overflow-hidden bg-black text-black shadow-xl",
          {
            "overflow-hidden rounded-[24px]": x.getVelocity() !== 0 || isDragging,
            "rounded-none": x.getVelocity() === 0,
          }
        )}
        style={{ x, rotate }}
        // drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => {
          setIsDragging(true);
        }}
        onDragEnd={handleDragEnd}
        // initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{
          x: x.get() > 0 ? 300 : -300,
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {generateOverlay()}

        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image src={meme.banner} alt="main image" />
        </div>

        <div
          className={`z-1 absolute left-0 top-0 flex h-full w-full flex-col-reverse`}
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.00) 15.38%, rgba(0, 0, 0, 0.00) 41.35%, rgba(0, 0, 0, 0.30) 65.87%, rgba(0, 0, 0, 0.64) 100%)`,
          }}
        >
          <div className="relative z-[9999] flex w-full items-center justify-center gap-4 p-4">
            <Button
              variant="tertiary"
              className={clsx("h-[60px] w-[60px]", isShowOverlayLeft ? "bg-[#FF3E56]" : "bg-white")}
            >
              <XIcon fill={isShowOverlayLeft ? "white" : null} />
            </Button>

            <Button variant="tertiary" className="h-[44px] w-[44px] min-w-0 gap-0 bg-white/30 p-0">
              <ChartIcon />
            </Button>
            <Button
              variant="tertiary"
              className={clsx(
                "h-[60px] w-[60px]",
                isShowOverlayRight ? "bg-[#19BF58]" : "bg-white"
              )}
            >
              <TickIcon
                fill={isShowOverlayRight ? "white" : null}
                fill1={isShowOverlayRight ? "white" : null}
              />
            </Button>
          </div>

          <div className="flex w-full">
            <div className="bg-yellow flex basis-5/6 flex-col gap-2 p-4 text-white">
              <div>
                <Image
                  src={
                    meme.image ??
                    "https://masterpiecer-images.s3.yandex.net/5feb1d90dff0cc1:upscaled"
                  }
                  alt="avatar token"
                  className="h-[40px] w-[40px] rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-DrukWideBold text-[18px] font-bold leading-[24px]">
                  {meme.name}
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-DrukWideBold leading-[28px]">
                    ${meme.currentPriceByUsd}
                  </span>

                  <div
                    className={cn(
                      "w-fit rounded-full border-2 border-dashed px-2 text-center text-xs font-semibold text-white",
                      Number(meme.price24hChange) >= 0
                        ? "border-[#086F2F] bg-[#19BF58]"
                        : "border-[#994949] bg-[#FF0000]"
                    )}
                  >
                    {`${Number(meme.price24hChange) === 0 ? 0 : Number(meme.price24hChange).toFixed(2)} %`}
                  </div>
                </div>
              </div>
              <div>
                <div>{meme.caption}</div>
                {meme.caption.length > 60 && (
                  <div> {isLongText ? t("tokenDetail.showMore") : t("tokenDetail.showLess")}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-full">
                  <div className="w-full">
                    <AnimatedProgress
                      target={Number(meme.listProgress)}
                      duration={500}
                      className="!relative !top-0 !w-full"
                    />
                  </div>
                </div>
                <div className="parallelogram w-[70px] bg-[#19BF58]">
                  <div className="p-1 text-center text-[12px] text-white">
                    {Number(meme.listProgress) < 1
                      ? Number(meme.listProgress)
                      : Math.floor(Number(meme.listProgress))}{" "}
                    %
                  </div>
                </div>
              </div>
            </div>
            <div className="relative top-14 -mr-6 flex basis-1/6 flex-col items-center text-white">
              <div className="absolute flex flex-col items-center justify-center p-3">
                <MessageIcon />
                <div className="mt-1">{60}</div>
              </div>

              <div className="relative top-[20%] flex flex-col items-center justify-center p-3">
                <div className="absolute top-10 z-50 h-[60px] w-[40px]"></div>
                <div className={`heart ${liked ? "heart-is-active" : "0"}`}></div>
                <div className="-mt-9">12.5K</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingCard;
