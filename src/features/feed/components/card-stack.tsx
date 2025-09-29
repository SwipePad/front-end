import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MemeDetailResponseStatus, MemeResponse } from "@/services/models";
import { generateTokenId } from "@/lib/utils";
import {
  useMemeControllerCreateSwapHumanMode,
  useMemeControllerFindMultipleRandom,
  useMemeControllerFindWatchListMultipleRandom,
  useUserControllerFindOne,
} from "@/services/queries";
import { useMemeBuySell } from "@/hooks/contracts/use-meme-buysell";
import { toast } from "@/components/shared/toast";
import { WatchListIsEmpty } from "./watch-list";
import { useMemeData } from "@/hooks/contracts/use-meme-data";
import Card from "@/features/feed/components/card";
import clsx from "clsx";
import { useUser } from "@/components/providers/user-provider";
import { formatEther, getAddress } from "viem";
import { ZERO_ADDRESS } from "@/constants/common";
import useGetBuyNonHuman from "@/hooks/contracts/use-get-buy-nonhuman";
import AlertVerifyHumanBottomDraw from "@/features/feed/components/AlertVerifyHumanModal";
import { useTranslation } from "react-i18next";
import { sendHapticFeedbackCommand } from "@/utils/send-haptic-feedback-command";
import { useTokenBalance } from "@/hooks/contracts/use-token-balance";
import { useAccount } from "@/hooks/mini-app/useAccount";
import useGetPrice from "@/hooks/contracts/use-get-price";
import { sendHapticAction } from "@/utils/miniapp";

type Props = {
  // setFeedAmount: () => void;
  feedAmount: number;
  tab: "forYou" | "watchList";
  wldPrice: number | string | null | undefined;
};

