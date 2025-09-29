import CardIcon from "@/assets/icons/card.svg?react";
import SettingIcon from "@/assets/icons/setting.svg?react";
import { Header } from "@/components/shared/header";
import { SlippageSettingBottomDraw } from "@/components/shared/SlippageSettingBottomDraw";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useBuyContext } from "@/features/buy/buy.context";
import { useBuyForm } from "@/features/buy/hooks/use-buy-form";
import { useTokenBalance } from "@/hooks/contracts/use-token-balance";
import { useAccount } from "@/hooks/mini-app/useAccount";
import { numberTransformer, toCurrency, truncateToDecimals, tryParseNumber } from "@/lib/number";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { formatEther, getAddress } from "viem";
import HumanIcon from "@/assets/icons/human.svg?react";
import InfoIconCircle from "@/assets/icons/info-circle.svg?react";
import { useQueryState } from "nuqs";
import { useMemeControllerFindDetail, useUserControllerFindOne } from "@/services/queries";
import { ZERO_ADDRESS } from "@/constants/common";
import { UserAndFollowStatusResponse } from "@/services/models";
import useGetBuyNonHuman from "@/hooks/contracts/use-get-buy-nonhuman";
import AlertVerifyHumanBottomDraw from "@/features/feed/components/AlertVerifyHumanModal";
import numeral from "numeral";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CustomKeyboard from "@/features/buy/CustomKeyboard";
import useOutsideClick from "@/hooks/utils/use-outside-click";
import { useTranslation } from "react-i18next";
import BigNumber from "bignumber.js";
import useQuoteAmountIn from "@/hooks/contracts/use-quote-amount-in";
import useGetPrice from "@/hooks/contracts/use-get-price";
import { sendHapticAction } from "@/utils/miniapp";

