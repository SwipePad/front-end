import ClockIcon from "@/assets/icons/clock.svg?react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { UserResponse } from "@/services/models";
import { useNavigate } from "@tanstack/react-router";
import numeral from "numeral";
import HumanIcon from "@/assets/icons/human.svg?react";
import { useTranslation } from "react-i18next";
import { getRandomUserImage } from "@/lib/utils";
import { isAddress } from "viem";
import truncateAddress from "@/utils/truncate-address";
import moment from "moment";

type CreatorCardProps = {
  data?: UserResponse;
};

export function CreatorCard({ data }: CreatorCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="space-y-2 rounded-2xl border border-[#E6E8EC] p-3">
      <div className="flex items-center gap-2">
        <div className="relative h-12 min-w-12 max-w-12 overflow-hidden rounded-xl p-[1px] shadow-[0px_2.261px_6.783px_0px_rgba(0,0,0,0.12)]">
          <Image
            src={data?.image || getRandomUserImage()}
            alt={data?.name ?? ""}
            crossOrigin="anonymous"
            className="h-full w-full rounded-xl object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="font-medium text-[#141416]">
            {data?.name && isAddress(data?.name) ? truncateAddress(data?.name) : `@${data?.name}`}
          </p>
          <p className="text-sm text-[#777E90]">
            {numeral(data?.totalFollowers).format("0,0a")}{" "}
            {t(
              (data?.totalFollowers || 0) > 1
                ? "shared.creatorCard.followers"
                : "shared.creatorCard.follower"
            )}
          </p>
        </div>

        <div>
          <Button
            className="w-[118px] rounded-lg border border-[#E6E8EC]"
            onClick={() =>
              navigate({
                to: "/profile/$walletAddress",
                params: { walletAddress: data?.walletAddress },
              })
            }
          >
            {t("shared.creatorCard.viewProfile")}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {data?.nullifierHash && (
          <p className="flex items-center gap-1 text-sm text-[#777E90]">
            <HumanIcon className="h-[14px] w-[14px] text-[#0064EF]" />

            <p className="text-xs font-semibold text-[#0064EF]">
              {t("shared.creatorCard.humanVerified")}
            </p>
          </p>
        )}

        {data?.created_at && (
          <p className="flex items-center gap-1 text-sm text-[#777E90]">
            <ClockIcon className="size-4" /> {t("shared.creatorCard.createdOn")}
            <span>{moment(data?.created_at).format("DD/MM/YYYY")}</span>
          </p>
        )}
      </div>
    </div>
  );
}
