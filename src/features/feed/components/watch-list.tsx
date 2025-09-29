import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Image } from "@/components/ui/image";
import {
  useMemeControllerQueryTopCreatorsPagination,
  useUserControllerFollow,
} from "@/services/queries";
import { Loader2 } from "lucide-react";
import moment from "moment";
import { getAddress, isAddress } from "viem";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "@/components/providers/user-provider";
import { useTranslation } from "react-i18next";
import { getRandomUserImage } from "@/lib/utils";
import truncateAddress from "@/utils/truncate-address";

export const WatchListIsEmpty = ({ refreshWatchList }: { refreshWatchList: any }) => {
  const { t } = useTranslation();
  const { address } = useUser();
  const { data, isLoading, isFetching, refetch } = useMemeControllerQueryTopCreatorsPagination({
    page: 1,
    pageSize: 30,
  });

  const navigator = useNavigate();
  const { mutateAsync } = useUserControllerFollow();
  const onFollow = async (address: string) => {
    try {
      await mutateAsync({
        data: {
          followingWalletAddress: getAddress(address),
        },
      });
      refetch();
      refreshWatchList();
    } catch (error: any) {
      console.error("Error following user:", error);
    }
  };
  if (isLoading || isFetching || !data) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div
      className="flex h-full flex-col items-center justify-center"
      style={{ background: "linear-gradient(180deg, #FF9FC1 0%, #FFCEB4 100%)" }}
    >
      <p className="mb-8 text-center font-DrukWideBold text-[40px] font-bold leading-[32==48px] text-[#B00555]">
        {t("feed.highlighted")} <br /> {t("feed.author")}
      </p>
      <div className="w-full">
        <Swiper slidesPerView={1.5} centeredSlides={true} spaceBetween={12} grabCursor={true}>
          {data.data
            .filter(x => x.walletAddress.toLowerCase() !== address?.toLowerCase())
            .map(item => (
              <SwiperSlide key={item.walletAddress}>
                {({ isActive }) => (
                  <div
                    className={`flex w-full flex-col items-center justify-center rounded-[24px] bg-white transition-transform duration-300 ${isActive ? "" : "scale-90"}`}
                  >
                    <div
                      className="flex flex-col items-center justify-center px-[56px] pt-6"
                      onClick={() => navigator({ to: `/profile/${item.walletAddress}` })}
                    >
                      <div className="mb-2 h-[68px] w-[68px]">
                        <Image
                          src={item?.image || getRandomUserImage()}
                          className="mb-2 h-full w-full rounded-full"
                        />
                      </div>
                      <p className="text-center font-inter text-base font-bold leading-6 tracking-[-0.32px] text-black">
                        {isAddress(item.name) ? truncateAddress(item.name) : item.name}
                      </p>
                      <p className="text-center font-inter text-xs font-medium leading-5 tracking-[-0.26px] text-[#777E90]">
                        {t("feed.joinedOn")} {moment(item.created_at).format("DD/MM/YYYY")}
                      </p>
                    </div>
                    <p className="p-3 text-center font-inter text-[12px] font-medium leading-4 tracking-[-0.12px] text-[#141416]">
                      {item.bio
                        ? item.bio?.length < 80
                          ? item.bio
                          : `${item.bio?.slice(0, 80)}...`
                        : ""}
                    </p>
                    <div
                      className="w-full rounded-b-[24px] bg-[#141416] px-4 py-3 text-center text-[16px] font-semibold text-white"
                      onClick={() => onFollow(item.walletAddress)}
                    >
                      {item.isFollow ? t("profile.unfollow") : t("feed.follow")}
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};
