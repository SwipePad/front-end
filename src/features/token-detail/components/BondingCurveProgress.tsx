import { AnimatedProgress } from "@/features/create-token/components/step-1";
import useGetPrice from "@/hooks/contracts/use-get-price";
import { MemeDetailResponse, MemeDetailResponseStatus } from "@/services/models";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import { useTranslation } from "react-i18next";

export function BondingCurveProgress({ data }: { data?: MemeDetailResponse }) {
  const { t } = useTranslation();
  const tokenLiquid = BigNumber(data?.virtualTokenReserve ?? 0)
    .minus(data?.tokenOffset ?? 0)
    .div(10 ** 18)
    .toFixed(2);

  const quoteLiquid = BigNumber(data?.virtualQuoteReserve ?? 0)
    .minus(data?.quoteOffset ?? 0)
    .div(10 ** 18)
    .toFixed(2);

  const { convertWldToUsd } = useGetPrice();
  return (
    <div className="w-full space-y-2 rounded-2xl border border-[#E6E8EC] p-3">
      <div className="flex justify-between font-medium text-[#141416]">
        <p className="flex-1">{t("tokenDetail.bondingCurveProgress")}</p>
        {data?.status === "completed" && "🚀"}{" "}
        <p className="ml-1">{numeral(data?.listProgress).format("0.00")}%</p>
      </div>

      <div className="h-2 w-full">
        <div className="w-full">
          <AnimatedProgress
            target={Number(data?.listProgress)}
            duration={500}
            className="!relative !top-0 w-full"
          />
        </div>
      </div>

      {data?.status === MemeDetailResponseStatus.active && (
        <>
          <p className="text-sm text-[#777E90]">
            {t("tokenDetail.bondingCurveProgressDescription", {
              tokenLiquid: numeral(tokenLiquid).format("0,0.00"),
              quoteLiquid: quoteLiquid,
              symbol: data?.symbol,
            })}
          </p>

          <p className="text-sm text-[#777E90]">
            {t("tokenDetail.bondingCurveProgressDescription2", {
              maxRaisedNative: convertWldToUsd(1050 * 5).toFixed(0),
              symbol: data?.symbol,
            })}
          </p>
        </>
      )}
    </div>
  );
}
