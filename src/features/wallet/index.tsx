import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoldingSection } from "@/features/wallet/components/HoldingSection";
import { MyProjectsSection } from "@/features/wallet/components/MyProjectsSection";
import { useQueryParamsTabs } from "@/hooks/params/use-query-state-tabs";
import { cn, handleDirectHoldstationWallet } from "@/lib/utils";
import { MemeResponse } from "@/services/models/memeResponse";
import { useMemeControllerQueryPagination } from "@/services/queries";
import { getTotalBalance } from "@/utils/get-total-balance";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Loader2 } from "lucide-react";
import numeral from "numeral";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { erc20Abi, formatEther, formatUnits, getAddress } from "viem";
import { toCurrency } from "@/lib/number";
import SortAscIcon from "@/assets/icons/sort_asc.svg?react";
import SortingHoldingModal from "@/features/wallet/components/sorting-holding-modal";
import { useTokenBalance } from "@/hooks/contracts/use-token-balance";
import { NATIVE_TOKEN_ADDRESS } from "@/constants/blockchain";
import { useReadContracts } from "wagmi";
import { Separate } from "@/components/shared/separate";
import useGetPrice from "@/hooks/contracts/use-get-price";

export default function WalletPage() {
  const navigate = useNavigate();
  const { tabs, setTabs } = useQueryParamsTabs();
  const { t } = useTranslation();
  const address = localStorage.getItem("address");
  const { data: nativeTokenBalance } = useTokenBalance(NATIVE_TOKEN_ADDRESS);
  const formattedNativeTokenBalance = formatEther(BigInt(nativeTokenBalance || 0));
  const { convertWldToUsd } = useGetPrice();

  const [isOpenSortingHoldingModal, setIsOpenSortingHoldingModal] = useState(false);

  const { data: memes, isLoading } = useMemeControllerQueryPagination(
    {
      page: 1,
      pageSize: 100,
      sortBy: "volume24hs",
      holder: getAddress(address ?? ""),
    },
    {
      query: {
        enabled: !!address,
        refetchInterval: 5000,
      },
    }
  );

  const { data: myProjects, isLoading: isMyProjectsLoading } = useMemeControllerQueryPagination({
    page: 1,
    pageSize: 100,
    sortBy: "volume24hs",
    creator: getAddress(address ?? ""),
  });

  const { data: tokenBalances, isLoading: isLoadingMultiBalance } = useReadContracts({
    contracts: memes?.data.map(token => ({
      address: getAddress(token.tokenAddress),
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [getAddress(address ?? "")],
    })),
    query: {
      enabled: !!memes,
    },
  });

  const balanceData = useMemo(() => {
    if (isLoadingMultiBalance) {
      return;
    }

    if (tokenBalances && memes) {
      const listBalance: Record<string, any> = {};
      memes?.data.forEach((token, index) => {
        listBalance[token.tokenAddress] = tokenBalances[index]["result"];
      });

      return listBalance;
    }
  }, [isLoadingMultiBalance, memes, tokenBalances]);

  const holdingMemeAmount = useMemo(() => {
    return memes?.data?.length ?? 0;
  }, [memes?.data]);

  const mappedBalanceMemes = useMemo(() => {
    if (!balanceData || !memes) return [];
    return Object.entries(balanceData)
      .map(([tokenAddress, balance]) => {
        const meme = memes?.data?.find(
          item => getAddress(item.tokenAddress) === getAddress(tokenAddress)
        );

        return {
          ...meme,
          rawBalance: balance,
          readableBalance: formatUnits(BigInt(balance), Number(meme?.decimals)),
        };
      })
      .filter(
        meme =>
          parseFloat(meme.readableBalance ?? "0") * parseFloat(meme.currentPriceByUsd ?? "0") >=
          0.0001
      );
  }, [balanceData, memes]);

  const totalBalance = useMemo(() => {
    return getTotalBalance(
      mappedBalanceMemes as (MemeResponse & {
        rawBalance?: string;
        readableBalance?: string;
      })[]
    );
  }, [mappedBalanceMemes]);

  if (isLoading || isLoadingMultiBalance) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  const totalBalanceChanged =
    Math.abs(totalBalance!.change24h) > 1000
      ? numeral(totalBalance.change24h).format("$0,0.0a")
      : toCurrency(totalBalance!.change24h, { decimals: 2, suffix: "$" });

  const totalPercentChanged = totalBalance.change24h / totalBalance.previousTotalBalance;
  const percentChanged =
    Math.abs(totalPercentChanged) > 100
      ? numeral(totalPercentChanged).format("0,0.0a") + "%"
      : toCurrency(totalPercentChanged, { decimals: 2, suffix: "%" });

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[148px]">
        <Image src="/images/wallet/bg1.png" alt="" className="h-full w-full" />
      </div>

      <div className="relative space-y-2 p-4">
        <div className="-mt-[85px] space-y-2 rounded-[20px] border-2 border-[#E6E8EC] bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-medium text-[#777E90]">{t("wallet.totalBalance")}</p>

                <Button
                  className="h-7 gap-1 !px-0 py-0 text-sm text-[#353945]"
                  onClick={() => navigate({ to: "/wallet/my-activity" })}
                >
                  <Clock className="h-[14px] w-[14px]" />
                  <p className="text-xs font-medium">{t("wallet.history")}</p>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-3xl font-semibold text-[#141416]">
                    {numeral(
                      totalBalance.currentTotalBalance +
                        convertWldToUsd(formattedNativeTokenBalance)
                    ).format("$0,0.00") === "$NaN"
                      ? "$0.00"
                      : numeral(
                          totalBalance.currentTotalBalance +
                            convertWldToUsd(formattedNativeTokenBalance)
                        ).format("$0,0.00")}
                  </p>

                  <div
                    className={cn(
                      "w-fit rounded-full px-0 text-xs font-semibold text-white",
                      totalBalance.change24h === 0
                        ? "text-[#777E90]"
                        : totalBalance.change24h > 0
                          ? "text-[#19BF58]"
                          : "text-[#FF0000]"
                    )}
                  >
                    {`${totalBalance.change24h > 0 ? "+" : ""}${["$NaN", "N$aN", "NaN"].includes(totalBalanceChanged) ? "$0.00" : totalBalanceChanged}`}{" "}
                    ~ {["NaN", "NaN%", "N%aN"].includes(percentChanged) ? "0.00%" : percentChanged}
                  </div>
                </div>

                <Button
                  className="h-[28px] w-[86px] bg-[#141416] px-2.5 py-1 text-xs text-[#FFF]"
                  onClick={() => handleDirectHoldstationWallet(true)}
                >
                  {t("wallet.addFund")}
                </Button>
              </div>
            </div>
          </div>

          <Separate />

          <div className="flex flex-col">
            {/* Token Balance */}
            <div className="!mt-3 flex items-center justify-between">
              <p className="text-[13px] font-medium text-[#777E90]">{t("wallet.tokenBalance")}</p>

              <p className="text-xs font-semibold text-[#141416]">
                {numeral(totalBalance.currentTotalBalance).format("$0,0.00")}
              </p>
            </div>

            {/* Wallet Balance */}
            <div className="!mt-3 flex items-center justify-between">
              <p className="text-[13px] font-medium text-[#777E90]">{t("wallet.walletBalance")}</p>

              <p className="text-xs font-semibold text-[#141416]">
                {numeral(convertWldToUsd(formattedNativeTokenBalance)).format("$0,0.00")} (
                {numeral(formattedNativeTokenBalance).format("0,0.00")} WLD)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Tabs defaultValue={tabs || "holding"} className="overflow-x-scroll">
          <div className="border-b border-[#E6E8EC] px-3" id="tabs">
            <TabsList variant="underline" className="w-full">
              <TabsTrigger
                value="holding"
                variant="underline"
                onClick={() => {
                  setTabs("holding");
                }}
              >
                {t(holdingMemeAmount > 1 ? "wallet.holdings" : "wallet.holding")} (
                {mappedBalanceMemes.length})
              </TabsTrigger>

              <TabsTrigger
                value="my-project"
                variant="underline"
                onClick={() => {
                  setTabs("my-project");
                }}
              >
                {t((myProjects?.total || 0) > 1 ? "wallet.myProjects" : "wallet.myProject")} (
                {myProjects?.total || 0})
              </TabsTrigger>

              <div className="ml-auto h-5 w-5">
                {tabs !== "my-project" && (
                  <SortAscIcon
                    className="text-[#000]"
                    onClick={() => setIsOpenSortingHoldingModal(true)}
                  />
                )}
              </div>
            </TabsList>
          </div>
          <TabsContent value="holding">
            <HoldingSection
              mappedBalanceMemes={
                mappedBalanceMemes as (MemeResponse & {
                  rawBalance?: string;
                  readableBalance?: string;
                })[]
              }
            />
          </TabsContent>
          <TabsContent value="my-project">
            <MyProjectsSection myProjects={myProjects} isLoading={isMyProjectsLoading} />
          </TabsContent>
        </Tabs>
      </div>

      <SortingHoldingModal
        isOpen={isOpenSortingHoldingModal}
        setOpen={setIsOpenSortingHoldingModal}
      />
    </section>
  );
}
