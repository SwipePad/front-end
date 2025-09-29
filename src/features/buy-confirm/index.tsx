import { Header } from "@/components/shared/header";
import { Separate } from "@/components/shared/separate";
import { toast } from "@/components/shared/toast";
import { Image } from "@/components/ui/image";
import { useBuyContext } from "@/features/buy/buy.context";
import PriceTiny from "@/features/token-detail/components/format-price";
import useGetPrice from "@/hooks/contracts/use-get-price";
import { useMemeBuySell } from "@/hooks/contracts/use-meme-buysell";
import { useMemeData } from "@/hooks/contracts/use-meme-data";
import { toCurrency } from "@/lib/number";
import { CreateMemeSwapRequestResponse } from "@/services/models";
import {
  useMemeControllerCreateSwapHumanMode,
  useMemeControllerFindDetail,
} from "@/services/queries";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatEther, getAddress } from "viem";

export function BuyConfirmPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"pending" | "success" | "failed" | undefined>();
  const { tokenId } = useParams({
    strict: false,
  });
  const { data } = useBuyContext();
  const slippage = Number(data.slippage.replace("%", "").trim());
  const { data: memeDetail, isLoading, isFetching } = useMemeControllerFindDetail(tokenId);
  const { t } = useTranslation();

  const { convertWldToUsd } = useGetPrice();

  const memeDecimal = memeDetail?.decimals;
  const amount = Number(data.amount.replace("WLD", "").replace(/,/g, "").trim()).toFixed(
    Number(memeDecimal) ?? "18"
  );

  const { data: humanVerifiedData } = useMemeControllerCreateSwapHumanMode(
    {
      tokenAddress: getAddress(tokenId),
    },
    {
      query: {
        enabled: !!tokenId,
      },
    }
  );

  const { state: memeData } = useMemeData(
    tokenId,
    amount ?? 0,
    true,
    slippage,
    memeDetail?.status === "completed"
  );

  const isBuyExtractOutput = !!data.maxRemainingAmount;

  const { buy, buyExtractOutput } = useMemeBuySell();

  const onConfirm = async () => {
    try {
      setState("pending");

      isBuyExtractOutput
        ? await buyExtractOutput({
            tokenAddress: getAddress(tokenId),
            amountOut: data.maxRemainingAmount, // exact amount output
            maximumPay: (Number(amount) * (1 + slippage / 100)).toString(), // maximum amount input
            tokenOutDecimals: Number(memeDetail?.decimals ?? 18),
            isOnDex: memeDetail?.status === "completed",
            slippage: (slippage / 100).toString(), // Convert percentage to decimal
            isGuarded: memeDetail?.guarded || false,
            humanVerifiedData: humanVerifiedData as CreateMemeSwapRequestResponse,
            tokenSymbol: memeDetail?.symbol,
          })
        : await buy({
            amountIn: memeData!.actualAmountIn!.toString(),
            minimumOut: (Number(memeData?.amountOut) * (1 - slippage))
              .toFixed(Number(memeDecimal) ?? "18")
              .toString(),
            tokenAddress: tokenId,
            tokenOutDecimals: Number(memeDetail?.decimals ?? 18),
            isOnDex: memeDetail?.status === "completed",
            slippage: (slippage / 100).toString(), // Convert percentage to decimal
            isGuarded: memeDetail?.guarded || false,
            humanVerifiedData: humanVerifiedData as CreateMemeSwapRequestResponse,
            tokenSymbol: memeDetail?.symbol,
          });

      setState("success");
      navigate({ to: `/tokens/${tokenId}`, search: { fromTransaction: true } });
    } catch (error: any) {
      setState(undefined);
      toast.error(error.message ?? t("buyConfirm.anErrorOccurredWhileConfirmingTheBuy"));
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
      <Header title={`${t("buyConfirm.buying")} ${memeDetail.name}`} />

      <div className="space-y-6 p-4">
        <div className="text-center">
          <Image
            src={memeDetail.image}
            alt={memeDetail.name}
            className="mx-auto mb-3 h-16 w-16 rounded-2xl object-cover"
          />
          <p className="text-2xl font-semibold text-[#141416]">
            {toCurrency(memeData!.amountOut, { decimals: 2 })} {memeDetail.symbol}
          </p>
          <p className="flex justify-center text-sm font-medium text-[#777E90]">
            <span className="">{t("sellConfirm.at")}</span>
            <PriceTiny
              price={memeDetail.currentPriceByUsd}
              className="ml-1 !text-sm font-normal [&_.zero-count]:top-[6px] [&_.zero-count]:text-[10px]"
            />
          </p>
        </div>

        <div className="space-y-2 rounded-2xl bg-[#F4F5F6] p-4">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[#777E90]">{t("buyConfirm.youPay")}</p>
            <div className="text-right">
              {/* <p className="font-semibold text-[#141416]">{data.amount}</p> */}
              <p className="font-semibold text-[#141416]">
                {toCurrency(convertWldToUsd(data?.amount.replace("WLD", "")), {
                  decimals: 2,
                  prefix: "$",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[#777E90]">{t("buyConfirm.slippage")}</p>
            <div className="text-right">
              <p className="font-semibold text-[#141416]">{data.slippage}</p>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[#777E90]">{t("buyConfirm.fee")}</p>
            <div className="text-right">
              <p className="font-semibold text-[#141416]">
                {toCurrency(convertWldToUsd(formatEther(BigInt(memeData!.nativeFee))), {
                  decimals: 5,
                  prefix: "$",
                })}
              </p>
            </div>
          </div>

          <Separate className="pt-0" />

          {/* <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[#777E90]">Total</p>
            <div className="text-right">
              <p className="font-semibold text-[#141416]">$320</p>
            </div>
          </div> */}

          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[#777E90]">{t("buyConfirm.youReceive")}</p>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 font-semibold text-[#141416]">
                <Image
                  src={memeDetail.image}
                  alt={memeDetail.name}
                  className="h-4 w-4 rounded object-cover"
                />
                {toCurrency(memeData!.amountOut, { decimals: 5 })} {memeDetail.symbol}
              </p>
              {/* <p className="text-xs font-medium text-[#777E90]">~$450.65</p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[100px] left-0 w-full space-y-2 p-4">
        <p className="text-center text-[10px] font-medium text-[#A3A8B5]">
          {t("buyConfirm.reviewTheAboveBeforeConfirming")}
          <br /> {t("buyConfirm.onceMadeYourTransactionIsIrreversible")}
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
            {t("buyConfirm.confirm")}
          </Button>
        </LiveFeedback>
      </div>
    </section>
  );
}