export function BuyTokenIdPage() {
  const { t } = useTranslation();
  const { data: buyContextData, saveData } = useBuyContext();
  const navigate = useNavigate();
  const { nativeToken } = useAccount();
  const { data: tokenBalance } = useTokenBalance(nativeToken);
  const address = localStorage.getItem("address");
  const [isOpenAlertVerifyHuman, setIsOpenAlertVerifyHuman] = useState(false);
  const [isOpenHumanFirstTooltip, setIsOpenHumanFirstTooltip] = useState(false);
  const [isBuyMaxNonHuman, setIsBuyMaxNonHuman] = useState(false);
  const [isFirstInputKeyboard, setIsFirstInputKeyboard] = useState(true);

  const keyboardRef = useRef<HTMLDivElement>(null);
  useOutsideClick(keyboardRef, () => setShowKeyboard(false));

  const { data: userData } = useUserControllerFindOne(getAddress(address || ZERO_ADDRESS), {
    query: {
      refetchOnMount: true,
      enabled: !!address,
    },
  });

  const { wldPrice, convertWldToUsd } = useGetPrice();

  const isUserVerified = !!(userData as any as UserAndFollowStatusResponse[])?.[0]?.nullifierHash;

  const [usdAmount, _] = useQueryState("usdAmount");

  const { form } = useBuyForm({
    defaultValues: {
      // currentBalance: `${tokenBalance?.toString()} WLD`,
      ...buyContextData,
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const { tokenId } = useParams({
    strict: false,
  });

  const { data: memeDetail } = useMemeControllerFindDetail(tokenId);
  const isTokenOnDex = memeDetail?.status === "completed";

  const tokenLiquidOnCurve = Math.ceil(
    BigNumber(memeDetail?.virtualTokenReserve ?? 0)
      .minus(memeDetail?.tokenOffset ?? 0)
      .div(10 ** 18)
      .toNumber()
  );

  const { quoteWldAmountIn } = useQuoteAmountIn({
    tokenId: memeDetail?.tokenAddress || "",
    amountOut: tokenLiquidOnCurve,
    isOnDex: isTokenOnDex,
  });

  const { listNonHumanSelectedQuickBuy, nonHumanMaxWldCanBuy, humanVerifiedData } =
    useGetBuyNonHuman({
      tokenId,
      isGuarded: memeDetail?.guarded || false,
      isUserVerified,
    });

  const totalWldBuy =
    Number(form.watch("usdAmount").replace("$", "").replace(/,/g, "")) / (wldPrice || 0.0000001);

  const handleMaxNonHumanBuy = (option: { label: string; value: string }) => {
    if (!option.value) return;

    if (option.label === "MAX") {
      const tokenBalanceFormat = Number(formatEther(tokenBalance || 0n));

      // Set MAX is nonHumanMaxWldCanBuy if it is less than token balance
      if (Number(nonHumanMaxWldCanBuy) < tokenBalanceFormat) {
        setIsBuyMaxNonHuman(true);
        form.setValue("amount", `${numberTransformer(Number(nonHumanMaxWldCanBuy), 4)}WLD`);
        form.setValue(
          "usdAmount",
          `${numberTransformer(Number(nonHumanMaxWldCanBuy) * (wldPrice || 0), 4)}$`
        );
      } else {
        setIsBuyMaxNonHuman(false);
        form.setValue("amount", `${numberTransformer(Number(tokenBalanceFormat), 4)}WLD`);
        form.setValue(
          "usdAmount",
          `${numberTransformer(Number(tokenBalanceFormat) * (wldPrice || 0), 4)}$`
        );
      }
    } else {
      setIsBuyMaxNonHuman(false);
      form.setValue("amount", `${numberTransformer(tryParseNumber(option.value), 4)}WLD`);
      form.setValue(
        "usdAmount",
        `${numberTransformer(tryParseNumber(option.value) * (wldPrice || 0), 4)}$`
      );
    }
  };

  const getWldAmount = useCallback(
    (usdAmount: number) => {
      if (wldPrice) {
        return usdAmount / wldPrice;
      }
      return 0;
    },
    [wldPrice]
  );

  useEffect(() => {
    // Set default amount buy is max non verify human can buy
    if (Number(usdAmount) > 0 && wldPrice) {
      setIsBuyMaxNonHuman(false);
      form.setValue("usdAmount", `${numberTransformer(Number(usdAmount), 8)}$`);
      form.setValue("amount", `${numberTransformer(getWldAmount(Number(usdAmount)), 8)}WLD`);
    }
  }, [usdAmount, memeDetail?.guarded, isUserVerified, listNonHumanSelectedQuickBuy, wldPrice]);

  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleKeyPress = (key: string) => {
    setIsBuyMaxNonHuman(false);

    if (key === "←") {
      isFirstInputKeyboard && setIsFirstInputKeyboard(false);
      const currentValue = form.getValues("usdAmount").replace("$", "").replace(/,/g, "");

      if (currentValue.length > 0) {
        form.setValue("usdAmount", currentValue.slice(0, -1));
        form.setValue("amount", getWldAmount(Number(currentValue.slice(0, -1))).toFixed(4) + "WLD");
      }
    } else {
      const currentValue = form.getValues("usdAmount");

      if (isFirstInputKeyboard && key !== "." && currentValue === "0$") {
        form.setValue("usdAmount", key + "$");
        form.setValue("amount", getWldAmount(Number(key)).toFixed(4) + "WLD");
        isFirstInputKeyboard && setIsFirstInputKeyboard(false);

        return;
      }

      form.setValue("usdAmount", currentValue.replace("$", "") + key + "$");
      form.setValue("amount", getWldAmount(Number(currentValue.replace("$", "") + key)) + "WLD");
      isFirstInputKeyboard && setIsFirstInputKeyboard(false);
    }
  };

  // Suggest amount buttons
  const presetAmounts = [5, 10, 20];

  const handleAmountClick = (amount: number | "MAX") => {
    if (amount === "MAX") {
      const userTokenBalance = formatEther(tokenBalance ?? BigInt(0)).toString();

      if (!isTokenOnDex && Number(userTokenBalance) > Number(quoteWldAmountIn)) {
        form.setValue("amount", `${Math.ceil(Number(quoteWldAmountIn))}WLD`);
        form.setValue("usdAmount", (Number(quoteWldAmountIn) * (wldPrice || 0)).toFixed(4) + "$");
        return;
      }

      form.setValue("amount", `${truncateToDecimals(userTokenBalance)}WLD`);
      form.setValue("usdAmount", (Number(userTokenBalance) * (wldPrice || 0)).toFixed(4) + "$");
    } else {
      form.setValue("amount", `${amount}WLD`);
      form.setValue("usdAmount", (amount * (wldPrice || 0)).toFixed(4) + "$");
    }
  };

  return (
    <section className="rounded-t-2xl">
      <AlertVerifyHumanBottomDraw
        open={isOpenAlertVerifyHuman}
        setOpen={setIsOpenAlertVerifyHuman}
        memeDetail={memeDetail}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(data => {
            const amount = Number(data.amount.replace("WLD", "").replace(/,/g, "")).toFixed(18);
            const amountNumber = Number(amount);

            if (amountNumber < 0.0001) {
              form.setError("usdAmount", {
                type: "manual",
                message: t("buy.amountMustBeGreaterThan0"),
              });
              return;
            }
            if (amountNumber > Number(formatEther(tokenBalance ?? BigInt(0)))) {
              form.setError("usdAmount", {
                type: "manual",
                message: t("buy.insufficientBalance"),
              });
              return;
            }
            if (
              memeDetail?.status !== "completed" &&
              memeDetail?.guarded &&
              !isUserVerified &&
              Number(nonHumanMaxWldCanBuy) >= 0 &&
              amountNumber > Number(nonHumanMaxWldCanBuy)
            ) {
              setIsOpenAlertVerifyHuman(true);
              return;
            }

            sendHapticAction();
            if (!isTokenOnDex && amountNumber > Number(quoteWldAmountIn)) {
              saveData({
                amount: `${Math.ceil(Number(quoteWldAmountIn))}WLD`,
                slippage: data.slippage,
                maxRemainingAmount: "",
                usdAmount: (Number(quoteWldAmountIn) * (wldPrice || 0)).toFixed(4) + "$",
              });
            } else {
              saveData({
                amount: isBuyMaxNonHuman ? nonHumanMaxWldCanBuy : data.amount,
                slippage: data.slippage,
                maxRemainingAmount: isBuyMaxNonHuman
                  ? String(humanVerifiedData?.remainingTokenAmountAllocation) || "0"
                  : "",
                usdAmount: data.usdAmount,
              });
            }

            navigate({
              to: "confirm",
            });
          })}
          id="buy-form"
        >
          <SlippageSettingBottomDraw open={isOpen} setOpen={setIsOpen} form={form} />
          <Header
            title={t("buy.buy")}
            rightSection={<SettingIcon className="size-5" onClick={() => setIsOpen(true)} />}
          />
          <div className="m-4 mx-auto flex w-fit items-center justify-between gap-1 rounded-full bg-[#F4F5F6] px-[10px] py-[4px]">
            <CardIcon className="size-5" />
            <p className="text-xs font-medium leading-5 text-[#141416]">
              <span className="text-[#A3A8B5]">{t("buy.balance")}:</span>{" "}
              {toCurrency(convertWldToUsd(formatEther(tokenBalance ?? BigInt(0))), { decimals: 4 })}
              $
            </p>
          </div>

          {memeDetail?.guarded && (
            <div className="mx-auto flex items-center justify-center gap-1 text-[#0064EF]">
              <HumanIcon className="h-[14px] w-[14px]" />
              <p className="text-xs font-semibold">{t("buy.humanFirstToken")}</p>
              <TooltipProvider>
                <Tooltip open={isOpenHumanFirstTooltip} onOpenChange={setIsOpenHumanFirstTooltip}>
                  <TooltipTrigger asChild>
                    <InfoIconCircle
                      className="h-[14px] w-[14px]"
                      onClick={() => setIsOpenHumanFirstTooltip(prev => !prev)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="z-99999 relative rounded-xl bg-white p-0">
                    <p className="z-999 relative rounded-xl border px-3 py-2 text-xs font-medium text-[#141416]">
                      {t("buy.priorityForHumans")}
                      <br /> {t("buy.nonVerifiedUsersCappedAt01Supply")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="flex min-h-[216px] items-center justify-center p-4 text-center">
            <FormField
              control={form.control}
              name="usdAmount"
              render={({ field }) => (
                <FormItem className="h-fit w-[-webkit-fill-available]">
                  <FormControl>
                    <NumericFormat
                      {...field}
                      className="w-[-webkit-fill-available] rounded-full border-none bg-transparent px-3 text-center text-5xl font-medium text-[#141416] placeholder:text-5xl placeholder:font-medium"
                      thousandSeparator=","
                      decimalSeparator="."
                      suffix="$"
                      readOnly
                      onClick={() => setShowKeyboard(prev => !prev)}
                    />
                  </FormControl>
                  <FormDescription className="text-sm font-medium text-[#A3A8B5]">
                    ~
                    {totalWldBuy > 0 && totalWldBuy
                      ? numeral(totalWldBuy).format("0,0.00") !== "NaN"
                        ? numeral(totalWldBuy).format("0,0.00") + "WLD"
                        : "0WLD"
                      : "0WLD"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="fixed bottom-[90px] left-0 w-full space-y-2 p-4">
            {memeDetail?.status !== "completed" && memeDetail?.guarded && !isUserVerified && (
              <div className="mx-auto w-max rounded-2xl bg-[#F4F5F6] px-2.5 py-2 text-xs font-medium text-[#777E90]">
                {t("buy.maxBuy")}: {Number(nonHumanMaxWldCanBuy).toFixed(4)} WLD
              </div>
            )}

            {memeDetail?.status !== "completed" && !isUserVerified && memeDetail?.guarded ? (
              <div className="flex items-center justify-center gap-3 pt-2">
                {listNonHumanSelectedQuickBuy &&
                  listNonHumanSelectedQuickBuy?.length > 0 &&
                  listNonHumanSelectedQuickBuy?.map(option => (
                    <Button
                      key={option.value}
                      variant="pillOutline"
                      className="py-5"
                      onClick={() => {
                        handleMaxNonHumanBuy(option);
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 pt-2">
                {presetAmounts.map(amt => (
                  <Button
                    key={amt}
                    variant="pillOutline"
                    className="py-5"
                    onClick={() => handleAmountClick(amt)}
                  >
                    {amt} WLD
                  </Button>
                ))}

                <Button
                  variant="pillOutline"
                  className="py-5"
                  onClick={() => handleAmountClick("MAX")}
                >
                  MAX
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                id="buy-form"
                className="flex-1 rounded-xl bg-[#19BF58] text-white"
              >
                Buy
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {showKeyboard && (
        <div ref={keyboardRef}>
          <CustomKeyboard onKeyPress={handleKeyPress} className="bottom-[150px]" />
        </div>
      )}
    </section>
  );
}