export const CardStack = (props: Props) => {
  const { t } = useTranslation();
  const [memes, setMemes] = useState<(MemeResponse & { key: string })[]>([]);
  const [watchListMemes, setWatchListMemes] = useState<(MemeResponse & { key: string })[]>([]);
  const address = localStorage.getItem("address");
  const [isOpenAlertVerifyHuman, setIsOpenAlertVerifyHuman] = useState(false);

  const { nativeToken } = useAccount();
  const { data: tokenBalance } = useTokenBalance(nativeToken);
  const [isBuying, setIsBuying] = useState(false);

  const { isHiddenHighLightBanner } = useUser();

  const currentMeme = useMemo(() => {
    return memes?.[0];
  }, [memes]);
  const { data: humanVerifiedData, refetch: refetchHumanVerifiedData } =
    useMemeControllerCreateSwapHumanMode(
      {
        tokenAddress: getAddress(currentMeme?.tokenAddress ?? ZERO_ADDRESS),
      },
      {
        query: {
          enabled: !!currentMeme && !!currentMeme.tokenAddress,
        },
      }
    );

  useEffect(() => {
    refetchHumanVerifiedData();
  }, [currentMeme]);

  const { buy } = useMemeBuySell();
  const { state: memeOnChainData } = useMemeData(
    currentMeme?.tokenAddress,
    props.feedAmount / (props.wldPrice ? Number(props.wldPrice || 0.00001) : 0.00001),
    true,
    0.01,
    currentMeme?.status === "completed"
  );

  const {
    data: forMeData,
    isPending,
    refetch,
  } = useMemeControllerFindMultipleRandom({
    limit: 10,
  });

  const {
    data: watchListData,
    isPending: watchListPending,
    refetch: watchListRefresh,
  } = useMemeControllerFindWatchListMultipleRandom({
    limit: 6,
  });

  const { data: userData, refetch: refetchUserData } = useUserControllerFindOne(
    getAddress(address || ZERO_ADDRESS),
    {
      query: {
        refetchOnMount: true,
        enabled: !!address,
      },
    }
  );

  useEffect(() => {
    if (forMeData) {
      setMemes(pre => [...pre, ...forMeData.map(item => ({ ...item, key: generateTokenId() }))]);
    }
  }, [forMeData]);

  useEffect(() => {
    if (props.tab === "watchList") {
      watchListRefresh();
      refetchUserData();
    }
  }, [props.tab]);

  useEffect(() => {
    if (watchListData) {
      setWatchListMemes(pre => [
        ...pre,
        ...watchListData.map(item => ({ ...item, key: generateTokenId() })),
      ]);
    }
  }, [watchListData]);

  const { nonHumanMaxWldCanBuy } = useGetBuyNonHuman({
    tokenId: memes[0]?.tokenAddress || ZERO_ADDRESS,
    isGuarded: memes[0]?.guarded || false,
    isUserVerified: !(userData as any)?.[0]?.nullifierHash,
  });

  const { convertUsdToWld } = useGetPrice();

  const handleSwipe = async (direction: "left" | "right") => {
    if (direction === "left") {
      if (props.tab === "forYou") {
        setMemes(prev => prev.slice(1));

        if (memes.length <= 4) {
          await refetch();
        }
        sendHapticFeedbackCommand({
          hapticsType: "notification",
          style: "warning",
        });
        return;
      }

      setWatchListMemes(prev => prev.slice(1));
      await watchListRefresh();
      sendHapticFeedbackCommand({
        hapticsType: "notification",
        style: "warning",
      });
    }

    if (direction === "right") {
      if (isBuying) {
        sendHapticFeedbackCommand({
          hapticsType: "notification",
          style: "error",
        });
        return;
      }

      const meme = memes[0];
      const isTokenMigrating = meme.status === MemeDetailResponseStatus.ended;

      // Is need human verified to buy on bonding curve
      const isGuarded = meme.guarded;

      if (
        isGuarded &&
        userData &&
        !(userData as any)?.[0]?.nullifierHash &&
        props.feedAmount > Number(nonHumanMaxWldCanBuy)
      ) {
        setIsOpenAlertVerifyHuman(true);
        sendHapticFeedbackCommand({
          hapticsType: "notification",
          style: "error",
        });
        return;
      }

      if (isTokenMigrating) {
        toast.error(t("tokenDetail.migrateToRaydiumInProgress"));
        sendHapticFeedbackCommand({
          hapticsType: "notification",
          style: "error",
        });

        return;
      }

      if (Number(formatEther(tokenBalance || BigInt(0))) < convertUsdToWld(props.feedAmount)) {
        sendHapticAction("notification", "error");
        toast.error(t("feed.insufficientBalance"));
        return;
      }

      if (!humanVerifiedData) {
        sendHapticFeedbackCommand({
          hapticsType: "notification",
          style: "error",
        });
        toast.error(t("feed.somethingWentWrong"));
        return;
      }

      if (!meme) return;

      try {
        setIsBuying(true);
        const currentTokenMemeAddress = meme.tokenAddress;
        await buy({
          tokenAddress: meme.tokenAddress,
          amountIn: (Number(memeOnChainData!.actualAmountIn) > convertUsdToWld(props.feedAmount)
            ? convertUsdToWld(props.feedAmount)
            : memeOnChainData!.actualAmountIn
          ).toString(),
          minimumOut: "0",
          tokenOutDecimals: 18,
          isOnDex: currentMeme.status === "completed",
          slippage: "0.01", // Default slippage of 1%
          isGuarded,
          humanVerifiedData,
          tokenSymbol: meme.symbol,
        });
        sendHapticFeedbackCommand({
          hapticsType: "notification",
          style: "success",
        });

        setMemes(prev => prev.filter(m => m.tokenAddress !== currentTokenMemeAddress));

        if (memes.length <= 2) {
          await refetch();
        }
      } catch (error: any) {
        sendHapticAction("notification", "error");
        toast.error(error.message);
      } finally {
        setIsBuying(false);
      }
    }
  };

  const handleComment = (tokenAddress: string) => {
    setMemes(prev =>
      prev.map(m =>
        m.tokenAddress === tokenAddress ? { ...m, totalComments: m.totalComments + 1 } : m
      )
    );
  };

  if (isPending || watchListPending) {
    return false;
  }

  const memeLists = props.tab === "forYou" ? memes : watchListMemes;
  return (
    <>
      <AlertVerifyHumanBottomDraw
        open={isOpenAlertVerifyHuman}
        setOpen={setIsOpenAlertVerifyHuman}
        refetch={refetchUserData}
        memeDetail={memes[0]}
      />
      {props.tab === "watchList" &&
      ((watchListMemes.length === 0 && !watchListPending) ||
        (userData && (userData as any)?.[0]?.totalFollowing === 0)) ? (
        <WatchListIsEmpty
          refreshWatchList={() => {
            refetchUserData();
            watchListRefresh();
          }}
        />
      ) : (
        <div
          className={clsx(
            "relative mx-auto w-full",
            isHiddenHighLightBanner ? "h-[calc(100vh-78px)]" : "h-[calc(100vh-117px)]"
          )}
        >
          <AnimatePresence>
            {memeLists.map((meme, index) => {
              // Only render top two cards for performance and preview
              if (index > 2) return null;
              return (
                <motion.div
                  key={`card-${meme.key}`}
                  className="absolute left-0 top-0 h-full w-full"
                  style={{
                    zIndex: memeLists.length - index,
                    // scale: index === 0 ? 1 : 0.9,
                    // y: index * 20,
                  }}
                >
                  {index === 0 ? (
                    <Card
                      index={index}
                      meme={meme}
                      handleComment={handleComment}
                      onSwipe={handleSwipe}
                      isBuying={isBuying}
                    />
                  ) : (
                    <Card
                      index={index}
                      meme={meme}
                      handleComment={handleComment}
                      onSwipe={() => null}
                      isBuying={isBuying}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
