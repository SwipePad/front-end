import { Header } from "@/components/shared/header";
import { HorizontalBaseCard } from "@/components/shared/horizontal-base-card";
import { NoData } from "@/components/shared/no-data";
import { Separate } from "@/components/shared/separate";
import { Image } from "@/components/ui/image";
import { useQueryParamsPage } from "@/hooks/params/use-query-state-page";
import { TradeTransactionResponse } from "@/services/models";
import { useTransactionControllerGetUserActivity } from "@/services/queries";
import moment from "moment";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatUnits } from "viem";

export default function MyActivityPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { pageSize } = useQueryParamsPage(page, 20);
  const [allTransactions, setAllTransactions] = useState<TradeTransactionResponse[]>([]);

  const Type: Record<string, { label: string; value: string }> = {
    Dex_Buy: { label: t("myActivity.buy"), value: "Dex_Buy" },
    Dex_Sell: { label: t("myActivity.sell"), value: "Dex_Sell" },
    Buy: { label: t("myActivity.buy"), value: "Buy" },
    Sell: { label: t("myActivity.sell"), value: "Sell" },
  };

  const { data: activityData, isFetching } = useTransactionControllerGetUserActivity({
    page,
    pageSize,
  });

  useEffect(() => {
    if (activityData?.data?.length) {
      setAllTransactions(prev => [...prev, ...activityData.data]);
    }
  }, [activityData]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (nearBottom && !isFetching && activityData?.data?.length === pageSize) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, activityData]);

  const checkNanAmount = (amount: string) => {
    if (amount === "NaN") {
      return "0.0000";
    }

    return amount;
  };

  return (
    <section className="overflow-hidden rounded-t-2xl">
      <Header title={t("myActivity.title")} />

      {allTransactions.length > 0 ? (
        <div className="px-4 py-2">
          {allTransactions
            .filter(transaction => transaction?.memeInfo)
            .map((item, index) => (
              <div key={index} className="py-1">
                <HorizontalBaseCard
                  leftSection={
                    <Image
                      src={item?.memeInfo.image}
                      alt={item?.memeInfo.name}
                      className="size-12 rounded-xl object-cover"
                    />
                  }
                  centerSection={
                    <div className="space-y-1">
                      <p className="font-semibold capitalize">{Type[item?.type]?.label}</p>
                      <p className="text-xs font-medium text-[#777E90]">
                        {moment(item.timestamp * 1000).format("HH:mm:ss DD/MM/YYYY")}
                      </p>
                    </div>
                  }
                  rightSection={
                    <div className="space-y-1 text-end">
                      <p className="font-semibold">
                        {[Type.Buy.value, Type.Dex_Buy.value].includes(item.type)
                          ? `+${checkNanAmount(numeral(formatUnits(BigInt(item.tokenAmount), Number(item.memeInfo.decimals) || 18)).format("0,0.0000"))} ${item.memeInfo.symbol}`
                          : `-${checkNanAmount(numeral(formatUnits(BigInt(item.tokenAmount), Number(item.memeInfo.decimals) || 18)).format("0,0.0000"))} ${item.memeInfo.symbol}`}
                      </p>
                      <p className="ml-auto w-fit rounded-full bg-[#E9FAEE] px-2 py-[2px] text-xs font-medium text-[#1FA645]">
                        {t("myActivity.completed")}
                      </p>
                    </div>
                  }
                />
                {index !== allTransactions.length - 1 && <Separate />}
              </div>
            ))}
        </div>
      ) : (
        <NoData
          title={t("myActivity.noTransactions")}
          description={t("myActivity.noTransactionsDescription")}
        />
      )}
    </section>
  );
}
