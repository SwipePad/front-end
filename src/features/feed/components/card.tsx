import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { animate, motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ChartIcon, MessageIcon, TickIcon, XIcon } from "./fead-icon";
import { MemeResponse } from "@/services/models";
import {
  useMemeControllerFindDetail,
  useMemeControllerLikeMeme,
  useMemeControllerQueryPagination,
} from "@/services/queries";
import { useNavigate } from "@tanstack/react-router";
import { CommentsBottomDraw } from "@/features/feed/components/CommentsBottomDraw";
import { ChartBottomDraw } from "./chart";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/query-key";
import { Image } from "@/components/ui/image";
import DexListedBg from "@/assets/icons/bg-dexlisted.svg?react";
import TickDexListed from "@/assets/icons/tick-dexlisted.svg?react";
import { LoveItOverLay, NahOverLay } from "@/features/feed/components/swipe-overlay";
import clsx from "clsx";
import HumanIcon from "@/assets/icons/human.svg?react";
import { AnimatedProgress } from "@/features/create-token/components/step-1";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import InfoIconCircle from "@/assets/icons/info-circle.svg?react";
import { useTranslation } from "react-i18next";
import { cn, sleep } from "@/lib/utils";
import { getAddress } from "viem";
import PriceTiny from "@/features/token-detail/components/format-price";
import { Loader2 } from "lucide-react";

