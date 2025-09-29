import { WhiteWorldCoinSmallIcon } from "@/components/shared/icons";
import { OrderCircle } from "@/components/shared/order-circle";
import { toast } from "@/components/shared/toast";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { MemeResponse } from "@/services/models";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { isNumber } from "es-toolkit/compat";
import numeral from "numeral";
import { formatUnits } from "viem";
import HumanIcon from "@/assets/icons/human.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import CheckBadgeIcon from "@/assets/icons/check-badge-white-rounded-line.svg?react";
import { useTranslation } from "react-i18next";
import { sendHapticAction } from "@/utils/miniapp";
import PriceTiny from "@/features/token-detail/components/format-price";
import { toCurrency } from "@/lib/number";

type TokenDataType = MemeResponse & {
  rawBalance?: string;
  readableBalance?: string;
};
type HorizontalProjectCardProps = {
  data: TokenDataType;
  isShowIndex?: boolean;
  index?: number;
  isShowMarketCap?: boolean;
  isShowMarketCapV2?: boolean;
  isHoldingMode?: boolean;
  isShowTotalTokens?: boolean;
  isQuickBuy?: boolean;
  quickBuyAmount?: number | null;
  isShowGuarded?: boolean;
  isEditable?: boolean;
  isShowBond?: boolean;
};

export function HorizontalProjectCard({
  data,
  isShowIndex,
  index,
  isShowMarketCap,
  isShowMarketCapV2 = false,
  isHoldingMode,
  isShowTotalTokens,
  isQuickBuy = false,
  isShowGuarded,
  quickBuyAmount,
  isEditable = false,
}: HorizontalProjectCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isTokenBond = data.status === "completed";

  const handleQuickBuyToken = async () => {
    // Quick buy from Explore page
    if (!data.tokenAddress) {
      sendHapticAction("notification", "error");
      toast.error(t("shared.horizontalProjectCard.tokenAddressNotAvailable"));
      return;
    }

    try {
      navigate({ to: `/buy/${data.tokenAddress}?usdAmount=${quickBuyAmount}` });
    } catch (error: any) {
      sendHapticAction("notification", "error");
      toast.error(error.message);
    }
  };
  const totalAssetsUsd =
    parseFloat(data.readableBalance ?? "0") * parseFloat(data.currentPriceByUsd ?? "0");
  const totalAssets = numeral(totalAssetsUsd).format("$0,0.00");

  const renderIconGuarded = () => {
    if (!isShowGuarded) {
      return null;
    }

    if (data.guarded && isTokenBond) {
      return (
        <div className="p-1/2 z-9999 absolute -bottom-1 -right-1 flex h-[18px] w-[36px] items-center justify-center rounded-full border border-[#E6E8EC] bg-[#FFF] p-[2px]">
          <CheckBadgeIcon className="h-[14px] w-[14px] text-[#19BF58]" />

          <HumanIcon className="h-[14px] w-[14px] text-[#0064EF]" />
        </div>
      );
    }

    if (data.guarded) {
      return (
        <div className="p-1/2 z-9999 absolute -bottom-1 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#E6E8EC] bg-[#FFF] p-[2px]">
          <HumanIcon className="h-7 w-7 text-[#0064EF]" />
        </div>
      );
    }

    if (isTokenBond) {
      return (
        <CheckBadgeIcon className="absolute -bottom-1 -right-2 h-[19px] w-[19px] text-[#19BF58]" />
      );
    }
  };

  return (
    <div className="flex items-center gap-3 py-1">
      <div
        className="flex flex-1 items-center gap-3"
        onClick={() => navigate({ to: `/tokens/${data.tokenAddress}` })}
      >
        <div className="relative h-12 w-12 rounded-xl p-[1px] shadow-[0px_2.261px_6.783px_0px_rgba(0,0,0,0.12)]">
          <Image
            src={data.image}
            alt={data.name ?? ""}
            className="h-full w-full rounded-xl bg-white object-cover"
          />

          {isShowIndex && isNumber(index) && (
            <div className="absolute -bottom-4 -right-4">
              <OrderCircle index={index} />
            </div>
          )}

          {renderIconGuarded()}
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <p className="text-base font-semibold text-[#141416]">{data.name}</p>
            </div>

            {isHoldingMode && (
              <p className="text-sm font-medium text-[#777E90]">
                {numeral(data.readableBalance).format("0,0")} {data.symbol}
              </p>
            )}
          </div>

          {isShowTotalTokens && (
            <p className="text-sm font-medium text-[#777E90]">
              {isHoldingMode
                ? numeral(data.readableBalance).format("0.0,0.0000")
                : numeral(formatUnits(BigInt(data.totalSupply), 18)).format("0.0,0.0000")}{" "}
              {data.symbol}
            </p>
          )}
        </div>
        {isShowMarketCap && data.marketCap ? (
          <div className="text-end">
            <p className="text-xs font-medium text-[#777E90]">
              {t("shared.horizontalProjectCard.marketCap")}
            </p>

            <p className="text-base font-semibold leading-6 text-[#141416]">
              {numeral(data.marketCap).format("$0a")}
            </p>
          </div>
        ) : isShowMarketCapV2 ? (
          <div className="text-end">
            <p className="text-sm font-semibold leading-6 text-[#141416]">
              {numeral(data.marketCap).format("$0a")} M.Cap
            </p>
            <p
              className={cn(
                "text-xs font-semibold",
                Number(data.price24hChange) === 0
                  ? "text-[#777E90]"
                  : Number(data.price24hChange) > 0
                    ? "text-[#1FA645]"
                    : "text-[#FF5555]"
              )}
            >
              {Number(data.price24hChange) >= 0
                ? `+${Number(data.price24hChange).toFixed(2)}`
                : Number(data.price24hChange).toFixed(2)}
              %
            </p>
          </div>
        ) : (
          <div className="text-end">
            {isHoldingMode ? (
              totalAssetsUsd > 0.01 ? (
                <p className="text-base font-semibold text-[#141416]">
                  {totalAssets === "$NaN" ? "$0.00" : totalAssets}
                </p>
              ) : (
                <PriceTiny
                  price={toCurrency(totalAssetsUsd, { decimals: 6 })}
                  className="!text-lg font-semibold [&_.zero-count]:top-[6px] [&_.zero-count]:text-[12px]"
                />
              )
            ) : (
              <PriceTiny
                price={data.currentPriceByUsd}
                className="!text-lg font-semibold [&_.zero-count]:top-[6px] [&_.zero-count]:text-[12px]"
              />
            )}

            <p
              className={cn(
                "text-xs font-semibold",
                Number(data.price24hChange) >= 0 ? "text-[#1FA645]" : "text-[#FF5555]"
              )}
            >
              {Number(data.price24hChange) >= 0
                ? `+${Number(data.price24hChange).toFixed(2)}`
                : Number(data.price24hChange).toFixed(2)}
              %
            </p>
          </div>
        )}

        {isEditable && (
          <EditIcon
            className="ml-1 h-4 w-4"
            onClick={e => {
              e.stopPropagation();
              navigate({ to: `/tokens/edit/${data.tokenAddress}` });
              sendHapticAction();
            }}
          />
        )}
      </div>

      {isQuickBuy && (
        <Button className="h-8 w-max px-3 text-[13px]" onClick={handleQuickBuyToken}>
          <WhiteWorldCoinSmallIcon />
          {t("shared.horizontalProjectCard.buy")}
        </Button>
      )}
    </div>
  );
}
