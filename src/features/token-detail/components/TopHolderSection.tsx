import { NoData } from "@/components/shared/no-data";
import { OrderCircle } from "@/components/shared/order-circle";
import { Separate } from "@/components/shared/separate";
import { Image } from "@/components/ui/image";
import { cn, getRandomUserImage } from "@/lib/utils";
import {
  FormattedTopHolderResponse,
  MemeDetailResponse,
  MemeDetailResponseStatus,
} from "@/services/models";
import truncateAddress from "@/utils/truncate-address";
import { useTranslation } from "react-i18next";
import { getAddress, isAddress } from "viem";

type TopHolderSectionProps = {
  data: FormattedTopHolderResponse[] | undefined;
  memeDetail: MemeDetailResponse;
};

export function TopHolderSection({ data, memeDetail }: TopHolderSectionProps) {
  const { t } = useTranslation();

  const renderHolderName = (item: FormattedTopHolderResponse) => {
    if (
      memeDetail.status === MemeDetailResponseStatus.completed &&
      getAddress(item?.walletAddress) === getAddress(memeDetail.pairAddress)
    ) {
      return t("tokenDetail.liquidityPool");
    }

    if (getAddress(item.walletAddress) === getAddress(import.meta.env.VITE_TOKEN_MEME_ADDRESS)) {
      return t("tokenDetail.bondingCurve");
    }
    if (!isAddress(item?.userInfo.name)) {
      return item?.userInfo.name;
    }
    return truncateAddress(item.walletAddress);
  };

  return (
    <div className="space-y-2 p-4">
      <div>
        {data ? (
          data.map((item, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 py-2">
                <OrderCircle index={index} />
                <Image
                  className="h-5 w-5 rounded-full object-cover"
                  src={item?.userInfo?.image || getRandomUserImage()}
                  alt={item?.userInfo?.name}
                />
                <p className="flex-1">{renderHolderName(item)}</p>
                <p className={cn("text-xs font-semibold text-[#1FA645]")}>{item.holdingPercent}%</p>
              </div>

              {index < data.length - 1 && <Separate className="m-auto w-[90%]" />}
            </div>
          ))
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
}
