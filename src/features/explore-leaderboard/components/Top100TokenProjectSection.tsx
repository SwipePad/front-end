import { Image } from "@/components/ui/image";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import LeaderboardStageIcon from "@/assets/icons/leaderboard-stage.svg?react";

export function Top100TokenProjectSection() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  return (
    <div className="relative w-full rounded-t-2xl">
      <div className="relative h-[250px] w-full bg-[#00CF79]">
        <LeaderboardStageIcon className="absolute right-4 top-3 h-[40px] w-[37px]" />

        <div className="absolute left-1/2 top-1/2 mx-auto flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden">
          <Image
            src="/images/explore/white-light-shape.png"
            className="light-spin360 min-h-[600px] min-w-[600px]"
            alt="white-light-shape"
          />
        </div>

        <Image
          src={`/images/explore/top-market-cap_${i18n.language}.png`}
          className="absolute left-1/2 top-1/2 h-[92px] min-w-[310px] -translate-x-1/2 -translate-y-1/2"
          alt="top-100"
        />
      </div>
      <div className="absolute left-0 top-0 flex h-fit w-full items-center justify-center px-4 pt-5 text-white">
        <div className="flex-1">
          <ChevronLeft className="h-4 w-4 font-bold" onClick={() => router.history.back()} />
        </div>
        <div className="text-center text-lg font-semibold leading-6">
          {t("explore.leaderboard")}
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
}