type CardProps = {
  meme: MemeResponse;
  onSwipe: (direction: "left" | "right") => void;
  index: number;
  isBuying: boolean;
  handleComment: (tokenAddress: string) => void;
};
const Card: React.FC<CardProps> = ({ index, meme, isBuying, onSwipe, handleComment }) => {
  const { data: selectedMeme } = useMemeControllerFindDetail(getAddress(meme.tokenAddress), {
    query: {
      enabled: index === 0,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchInterval: 2000,
    },
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openChart, setOpenChart] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const [expanded, setExpanded] = useState(false);
  const text = meme.description;
  const isLongText = text.length > 60;
  const displayedText = expanded ? text : text.slice(0, 60);
  const [open, setOpen] = useState(false);
  const { mutate: likeMeme } = useMemeControllerLikeMeme();
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(meme.isUserLike);
  const [totalLikes, setTotalLikes] = useState<number>(meme.totalLikes);
  const [totalComments, setTotalComments] = useState(meme.totalComments);
  const [isOpenHumanFirstTooltip, setIsOpenHumanFirstTooltip] = useState(false);
  const [isSwipeRight, setIsSwipeRight] = useState(false);

  const [currentSwipeDirection, setCurrentSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Trigger swipe when release beyond threshold
  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    setCurrentSwipeDirection(null);

    if (info.offset.x < -150) {
      onSwipe("left");
    } else if (info.offset.x > 150) {
      onSwipe("right");
    }
  };

  const { data: memeDetails, isFetching } = useMemeControllerQueryPagination(
    {
      page: 1,
      pageSize: 1,
      search: meme?.tokenAddress,
    },
    {
      query: {
        enabled: Boolean(meme?.tokenAddress) && index == 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: 5000,
      },
    }
  );

  useEffect(() => {
    if (!isFetching) {
      if (memeDetails?.data?.length) {
        const updatedMeme = memeDetails.data[0];
        setTotalLikes(updatedMeme.totalLikes);
      }
    }
  }, [isFetching]);

  const onClickLeft = async () => {
    setIsDragging(true);
    setCurrentSwipeDirection("left");

    animate(x, -150, {
      duration: 0.3,
      ease: "easeInOut",
    });

    await sleep(150);

    animate(x, 0, {
      duration: 0.3,
      ease: "easeInOut",
    });
    setIsDragging(false);
    setCurrentSwipeDirection(null);

    setIsSwipeRight(false);
    onSwipe("left");
  };
  const onClickRight = async () => {
    setIsDragging(true);
    setCurrentSwipeDirection("right");
    animate(x, 150, {
      duration: 0.5,
      ease: "easeInOut",
    });

    await sleep(150);
    animate(x, 0, {
      duration: 0.5,
      ease: "easeInOut",
    });
    setIsDragging(false);
    setCurrentSwipeDirection(null);

    setIsSwipeRight(true);
    onSwipe("right");
  };

  const handleLike = () => {
    likeMeme(
      {
        data: {
          tokenAddress: meme?.tokenAddress || "",
        },
      },
      {
        onSuccess: () => {
          (meme.isUserLike as any) = !meme.isUserLike;
          queryClient.refetchQueries({
            queryKey: [QUERY_KEY.MEME, { tokenId: meme?.tokenAddress }],
          });
          setIsLiked(prev => !prev);
          setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
        },
        onError: () => {
          // toast.error("Failed to like");
        },
      }
    );
  };
  const [isShowOpacity, setIsShowOpacity] = useState(false);
  const [overlayOpacityValue, setOverlayOpacityValue] = useState(0);

  const handleOnDrag = (info: PanInfo) => {
    if (info.offset.x < 0) {
      setIsShowOpacity(true);
      setCurrentSwipeDirection("left");
      setOverlayOpacityValue(Math.abs(info.offset.x * 1.6));

      if (info.offset.x < -50) {
        setIsShowOpacity(false);
      }
    } else if (info.offset.x > 0) {
      setIsShowOpacity(true);
      setOverlayOpacityValue(Math.abs(info.offset.x * 1.6));
      setCurrentSwipeDirection("right");
      if (info.offset.x > 50) {
        setIsShowOpacity(false);
      }
    } else {
      setIsShowOpacity(false);
      setCurrentSwipeDirection(null);
    }
  };

  const isShowOverlay = isDragging && currentSwipeDirection !== null && index === 0;
  const isShowOverlayLeft = isShowOverlay && currentSwipeDirection === "left";
  const isShowOverlayRight = isShowOverlay && currentSwipeDirection === "right";

  const generateOverlay = () => {
    if (isShowOverlay) {
      return currentSwipeDirection === "left" ? (
        <NahOverLay style={{ opacity: isShowOpacity ? Math.ceil(overlayOpacityValue) / 100 : 1 }} />
      ) : (
        <LoveItOverLay
          style={{ opacity: isShowOpacity ? Math.ceil(overlayOpacityValue) / 100 : 1 }}
        />
      );
    }
  };

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
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onDrag={(_, info) => handleOnDrag(info)}
        // initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{
          x: x.get() > 0 || isSwipeRight ? 300 : -300,
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {generateOverlay()}

        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image src={meme.banner} alt="main image" />
        </div>

        {meme.status === "completed" && (
          <div className="absolute left-6 top-20 z-10">
            <DexListedBg />
            <div className="absolute left-0 top-[-2px] z-20 flex h-full w-full items-center justify-center">
              <TickDexListed />
              <p
                style={{
                  background: "linear-gradient(90deg, #FF5E0D 0%, #F50083 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                className="text-[13px] font-semibold not-italic leading-[18px] tracking-[-0.26px]"
              >
                {t("feed.dexListed")}
              </p>
            </div>
          </div>
        )}

        {meme.status !== "completed" && meme.guarded && (
          <TooltipProvider>
            <Tooltip open={isOpenHumanFirstTooltip} onOpenChange={setIsOpenHumanFirstTooltip}>
              <TooltipTrigger asChild>
                <div
                  className="absolute left-4 top-[70px] z-30 flex items-center gap-1 rounded-full bg-white px-2 py-[2px] text-[#0064EF]"
                  onClick={() => setIsOpenHumanFirstTooltip(prev => !prev)}
                >
                  <HumanIcon className="h-5 w-5" />
                  <p className="text-xs font-semibold">{t("feed.humanFirst")}</p>
                  <InfoIconCircle className="h-[14px] w-[14px]" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="z-99999 relative rounded-xl bg-white p-0" side="bottom">
                <p className="z-999 relative rounded-xl border px-3 py-2 text-xs font-medium text-[#141416]">
                  {t("feed.toUnlockHigherPurchaseCap")} <br />
                  {t("feed.forHumanFirstTokens")} <br />
                  {t("feed.verifyWithOrb")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div
          className={`z-1 absolute left-0 top-0 flex h-full w-full flex-col-reverse ${meme.kingOfTheHillTime > Date.now() / 1000 ? "border-gradient-king-of-hills" : ""}`}
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.00) 15.38%, rgba(0, 0, 0, 0.00) 41.35%, rgba(0, 0, 0, 0.30) 65.87%, rgba(0, 0, 0, 0.64) 100%)`,
          }}
        >
          <div className="relative z-[9999] flex w-full items-center justify-center gap-4 p-4">
            <Button
              variant="tertiary"
              className={clsx("h-[60px] w-[60px]", isShowOverlayLeft ? "bg-[#FF3E56]" : "bg-white")}
              onClick={onClickLeft}
            >
              <XIcon fill={isShowOverlayLeft ? "white" : null} />
            </Button>

            <Button
              variant="tertiary"
              className="h-[44px] w-[44px] min-w-0 gap-0 bg-white/30 p-0"
              onClick={() => setOpenChart(true)}
            >
              <ChartIcon />
            </Button>
            <Button
              variant="tertiary"
              className={clsx(
                "h-[60px] w-[60px]",
                isShowOverlayRight ? "bg-[#19BF58]" : "bg-white"
              )}
              onClick={onClickRight}
              disabled={isBuying}
            >
              {isBuying ? (
                <Loader2 className="size-10 animate-spin" />
              ) : (
                <TickIcon
                  fill={isShowOverlayRight ? "white" : null}
                  fill1={isShowOverlayRight ? "white" : null}
                />
              )}
            </Button>
          </div>

          <div className="relative flex w-full">
            <div
              className="bg-yellow flex basis-5/6 flex-col gap-2 p-4 text-white"
              onClick={() => navigate({ to: `/tokens/${meme.tokenAddress}` })}
            >
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
                  <PriceTiny
                    price={Number(selectedMeme?.currentPriceByUsd || meme?.currentPriceByUsd)}
                    className="mr-2 !text-2xl font-semibold !text-white [&_.zero-count]:top-[6px] [&_.zero-count]:text-[12px]"
                  />

                  <div
                    className={cn(
                      "w-max rounded-full border-2 border-dashed px-2 text-center text-xs font-semibold text-white",
                      Number(selectedMeme?.price24hChange || meme?.price24hChange) >= 0
                        ? "border-[#086F2F] bg-[#19BF58]"
                        : "border-[#994949] bg-[#FF0000]"
                    )}
                  >
                    {Number(selectedMeme?.price24hChange || meme?.price24hChange) > 0
                      ? Number(selectedMeme?.price24hChange || meme?.price24hChange) !== 0
                        ? "+"
                        : "-"
                      : ""}{" "}
                    {`${Number(selectedMeme?.price24hChange || meme?.price24hChange) === 0 ? 0 : Number(selectedMeme?.price24hChange || meme?.price24hChange).toFixed(2)} %`}
                  </div>
                </div>
              </div>

              <div className="">
                <div className="max-w-[300px] break-words">
                  {displayedText}
                  {isLongText && !expanded && "..."}

                  {meme?.description.length > 60 && (
                    <span
                      onClick={e => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                      }}
                      className="ml-2 font-semibold"
                    >
                      {!expanded ? t("tokenDetail.showMore") : t("tokenDetail.showLess")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-2 w-full">
                  <div className="w-full">
                    <AnimatedProgress
                      target={Number(selectedMeme?.listProgress || meme.listProgress)}
                      duration={500}
                      className="!relative !top-0 !w-full"
                    />
                  </div>
                </div>
                <div className="parallelogram w-[70px] bg-[#19BF58]">
                  <div className="p-1 text-center text-[12px] text-white">
                    {Number(selectedMeme?.listProgress || meme.listProgress) < 1
                      ? Number(selectedMeme?.listProgress || meme.listProgress)
                      : Math.floor(Number(selectedMeme?.listProgress || meme.listProgress))}{" "}
                    %
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 right-1 -mr-6 flex h-[250px] basis-1/6 flex-col items-center text-white">
              <div
                className="absolute flex flex-col items-center justify-center p-3"
                onClick={() => setOpen(true)}
              >
                <MessageIcon />
                <div className="mt-1">{totalComments}</div>
              </div>

              <div className="relative top-[20%] flex flex-col items-center justify-center p-3">
                <div
                  className="absolute top-10 z-50 h-[60px] w-[40px]"
                  onClick={() => handleLike()}
                ></div>
                <div className={`heart ${isLiked ? "heart-is-active" : "0"}`}></div>
                <div className="-mt-9">{totalLikes}</div>
              </div>

              <CommentsBottomDraw
                index={index}
                open={open}
                setOpen={setOpen}
                tokenAddress={meme.tokenAddress}
                handleComment={handleComment}
                setTotalComments={setTotalComments}
              />
              <ChartBottomDraw
                tokenAddress={meme.tokenAddress}
                tokenSymbol={meme.name}
                open={openChart}
                setOpen={setOpenChart}
                currentPrice={selectedMeme?.currentPriceByUsd || meme?.currentPriceByUsd}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
