import { Header } from "@/components/shared/header";
import { Separate } from "@/components/shared/separate";
import { toast } from "@/components/shared/toast";
import { useMemeBuySell } from "@/hooks/contracts/use-meme-buysell";
import { useMemeData } from "@/hooks/contracts/use-meme-data";
import { toCurrency } from "@/lib/number";
import { useMemeControllerFindDetail } from "@/services/queries";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { Loader2 } from "lucide-react";
import { formatEther } from "viem";
import { useSellContext } from "../sell/sell.context";
import { useState } from "react";
import { Image } from "@/components/ui/image";
import { useTranslation } from "react-i18next";
import { sendHapticAction } from "@/utils/miniapp";
import PriceTiny from "@/features/token-detail/components/format-price";
import useGetPrice from "@/hooks/contracts/use-get-price";

export function SellConfirmPage() {
  const { t } = useTranslation();
  const [state, setState] = useState<"pending" | "success" | "failed" | undefined>();
  const navigate = useNavigate();
  const { tokenId } = useParams({
    strict: false,
  });
  const { data } = useSellContext();

  const { convertWldToUsd, convertUsdToWld } = useGetPrice();

  const slippage = Number(data.slippage.replace("%", "").trim());
  const { data: memeDetail, isLoading, isFetching } = useMemeControllerFindDetail(tokenId);
  const isTokenOnDex = memeDetail?.status === "completed";

  const memeDecimal = memeDetail?.decimals;

  const { state: memeData } = useMemeData(
    tokenId,
    data?.amountToken ?? 0,
    false,
    slippage,
    isTokenOnDex
  );

  const { sell } = useMemeBuySell();

  const onConfirm = async () => {
    try {
      setState("pending");
      await sell({
        amountIn: data?.amountToken.toString(),
        decimalsTokenIn: Number(memeDetail?.decimals ?? 18),
        minimumOut: (Number(memeData!.amountOut) * (1 - slippage))
          .toFixed(Number(memeDecimal) ?? "18")
          .toString(),
        tokenAddress: tokenId,
        isOnDex: isTokenOnDex,
        slippage: (slippage / 100).toString(), // Convert percentage to decimal
        tokenSymbol: memeDetail?.symbol,
      });
      setState("success");
      navigate({ to: `/tokens/${tokenId}`, search: { fromTransaction: true } });
    } catch (error: any) {
      sendHapticAction("notification", "error");
      toast.error(error.message ?? t("sellConfirm.anErrorOccurredWhileConfirmingTheSell"));
      setState(undefined);
    }
  };

  if (isLoading || isFetching || !memeDetail || !memeData) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="rounded-t-2xl">
      <Header title={`${t("sellConfirm.selling")} ${memeDetail.name}`} />

      <div className="space-y-6 p-4">
        <div className="text-center">
          <Image
            src={memeDetail.image}
            alt={memeDetail.name}
            className="mx-auto mb-3 h-16 w-16 rounded-2xl object-cover"
          />
          <p className="text-2xl font-semibold text-[#141416]">
            {toCurrency(data?.amountToken, { decimals: 2 })} ${memeDetail.symbol}
          </p>
          <p className="flex justify-center text-sm font-medium text-[#141416]">
            <span className="text-[#777E90]">{t("sellConfirm.at")}</span>
            <PriceTiny
              price={memeDetail.currentPriceByUsd}
              className="ml-1 !text-sm font-normal [&_.zero-count]:top-[6px] [&_.zero-count]:text-[10px]"
            />
          </p>
        </div>

        <div className="space-y-2 rounded-2xl bg-[#F4F5F6] p-4">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[#777E90]">{t("sellConfirm.youPay")}</p>
            <div className="text-right">
              <p className="font-semibold text-[#141416]">
                {toCurrency(data?.amountToken, { decimals: 2 })} {memeDetail?.symbol}
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[#777E90]">{t("sellConfirm.slippage")}</p>
            <div className="text-right">
              <p className="font-semibold text-[#141416]">{data.slippage}</p>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[#777E90]">{t("sellConfirm.fee")}</p>
            <div className="text-right">
              <p className="font-semibold text-[#141416]">
                {toCurrency(formatEther(BigInt(memeData!.nativeFee)), {
                  decimals: 4,
                  suffix: ` WLD`,
                })}
              </p>
            </div>
          </div>

          <Separate className="pt-0" />

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#777E90]">{t("sellConfirm.youReceive")}</p>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 font-semibold text-[#141416]">
                {toCurrency(isTokenOnDex ? data.amount : convertWldToUsd(memeData!.amountOut), {
                  decimals: 4,
                  prefix: "$",
                })}{" "}
                (
                {toCurrency(isTokenOnDex ? convertUsdToWld(data.amount) : memeData!.amountOut, {
                  decimals: 4,
                  suffix: " WLD",
                })}
                )
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[100px] left-0 w-full space-y-2 p-4">
        <p className="text-center text-[10px] font-medium text-[#A3A8B5]">
          {t("sellConfirm.reviewTheAboveBeforeConfirming")}
          <br /> {t("sellConfirm.onceMadeYourTransactionIsIrreversible")}
        </p>
        <LiveFeedback
          className="w-full"
          label={{
            failed: "Failed",
            pending: "Pending",
            success: "Success",
          }}
          state={state}
        >
          <Button onClick={onConfirm} className="h-12 w-full rounded-full">
            {t("sellConfirm.confirm")}
          </Button>
        </LiveFeedback>
      </div>
    </section>
  );
}
