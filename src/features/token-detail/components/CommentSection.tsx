import { NoData } from "@/components/shared/no-data";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { CommentPaginationResponse } from "@/services/models";
import truncateAddress from "@/utils/truncate-address";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { Send } from "lucide-react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { isAddress } from "viem";

type CommentSectionProps = {
  data?: CommentPaginationResponse;
  handleCreateComment: (content: string) => void;
  content: string;
  setContent: (content: string) => void;
};

export function CommentSection({
  data,
  handleCreateComment,
  content,
  setContent,
}: CommentSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-3 p-4">
      <p className="font-medium text-black">
        {t(Number(data?.total || 0) > 1 ? "tokenDetail.comments" : "tokenDetail.comment")} (
        {data?.total})
      </p>

      <div className="space-y-4">
        {data?.data && data.data.length > 0 ? (
          data?.data.map(comment => (
            <div key={comment.id} className="flex items-start justify-between gap-3">
              <Image
                src={comment.userInfo?.image}
                className="max-h-10 min-h-10 min-w-10 max-w-10 rounded-full object-cover"
                onClick={() => navigate({ to: `/profile/${comment.walletAddress}` })}
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium">
                  {/* <p className="text-[#141416]">@{comment.userInfo.name}</p> */}
                  <p className="text-[#141416]">
                    {isAddress(comment.userInfo.name)
                      ? truncateAddress(comment.userInfo.name)
                      : `@${comment.userInfo.name}`}
                  </p>
                  <p className="text-[#808080]">{moment(comment.updated_at).fromNow()}</p>
                </div>

                <div className="text-sm font-normal text-black">{comment.content}</div>
              </div>
            </div>
          ))
        ) : (
          <NoData title={t("tokenDetail.noCommentYet")} isShowDescription={false} />
        )}
      </div>

      <div className="fixed bottom-[139px] left-0 right-0 flex gap-2 bg-white px-4 pb-3 pt-2">
        <div className="flex-1">
          <Input
            placeholder={t("tokenDetail.joinTheConversation")}
            className="flex-1 rounded-full"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <Button
          onClick={() => handleCreateComment(content)}
          className="h-[42px]"
          disabled={!content}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
