import SearchIcon from "@/assets/icons/search.svg?react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
// import { Image } from "@/components/ui/image";
import { AllProjectSection } from "@/features/explore/components/AllProjectSection";
import { RankingTop100Section } from "@/features/explore/components/RankingTop100Section";
import { useQueryParamsPage } from "@/hooks/params/use-query-state-page";
import { useMemeControllerQueryPagination } from "@/services/queries";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
// import WorldCoinIcon from "@/assets/images/home/worldcoin-icon.png";
import { useState } from "react";
import { ArrowBottomIcon } from "@/components/shared/icons";
import ConfigQuickBuyBottomDraw from "@/features/explore/components/ConfigQuickBuyBottomDraw";
import { useLocalStorage } from "@/hooks/utils/use-local-storage";
import { useTranslation } from "react-i18next";

export function Explore() {
  const navigate = useNavigate();
  const { page } = useQueryParamsPage();
  const { t } = useTranslation();
  const [isOpenSetQuickBuyAmount, setisOpenSetQuickBuyAmount] = useState<boolean>(false);

  const [quickBuyAmount, setQuickBuyAmount] = useLocalStorage<number>("quickBuyAmount", 3);

  const {
    data: top3MarketCapData,
    isLoading,
    isFetching,
  } = useMemeControllerQueryPagination({
    page,
    pageSize: 3,
    sortBy: "currentPriceByUsd",
  });

  if (isLoading || isFetching) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <section className="space-y-5 rounded-t-2xl p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-2xl font-semibold">
          {t("explore.title")}
          <div className="flex items-center gap-2">
            <Button
              variant="tertiary"
              size="sm"
              className="h-[26px] px-2 py-1"
              onClick={() => setisOpenSetQuickBuyAmount(true)}
            >
              <span className="font-[13px] leading-[18px] text-[#808080]">
                {t("explore.amount")}
              </span>
              <span className="flex items-center gap-1">
                <span className="whitespace-nowrap font-[500]">{quickBuyAmount} $</span>
                {/* <span>
                  <Image src={WorldCoinIcon} alt="worldcoin-icon" />
                </span> */}
                <span>
                  <ArrowBottomIcon />
                </span>
              </span>
            </Button>

            <SearchIcon className="h-5 w-5" onClick={() => navigate({ to: "/explore/search" })} />
          </div>
        </div>

        {isOpenSetQuickBuyAmount && (
          <ConfigQuickBuyBottomDraw
            isOpen={isOpenSetQuickBuyAmount}
            setOpen={setisOpenSetQuickBuyAmount}
            quickBuyAmount={quickBuyAmount}
            setQuickBuyAmount={setQuickBuyAmount}
          />
        )}
        <RankingTop100Section data={top3MarketCapData} />
        <AllProjectSection quickBuyAmount={quickBuyAmount} />
      </div>
    </section>
  );
}
