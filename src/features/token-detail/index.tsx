import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { ChartSection } from "@/features/token-detail/components/ChartSection";
import { CommentSection } from "@/features/token-detail/components/CommentSection";
import MigrateTokenToDex from "@/features/token-detail/components/MigrateTokenToDex";
import { OverviewSection } from "@/features/token-detail/components/OverviewSection";
import { ShareBottomDraw } from "@/features/token-detail/components/ShareBottomDraw";
import { TabsSection } from "@/features/token-detail/components/TabsSection";
import { TopHolderSection } from "@/features/token-detail/components/TopHolderSection";
import { TxHistorySection } from "@/features/token-detail/components/TxHistorySection";
import { MemeDetailResponseStatus } from "@/services/models";
import {
  getCommentControllerGetPaginationQueryKey,
  useCommentControllerCreate,
  useCommentControllerGetPagination,
  useMemeControllerFindDetail,
  useMemeControllerFindTopHolders,
} from "@/services/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAddress } from "viem";
import ShareIcon from "@/assets/icons/share.svg?react";
import { sendHapticAction } from "@/utils/miniapp";
import { useQueryParamsTabs } from "@/hooks/params/use-query-state-tabs";

export function TokenDetail() {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const { tokenId } = useParams({
    strict: false,
  });
  const { tabs } = useQueryParamsTabs();

  const navigate = useNavigate();
  const { data: memeDetail, refetch } = useMemeControllerFindDetail(getAddress(tokenId), {
    query: {
      refetchInterval: 3000,
    },
  });

  const { data: commentData } = useCommentControllerGetPagination({
    page: 1,
    pageSize: 100,
    tokenAddress: getAddress(tokenId),
  });

  const { data: topHoldersData } = useMemeControllerFindTopHolders(getAddress(tokenId));

  const { mutate: createComment } = useCommentControllerCreate();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  if (!memeDetail) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  const handleCreateComment = (content: string) => {
    createComment(
      {
        data: {
          content: content.trim(),
          tokenAddress: getAddress(tokenId),
        },
      },
      {
        onSuccess: () => {
          sendHapticAction("notification", "success");
          toast.success(t("tokenDetail.commentCreatedSuccessfully"));
          setContent("");
          queryClient.refetchQueries({
            queryKey: getCommentControllerGetPaginationQueryKey({
              page: 1,
              pageSize: 100,
              tokenAddress: getAddress(tokenId),
            }),
          });
        },
        onError: () => {
          sendHapticAction("notification", "error");
          toast.error(t("tokenDetail.commentCreatedFailed"));
        },
      }
    );
  };

  // Token is migrating but it not avaiable in the DEX yet
  const isTokenMigrating = memeDetail.status === MemeDetailResponseStatus.ended;

  return (
    <section className="rounded-t-2xl">
      <Header
        title={memeDetail.name}
        rightSection={<ShareIcon className="h-5 w-5" onClick={() => setOpen(true)} />}
      />
      <ChartSection
        tokenAddress={tokenId}
        tokenSymbol={memeDetail.symbol}
        currentPrice={memeDetail.currentPriceByUsd}
      />
      <TabsSection
        tabsContent={
          <div style={{ paddingBottom: tabs === "overview" || !tabs ? "40px" : "100px" }}>
            <TabsContent value="overview">
              <OverviewSection data={memeDetail} refetch={refetch} />
            </TabsContent>
            <TabsContent value="top-holder">
              <TopHolderSection data={topHoldersData} memeDetail={memeDetail} />
            </TabsContent>
            <TabsContent value="tx-history">
              <TxHistorySection />
            </TabsContent>
            <TabsContent value="comment">
              <CommentSection
                data={commentData}
                handleCreateComment={handleCreateComment}
                content={content}
                setContent={setContent}
              />
            </TabsContent>
          </div>
        }
        totalHolders={topHoldersData?.length || 0}
      />

      {isTokenMigrating ? (
        <MigrateTokenToDex />
      ) : (
        <div className="fixed bottom-[80px] left-0 right-0 z-[20] flex items-center gap-2 bg-white p-4">
          <Button
            className="flex-1 rounded-xl bg-[#FF3459] text-white"
            onClick={() => {
              navigate({ to: `/sell/${tokenId}` });
              sendHapticAction();
            }}
          >
            {t("tokenDetail.sell")}
          </Button>
          <Button
            className="flex-1 rounded-xl bg-[#19BF58] text-white"
            onClick={() => {
              navigate({ to: `/buy/${tokenId}` });
              sendHapticAction();
            }}
          >
            {t("tokenDetail.buy")}
          </Button>
        </div>
      )}

      {open && (
        <ShareBottomDraw
          open={open}
          setOpen={setOpen}
          data={{
            avatarUrl: memeDetail.image,
            name: memeDetail.name,
            symbol: memeDetail.symbol,
            // facebookUrl: memeDetail.,
            xUrl: memeDetail.x,
            // instagramUrl: memeDetail.,
            discordUrl: memeDetail.discord,
            websiteUrl: `https://worldcoin.org/mini-app?app_id=${import.meta.env.VITE_APP_ID}&path=/tokens/${tokenId}`,
          }}
        />
      )}
    </section>
  );
}
