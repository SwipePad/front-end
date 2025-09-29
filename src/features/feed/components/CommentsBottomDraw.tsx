import { BottomDraw } from "@/components/shared/bottom-draw";
import { NoData } from "@/components/shared/no-data";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Input } from "@/components/ui/input";
import { onStreamingMessage, StreamingEventName, subscribeToChannel } from "@/lib/socket";
import { getRandomUserImage } from "@/lib/utils";
import { CommentResponse } from "@/services/models";
import { useCommentControllerCreate, useCommentControllerGetPagination } from "@/services/queries";
import { sendHapticAction } from "@/utils/miniapp";
import truncateAddress from "@/utils/truncate-address";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { Send } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAddress, isAddress } from "viem";

type CommentsBottomDrawProps = {
  index: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  tokenAddress: string;
  handleComment: (tokenAddress: string) => void;
  setTotalComments?: React.Dispatch<React.SetStateAction<number>>;
};

export function CommentsBottomDraw({
  index,
  open,
  setOpen,
  tokenAddress,
  handleComment,
  setTotalComments,
}: CommentsBottomDrawProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data } = useCommentControllerGetPagination({
    tokenAddress: getAddress(tokenAddress),
    page: 1,
    pageSize: 100,
  });

  const { mutate: createComment } = useCommentControllerCreate();
  const [content, setContent] = useState("");

  const [commentData, setCommentData] = useState<CommentResponse[]>([]);

  const handleCreateComment = (content: string) => {
    if (!content.trim()) {
      sendHapticAction("notification", "error");
      toast.error(t("feed.commentCannotBeEmpty"));
      return;
    }
    createComment(
      {
        data: {
          content: content.trim(),
          tokenAddress,
        },
      },
      {
        onSuccess: () => {
          sendHapticAction("notification", "success");
          toast.success(t("feed.commentCreatedSuccessfully"));
          setContent("");
          handleComment(tokenAddress);
        },
        onError: () => {
          toast.error(t("feed.failedToCreateComment"));
        },
      }
    );
  };

  useEffect(() => {
    if (!data || !data.data) {
      return;
    }
    setCommentData((data?.data as CommentResponse[]) || []);
  }, [data]);

  useEffect(() => {
    if (!tokenAddress || Number(index) !== 0) {
      return;
    }
    subscribeToChannel(StreamingEventName.SubscribeComment, getAddress(tokenAddress));

    onStreamingMessage(StreamingEventName.SubscribeComment, (newComment: CommentResponse) => {
      const existedComment = data?.data.find(comment => comment.id === newComment.id);

      if (!existedComment) {
        setCommentData(prev => [newComment, ...prev]);
        setTotalComments && setTotalComments((prev: number) => prev + 1);
      }
    });

    return () => {
      subscribeToChannel(StreamingEventName.UnSubscribeComment, getAddress(tokenAddress));
    };
  }, [tokenAddress, index]);

  const handleClickComment = (userAddress: string) => {
    navigate({ to: `/profile/${userAddress}` });
  };

  return (
    <BottomDraw isOpen={open} onClose={() => setOpen(false)} title={t("feed.comments")}>
      <div className="h-[450px] space-y-4 overflow-y-auto bg-white p-4">
        {commentData && commentData?.length && commentData?.length > 0 ? (
          commentData?.map(comment => (
            <div key={comment.id} className="flex items-start justify-between gap-3">
              <UserAvatar
                className="h-10 w-10"
                image={comment?.userInfo?.image || getRandomUserImage()}
                name={comment?.userInfo?.name}
                onClick={() => handleClickComment(comment?.walletAddress)}
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <p className="text-[#141416]">
                    {isAddress(comment?.userInfo?.name)
                      ? truncateAddress(comment?.userInfo?.name)
                      : "@" + comment?.userInfo?.name}
                  </p>
                  <p className="text-[#808080]">{moment(comment?.updated_at)?.fromNow()}</p>
                </div>

                <div className="text-sm font-normal text-black">{comment?.content}</div>
              </div>
            </div>
          ))
        ) : (
          <NoData title={t("tokenDetail.noCommentYet")} description="" isShowDescription={false} />
        )}
      </div>

      <div className="flex gap-2 bg-white px-4 pb-3 pt-2">
        <div className="flex-1">
          <Input
            placeholder={t("feed.joinTheConversation")}
            className="flex-1 rounded-full"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <Button
          onClick={() => handleCreateComment(content)}
          className="h-[42px]"
          disabled={!content.trim()}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </BottomDraw>
  );
}
