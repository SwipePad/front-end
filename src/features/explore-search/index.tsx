import SearchBarIcon from "@/assets/icons/search-bar.svg?react";
import { HorizontalProjectCard } from "@/components/shared/horizontal-project-card";
import HorizontalUserCard from "@/components/shared/horizontal-user-card";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import ExploreSearchType from "@/features/explore-search/search-type";
import { useQueryParamsSearchInput } from "@/hooks/params/use-query-state-search-input";
import { useDebounce } from "@/hooks/utils/use-debounce";
import {
  useMemeControllerQueryPagination,
  useUserControllerFindPagination,
} from "@/services/queries";
import { useRouter } from "@tanstack/react-router";
import { Input } from "@worldcoin/mini-apps-ui-kit-react";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { getAddress } from "viem";
import "swiper/css";
import "swiper/css/pagination";
import RecentSearch from "@/features/explore-search/recent-search";
import { useTranslation } from "react-i18next";
import numeral from "numeral";

export enum SearchType {
  All = "explore.all",
  Token = "explore.token",
  Creator = "explore.creator",
}

export function ExploreSearch() {
  const router = useRouter();
  const { searchInput, setSearchInput } = useQueryParamsSearchInput();
  const searchInputDebounced = useDebounce(searchInput, 300);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.All);
  const { t } = useTranslation();
  const { data: trendingData } = useMemeControllerQueryPagination({
    page: 1,
    pageSize: 10,
    sortBy: "volume24hs",
  });

  const { data: searchData, isLoading: isLoadingSearchToken } = useMemeControllerQueryPagination({
    page: 1,
    pageSize: 10,
    sortBy: "volume24hs",
    search: searchInputDebounced || undefined,
  });

  const {
    data: searchCreatorData,
    refetch,
    isLoading: isLoadingSearchCreator,
  } = useUserControllerFindPagination({
    page: 1,
    pageSize: 10,
    search: searchInputDebounced || undefined,
  });

  const shouldShowNoResult = () => {
    const tokenEmpty = !searchData?.data?.length;
    const creatorEmpty = !searchCreatorData?.data?.length;

    if (searchType === SearchType.All) {
      return tokenEmpty && creatorEmpty && !isLoadingSearchToken && !isLoadingSearchCreator;
    }

    if (searchType === SearchType.Token) {
      return tokenEmpty && !isLoadingSearchToken;
    }

    if (searchType === SearchType.Creator) {
      return creatorEmpty && !isLoadingSearchCreator;
    }

    return false;
  };

  const handleAddRecentSearch = (
    address: string,
    name: string,
    image: string,
    type: SearchType
  ) => {
    const MAX_RECENT_SEARCHES = 5;
    const recentSearches = JSON.parse(localStorage.getItem("exploreSearchRecent") || "[]");

    // Check if the search already exists
    const existingIndex = recentSearches.findIndex(
      (item: { address: string }) => item.address === address
    );

    if (existingIndex !== -1) {
      // Remove the existing search
      recentSearches.splice(existingIndex, 1);
    }

    // Add the new search to the beginning of the array
    recentSearches.unshift({ name, image, address, type });

    // Limit to 5 recent searches
    if (recentSearches.length > MAX_RECENT_SEARCHES) {
      recentSearches.pop();
    }

    localStorage.setItem("exploreSearchRecent", JSON.stringify(recentSearches));
  };

  const handleClickTrendingItem = (
    address: string,
    name: string,
    image: string,
    type: SearchType
  ) => {
    handleAddRecentSearch(address, name, image, type);

    router.navigate({
      to: `/tokens/${getAddress(address)}`,
    });
  };

  return (
    <section className="space-y-4 overflow-hidden rounded-t-2xl p-4">
      <div className="flex w-full items-center justify-center gap-2">
        <ChevronLeft className="h-4 w-4 font-bold" onClick={() => router.history.back()} />
        <div className="flex-1">
          <Input
            className="h-12 rounded-full border border-[#E6E8EC] px-4 py-3 text-sm font-normal leading-5"
            label={t("explore.searchForAnyProjects")}
            value={searchInput || ""}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {searchInput && <ExploreSearchType searchType={searchType} setSearchType={setSearchType} />}

      {!searchInput && <RecentSearch />}

      {!searchInput && (
        <div className="space-y-2">
          <p className="text-sm font-semibold leading-4 text-[#141416]">{t("explore.trending")}</p>

          <Swiper slidesPerView={2} spaceBetween={16} grabCursor={true}>
            {trendingData?.data.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  key={index}
                  className="min-w-[152px] space-y-2 rounded-xl border border-[#E6E8EC] p-3"
                  onClick={() =>
                    handleClickTrendingItem(
                      item.tokenAddress,
                      item.name,
                      item.image,
                      SearchType.Token
                    )
                  }
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="size-[18px] rounded-[4px] object-cover"
                    />
                    <p className="line-clamp-1 text-sm font-medium leading-5 text-[#141416]">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm font-semibold leading-4 text-[#141416]">
                    {t("explore.marketCap")}: {numeral(item.marketCap).format("$0a")}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {searchInput &&
        searchData?.data &&
        searchData?.data?.length > 0 &&
        [SearchType.All, SearchType.Token].includes(searchType) && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">{t("explore.token")}</div>

            {searchData?.data.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  handleAddRecentSearch(item.tokenAddress, item.name, item.image, SearchType.Token)
                }
              >
                <HorizontalProjectCard key={index} data={item} />
              </div>
            ))}
          </div>
        )}

      {searchInput &&
        searchCreatorData?.data &&
        searchCreatorData?.data?.length > 0 &&
        [SearchType.All, SearchType.Creator].includes(searchType) && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">{t("explore.creator")}</div>

            {searchCreatorData?.data.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  handleAddRecentSearch(
                    item.walletAddress,
                    item.name,
                    item.image,
                    SearchType.Creator
                  )
                }
              >
                <HorizontalUserCard
                  key={index}
                  {...item}
                  imageAlt={`${item.name}_user_image`}
                  refetch={refetch}
                />
              </div>
            ))}
          </div>
        )}

      {searchInput && shouldShowNoResult() && (
        <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
          <p className="text-sm font-medium leading-5 text-[#777E90]">
            {t("explore.noResults")} <br />
            {t("explore.for")} <span className="text-black">{searchInput}</span>
          </p>
          <Button variant="pillOutline" className="w-32" onClick={() => setSearchInput("")}>
            <SearchBarIcon className="size-4" />
            {t("explore.tryAgain")}
          </Button>
        </div>
      )}
    </section>
  );
}
