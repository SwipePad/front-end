import { NoData } from "@/components/shared/no-data";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PriceTiny from "@/features/token-detail/components/format-price";
import { useQueryParamsPage } from "@/hooks/params/use-query-state-page";
import { getPaginationVisiblePages } from "@/lib/pagination";
import {
  StreamingEventName,
  onStreamingMessage,
  subscribeToChannel,
  unsubscribeToChannel,
} from "@/lib/socket";
import { cn } from "@/lib/utils";
import { TradeTransactionPaginationResponse, TradeTransactionResponse } from "@/services/models";
import {
  getTransactionControllerGetPaginationQueryKey,
  useTransactionControllerGetPagination,
} from "@/services/queries";
import copyToClipboard from "@/utils/copy-to-clipboard";
import { sendHapticAction } from "@/utils/miniapp";
import truncateAddress from "@/utils/truncate-address";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { get, take } from "es-toolkit/compat";
import { Copy, Loader2, SortAsc } from "lucide-react";
import moment from "moment";
import numeral from "numeral";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAddress } from "viem";

export function TxHistorySection() {
  const { t } = useTranslation();
  const { tokenId } = useParams({
    strict: false,
  });
  const { page, setPage, pageSize } = useQueryParamsPage();
  const queryClient = useQueryClient();
  const { data: transactionResponse, isLoading } = useTransactionControllerGetPagination(
    {
      page,
      pageSize,
      tokenAddress: getAddress(tokenId),
    },
    {
      query: {
        refetchInterval: 10000,
      },
    }
  );

  const totalItems = get(transactionResponse, "total", 1);
  const totalPages = Math.ceil(totalItems / pageSize);
  const visiblePages = getPaginationVisiblePages(page, totalPages);

  useEffect(() => {
    if (!tokenId) return;

    subscribeToChannel(StreamingEventName.SubscribeNewTradeTransaction, getAddress(tokenId));

    onStreamingMessage(
      StreamingEventName.SubscribeNewTradeTransaction,
      (transaction: TradeTransactionResponse) => {
        queryClient.setQueryData(
          getTransactionControllerGetPaginationQueryKey({
            page,
            pageSize,
            tokenAddress: getAddress(tokenId),
          }),
          (
            prev: TradeTransactionPaginationResponse | undefined
          ): TradeTransactionPaginationResponse => {
            if (!prev)
              return {
                data: [transaction],
                page: 1,
                pageSize: pageSize,
                total: 1,
              };

            const isExist = prev.data.find(item => item.hash === transaction.hash);

            if (page !== 1 || isExist) {
              return prev;
            }

            const updated = {
              ...prev,
              data: take([transaction, ...prev.data], pageSize),
              total: prev.total + 1,
            };

            return updated;
          }
        );
      }
    );

    return () => {
      unsubscribeToChannel(StreamingEventName.SubscribeNewTradeTransaction, getAddress(tokenId));
    };
  }, [tokenId, page, pageSize, queryClient]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  if (!transactionResponse?.data.length) {
    return (
      <NoData
        title={t("tokenDetail.noTransactionHistory")}
        description={t("tokenDetail.youCanBuyOrSellTokensToSeeYourTransactions")}
      />
    );
  }

  return transactionResponse?.data.length && !isLoading ? (
    <div className="space-y-4 px-4 pt-2">
      {/* <Input
        placeholder="Search tokens, contract, wallet..."
        rightSection={<Search className="size-4" />}
      /> */}
      <div className="min-h-[450px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[160px]">
                <div className="flex items-center justify-between gap-1">
                  {t("tokenDetail.time")} <SortAsc className="text-[#777E90]" />
                </div>
              </TableHead>
              <TableHead className="min-w-[100px]">{t("tokenDetail.type")}</TableHead>
              <TableHead className="min-w-[100px]">{t("tokenDetail.price")}</TableHead>
              <TableHead className="min-w-[100px]">{t("tokenDetail.volume")}</TableHead>
              <TableHead className="min-w-[100px]">{t("tokenDetail.hash")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactionResponse?.data.map((item, index) => (
              <TableRow key={index} className="h-fit">
                <TableCell>{moment(Number(item.timestamp) * 1000).fromNow()}</TableCell>
                <TableCell>
                  {item.type.includes("Buy") ? t("tokenDetail.buy") : t("tokenDetail.sell")}
                </TableCell>
                <TableCell>
                  <PriceTiny
                    price={item.priceAtTimeByUsd}
                    className="!text-sm font-normal [&_.zero-count]:top-[6px] [&_.zero-count]:text-[12px]"
                  />
                </TableCell>
                <TableCell>{numeral(item.volumeAtTime).format("0.00")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <a
                      href={`${import.meta.env.VITE_SCAN_URL}tx/${item.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-24 cursor-pointer text-blue-500 hover:underline"
                    >
                      {truncateAddress(item.hash)}
                    </a>

                    <Copy
                      className="size-4"
                      onClick={() => {
                        copyToClipboard(item.hash);
                        sendHapticAction("notification", "success");
                        toast.success(t("tokenDetail.copiedToClipboard"));
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="pb-10">
        <PaginationContent className="gap-[6px]">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className={cn(
                "rounded-[10px] border border-[#F4F5F6] p-[6px] text-[#23262F]",
                page === 1 && "bg-[#F4F5F6] text-[#C1C4CE]"
              )}
            />
          </PaginationItem>

          {visiblePages.map((visiblePage, index) => (
            <PaginationItem key={index}>
              {visiblePage === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => setPage(visiblePage)}
                  isActive={page === visiblePage}
                  className={cn(
                    "rounded-[10px] border border-[#F4F5F6] p-[6px] !text-[#23262F]",
                    page === visiblePage && "!bg-black !text-white before:rounded-none"
                  )}
                >
                  {visiblePage}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              className={cn(
                "rounded-[10px] border border-[#F4F5F6] p-[6px] text-[#23262F]",
                page === totalPages && "bg-[#F4F5F6] text-[#C1C4CE]"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ) : (
    <NoData
      title="No transaction history"
      description="You can buy or sell tokens to see your transactions"
    />
  );
}
