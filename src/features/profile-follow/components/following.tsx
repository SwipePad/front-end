import { useUser } from "@/components/providers/user-provider";
import { BottomDraw } from "@/components/shared/bottom-draw";
import { HorizontalBaseCard } from "@/components/shared/horizontal-base-card";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { useQueryParamsPage } from "@/hooks/params/use-query-state-page";
import { useQueryParamsSearchInput } from "@/hooks/params/use-query-state-search-input";
import { getRandomUserImage } from "@/lib/utils";
import { UserAndFollowStatusResponse } from "@/services/models";
import {
  useUserControllerFindFollowingPagination,
  useUserControllerFollow,
} from "@/services/queries";
import truncateAddress from "@/utils/truncate-address";
import { useNavigate, useParams } from "@tanstack/react-router";
import { RadioGroup, RadioGroupItem } from "@worldcoin/mini-apps-ui-kit-react";
import { ChevronLeft, Search, SortAsc } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAddress, isAddress } from "viem";

export default function FollowingTab({ setTotal }: { setTotal: (total: number) => void }) {
  const { profileId } = useParams({
    strict: false,
  });
  const { address } = useUser();
  const [openSort, setOpenSort] = useState(false);
  const isOtherProfile = useMemo(
    () => profileId && profileId.toLowerCase() !== address?.toLowerCase(),
    [profileId, address]
  );
  const [page, setPage] = useState(1);
  const [following, setFollowings] = useState<UserAndFollowStatusResponse[]>([]);
  const { pageSize } = useQueryParamsPage(1, 20);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | "undefined">("undefined");
  const { searchInput, setSearchInput } = useQueryParamsSearchInput();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sortOptions = [
    { value: "undefined", name: t("profile.default") },
    { value: "ASC", name: t("profile.followLatestToCurrent") },
    { value: "DESC", name: t("profile.followCurrentToLatest") },
  ];
  const {
    data: followingData,
    isFetching,
    isLoading,
    refetch,
  } = useUserControllerFindFollowingPagination(
    {
      userWalletAddress: getAddress(profileId!),
      page: page,
      pageSize: pageSize,
      sortBy: "createdTime",
      sortOrder: sortOrder === "undefined" ? undefined : sortOrder,
      search: searchInput || undefined,
    },
    {
      query: {
        refetchOnMount: true,
      },
    }
  );

  useEffect(() => {
    if (followingData && !isFetching && !isLoading) {
      if (page !== 1) {
        setFollowings(prev => [...prev, ...followingData.data]);
        setTotal(followingData.total);
      } else {
        setFollowings([...followingData.data]);
        setTotal(followingData.total);
      }
    }
  }, [followingData, page, isFetching, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (nearBottom && !isFetching && followingData?.data?.length === pageSize) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, followingData, pageSize]);

  const { mutateAsync } = useUserControllerFollow();
  const onFollow = async (address: string) => {
    try {
      await mutateAsync({
        data: {
          followingWalletAddress: getAddress(address),
        },
      });
      await refetch();
    } catch (error: any) {
      console.error("Error following user:", error);
    }
  };

  return (
    <TabsContent value="following">
      <div className="p-3">
        <Input
          placeholder={t("profile.searchForAnyone")}
          className="rounded-full"
          leftSection={<Search className="size-4" />}
          value={searchInput || ""}
          onChange={e => {
            setSearchInput(e.target.value);
            setPage(1); // Reset page when search input changes
          }}
        />
      </div>

      <div className="flex justify-between px-4 py-2">
        <p className="font-semibold">
          {sortOptions.find(
            item => item.value === (sortOrder === undefined ? "undefined" : sortOrder)
          )?.name ?? "Default"}
        </p>
        <Button
          onClick={() => setOpenSort(true)}
          variant="pillOutline"
          className="h-7 gap-1 px-3 py-0"
        >
          <SortAsc className="size-4" />
        </Button>
      </div>

      <div className="space-y-1 px-4 py-1">
        {following.map(item => (
          <div key={item.name} className="py-2">
            <HorizontalBaseCard
              leftSection={
                <Image
                  src={item?.image || getRandomUserImage()}
                  alt={item.name}
                  className="h-10 w-10 rounded-md"
                  onClick={() => navigate({ to: `/profile/${item.walletAddress}` })}
                />
              }
              centerSection={
                <div onClick={() => navigate({ to: `/profile/${item.walletAddress}` })}>
                  <p className="text-sm font-medium">
                    {isAddress(item.name) ? truncateAddress(item.name) : item.name}
                  </p>
                  <p className="text-xs font-medium lowercase text-[#777E90]">
                    {item.totalFollowers}{" "}
                    {t(item.totalFollowers > 1 ? "profile.followers" : "profile.follower")}
                  </p>
                </div>
              }
              rightSection={
                !isOtherProfile ? (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onFollow(item.walletAddress)}
                      variant="pillOutline"
                      className="h-7 gap-1 px-3 py-0"
                    >
                      {item.isFollow ? t("profile.unfollow") : t("profile.follow")}
                    </Button>
                    {/* <X className="size-4" /> */}
                  </div>
                ) : item.isFollow ||
                  item.walletAddress.toLowerCase() == address?.toLowerCase() ? null : (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onFollow(item.walletAddress)}
                      variant="pillOutline"
                      className="h-7 gap-1 px-3 py-0"
                    >
                      {t("profile.follow")}
                    </Button>
                    {/* <X className="size-4" /> */}
                  </div>
                )
              }
            />
          </div>
        ))}
        {/* {isLoading || isFetching ? <p>Loading more...</p> : null} */}
      </div>
      <BottomDraw
        isOpen={openSort}
        onClose={() => setOpenSort(false)}
        title={t("profile.sortBy")}
        leftSection={<ChevronLeft className="size-6" onClick={() => setOpenSort(false)} />}
      >
        <div className="p-4">
          <RadioGroup
            value={sortOrder}
            onChange={value => {
              setSortOrder(value as any);
              setPage(1);
            }}
          >
            {sortOptions.map(item => (
              <div key={item.name} className="flex justify-between">
                <span className="p-2 text-[14px] font-medium not-italic leading-[20px] tracking-[-0.56px]">
                  {item.name}
                </span>
                <RadioGroupItem value={item.value} />
              </div>
            ))}
          </RadioGroup>
        </div>
      </BottomDraw>
    </TabsContent>
  );
}
