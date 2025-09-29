import LaurenChampionWinner from "@/assets/icons/lauren-champion-winner.svg?react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { MemePaginationResponse } from "@/services/models";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import numeral from "numeral";
import { useTranslation } from "react-i18next";
import LeaderboardBackground from "@/assets/icons/leader-board_background.svg?react";
interface RankingTop100SectionProps {
  data?: MemePaginationResponse;
}

export function RankingTop100Section({ data }: RankingTop100SectionProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative w-full overflow-hidden rounded-[20px]">
      <LeaderboardBackground className="ml-[-10px] h-[90%] w-[calc(100%+20px)] rounded-[20px]" />

      <div className="absolute bottom-[20px] left-1/2 mx-auto flex h-full w-full -translate-x-1/2 items-center justify-center">
        <Image
          src="/images/explore/white-light-shape.png"
          className="light-spin360 min-h-[600px] min-w-[600px] rounded-[20px]"
          alt="white-light-shape"
        />
      </div>

      <Button
        className="absolute bottom-6 left-1/2 h-6 w-max -translate-x-1/2 gap-1 rounded-full border bg-white p-0 px-1 text-xs font-medium shadow-[0_2px_6px_0_rgba(0,0,0,0.12)]"
        onClick={() => navigate({ to: "/explore/leaderboard" })}
      >
        {t("explore.seeAll")}
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute left-0 top-3 mt-4 w-full space-y-1 text-center">
        <div className="druk-wide-font text-xl font-bold text-white">
          {t("explore.rankingTop100")}
        </div>
        <div className="text-base font-normal text-white">
          {t("explore.theBestCryptoInOurPlatform")}
        </div>
      </div>

      {/* top2 */}
      <div
        className="absolute bottom-[128px] left-4 text-center text-white"
        onClick={() => navigate({ to: `/tokens/${data?.data[1].tokenAddress}` })}
      >
        <div className="relative m-auto mb-2 h-11 w-11 rounded-full border border-white">
          <div className="absolute left-1/2 top-0 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#0071EA] bg-[#28ADFF] text-[11px] font-black">
            2
          </div>
          <Image
            src={data?.data[1]?.image}
            className="h-full w-full rounded-full object-cover"
            alt={data?.data[1]?.name ?? ""}
          />
        </div>

        <div className="line-clamp-1 max-w-28 text-base font-bold leading-4">
          {data?.data[1]?.name}
        </div>
        {data?.data[1]?.marketCap && (
          <div className="text-xs font-medium opacity-75">
            {t("explore.mCap")} ∙{" "}
            <span className="uppercase">{numeral(data?.data[1]?.marketCap).format("0.0a$")}</span>
          </div>
        )}
      </div>

      {/* top3 */}
      <div
        className="absolute bottom-[128px] right-4 text-center text-white"
        onClick={() => navigate({ to: `/tokens/${data?.data[2].tokenAddress}` })}
      >
        <div className="relative m-auto mb-2 h-11 w-11 rounded-full border border-white">
          <div className="absolute left-1/2 top-0 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#007039] bg-[#009C50] text-[11px] font-black">
            3
          </div>
          <Image
            src={data?.data[2]?.image}
            className="h-full w-full rounded-full object-cover"
            alt={data?.data[2]?.name ?? ""}
          />
        </div>

        <div className="line-clamp-1 max-w-28 text-base font-bold leading-4">
          {data?.data[2]?.name}
        </div>
        {data?.data[2]?.marketCap && (
          <div className="text-xs font-medium opacity-75">
            {t("explore.mCap")} ∙{" "}
            <span className="uppercase">{numeral(data?.data[2]?.marketCap).format("0.0a$")}</span>
          </div>
        )}
      </div>
      {/* top1 */}
      <div
        className="absolute bottom-[160px] left-1/2 -translate-x-1/2 text-center text-white"
        onClick={() => navigate({ to: `/tokens/${data?.data[0].tokenAddress}` })}
      >
        <div className="relative m-auto mb-2 h-14 w-14 rounded-full border border-[#EAA900]">
          <div className="absolute left-1/2 top-0 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#EAA900] bg-[#FFC121] text-[11px] font-black">
            1
          </div>
          <Image
            src={data?.data[0]?.image}
            className="h-full w-full rounded-full object-cover"
            alt={data?.data[0]?.name ?? ""}
          />
          <LaurenChampionWinner className="absolute -bottom-1 right-1/2 -z-10 translate-x-1/2" />
        </div>

        <div className="line-clamp-1 max-w-28 text-base font-bold leading-4">
          {data?.data[0]?.name}
        </div>
        {data?.data[0]?.marketCap && (
          <div className="text-xs font-medium opacity-75">
            {t("explore.mCap")} ∙{" "}
            <span className="uppercase">{numeral(data?.data[0]?.marketCap).format("0.0a$")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
