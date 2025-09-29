import { useUser } from "@/components/providers/user-provider";
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
  useUserControllerFindFollowersPagination,
  useUserControllerFollow,
} from "@/services/queries";
import truncateAddress from "@/utils/truncate-address";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAddress, isAddress } from "viem";

export default function FollowerTab({ setTotal }: { setTotal: (total: number) => void }) {
  const { profileId } = useParams({
    strict: false,
  });
  const { address } = useUser();
  const isOtherProfile = useMemo(
    () => profileId && profileId.toLowerCase() !== address?.toLowerCase(),
    [profileId, address]
  );

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [followers, setFollowers] = useState<UserAndFollowStatusResponse[]>([]);
  const { pageSize } = useQueryParamsPage(1, 20);
  const { searchInput, setSearchInput } = useQueryParamsSearchInput();
  const { t } = useTranslation();
  const {
    data: followersData,
    isFetching,
    isLoading,
    refetch,
  } = useUserControllerFindFollowersPagination(
    {
      userWalletAddress: getAddress(profileId!),
      page: page,
      pageSize: pageSize,
      search: searchInput || undefined,
    },
    {
      query: {
        refetchOnMount: true,
      },
    }
  );

  useEffect(() => {
    if (followersData && !isFetching && !isLoading) {
      if (page !== 1) {
        setFollowers(prev => [...prev, ...followersData.data]);
        setTotal(followersData.total);
      } else {
        setFollowers([...followersData.data]);
        setTotal(followersData.total);
      }
    }
  }, [followersData, page, isFetching, isLoading]);

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
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (nearBottom && !isFetching && followersData?.data?.length === pageSize) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, followersData, pageSize]);

  return (
    <TabsContent value="followers">
      <div className="p-3">
        <Input
          placeholder={t("profile.searchForAnyone")}
          className="rounded-full"
          leftSection={<Search className="size-4" />}
          value={searchInput || ""}
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>

      <div className="flex justify-between px-4 py-2">
        <p className="font-semibold">{t("profile.allFollowers")}</p>
      </div>

      <div className="space-y-1 px-4 py-1">
        {followers.map(item => (
          <div key={item.name} className="py-2">
            <HorizontalBaseCard
              leftSection={
                <Image
                  src={item?.image || getRandomUserImage()}
                  alt={item.name}
                  className="h-10 w-10 rounded-md object-cover"
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
                  !item.isFollow ? (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onFollow(item.walletAddress)}
                        variant="pillOutline"
                        className="h-7 gap-1 px-3 py-0"
                      >
                        {t("profile.followBack")}
                      </Button>
                      {/* <X className="size-4" /> */}
                    </div>
                  ) : null
                ) : item.isFollow ||
                  item.walletAddress.toLowerCase() === address?.toLowerCase() ? null : (
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
    </TabsContent>
  );
}
