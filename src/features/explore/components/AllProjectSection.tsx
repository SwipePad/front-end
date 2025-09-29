import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import { HorizontalProjectCard } from "@/components/shared/horizontal-project-card";
import { Separate } from "@/components/shared/separate";
import { Button } from "@/components/ui/button";
import { TimeSelectBottomDraw } from "@/features/explore/components/TimeSelectBottomDraw";
import { useQueryParamsPage } from "@/hooks/params/use-query-state-page";
import { useQueryParamsTime } from "@/hooks/params/use-query-state-time";
import { MemeControllerQueryPaginationSortBy, MemeResponse } from "@/services/models";
import { useMemeControllerQueryPagination } from "@/services/queries";
import moment from "moment";
import { useEffect, useState } from "react";
import FireIcon from "@/assets/icons/fire.svg?react";
import { useQueryParamsSortBy } from "@/hooks/params/use-query-sort-by";
import { SortBySelectBottomDraw } from "@/features/explore/components/SortBySelectBottomDraw";
import { useTranslation } from "react-i18next";
import ClockIcon from "@/assets/icons/clock2.svg?react";
import DollarIcon from "@/assets/icons/dollar.svg?react";
import CheckBadgeIcon from "@/assets/icons/check-badge-white-rounded-line.svg?react";

export function AllProjectSection({ quickBuyAmount }: { quickBuyAmount: number }) {
  const [openTime, setOpenTime] = useState(false);
  const [openSortBy, setOpenSortBy] = useState(false);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { pageSize } = useQueryParamsPage();

  const listTime = [
    { label: t("explore.allTime"), value: "" },
    { label: t("explore.today"), value: moment().startOf("day").unix().toString() },
    {
      label: t("explore.1Week"),
      value: moment().startOf("week").unix().toString(),
    },
    { label: t("explore.1Month"), value: moment().startOf("month").unix().toString() },
    { label: t("explore.1Year"), value: moment().startOf("year").unix().toString() },
  ];

  const listSortBy = [
    {
      label: t("explore.trendingTokens"),
      value: "volume24hs",
      icon: <FireIcon className="h-5 w-5 text-[red]" />,
    },
    {
      label: t("explore.createdTime"),
      value: "createdTime",
      icon: <ClockIcon className="size-5 h-5 w-5 text-green-500" />,
    },
    {
      label: t("explore.price"),
      value: "currentPriceByUsd",
      icon: <DollarIcon className="size-5 text-[#FE9800]" />,
    },
    {
      label: t("tokenDetail.bond"),
      value: "bond",
      icon: <CheckBadgeIcon className="h-[20px] w-[20px] text-[#FE9800]" />,
    },
  ];

  const { time, setTime } = useQueryParamsTime(listTime[0].value);
  const { sortBy, setSortBy } = useQueryParamsSortBy(listSortBy[0].value);

  const {
    data: trendingData,
    isFetching,
    isLoading,
  } = useMemeControllerQueryPagination(
    {
      page,
      pageSize,
      sortBy: sortBy === "bond" ? "volume24hs" : (sortBy as MemeControllerQueryPaginationSortBy),
      createdTime: time ? Number(time) : undefined,
      filter: sortBy === "bond" ? "end" : "all",
    },
    {
      query: {
        enabled: Boolean(page && pageSize),
      },
    }
  );
  const [allMemes, setAllMemes] = useState<MemeResponse[]>([]);

  useEffect(() => {
    if (trendingData?.data && !isLoading && !isFetching) {
      if (page === 1) {
        setAllMemes(trendingData.data as MemeResponse[]);
      } else {
        // Apend new memes -> when scroll down
        setAllMemes(prev => [...prev, ...(trendingData.data as MemeResponse[])]);
      }
    }
  }, [trendingData, isLoading, isFetching, page]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (nearBottom && !isFetching && trendingData?.data?.length === pageSize) {
        setPage(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, trendingData, pageSize, page]);

  return (
    <>
      <div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-[#141416]">{t("explore.allProjects")}</div>

            {!isFetching && !isLoading && (
              <p className="text-xs font-medium text-[#777E90]">
                {trendingData?.total} {t("explore.projects")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="pillOutline"
              className="flex w-fit flex-1 items-center justify-center text-[#23262F]"
              onClick={() => setOpenSortBy(true)}
            >
              {listSortBy.find(item => item.value === sortBy)?.icon}
              {listSortBy.find(item => item.value === sortBy)?.label}
              <ChevronDownIcon className="text-[#23262F]" />
            </Button>

            <Button
              variant="pillOutline"
              className="flex w-fit flex-1 justify-center text-[#23262F]"
              onClick={() => setOpenTime(true)}
            >
              {listTime.find(item => item.value === time)?.label}
              <ChevronDownIcon className="text-[#23262F]" />
            </Button>
          </div>

          <div className="space-y-2">
            {allMemes.map((item, index) => (
              <div key={index}>
                <HorizontalProjectCard
                  key={index}
                  data={item}
                  isQuickBuy={true}
                  quickBuyAmount={quickBuyAmount}
                  isShowMarketCapV2={true}
                  isShowGuarded={true}
                  isShowBond
                />
                {index < allMemes.length - 1 && <Separate />}
              </div>
            ))}

            {isLoading || isFetching ? (
              <p className="mx-auto text-center">{t("explore.loadingMore")}</p>
            ) : null}
          </div>

          {allMemes.length === 0 && !isLoading && !isFetching && (
            <div className="!mt-10 text-center text-sm text-[#777E90]">
              {t("explore.noProjectsFound")}
            </div>
          )}
        </div>
      </div>

      {openTime && (
        <TimeSelectBottomDraw
          open={openTime}
          setOpen={setOpenTime}
          listTime={listTime}
          time={time}
          setTime={selectedTime => {
            setPage(1);
            setTime(selectedTime);
          }}
        />
      )}

      {openSortBy && (
        <SortBySelectBottomDraw
          open={openSortBy}
          setOpen={setOpenSortBy}
          listSortBy={listSortBy}
          sortBy={sortBy}
          setSortBy={selectedSort => {
            setPage(1);
            setSortBy(selectedSort);
          }}
        />
      )}
    </>
  );
}
