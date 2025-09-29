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
import { Image } from "@/components/ui/image";
import CustomKeyboard from "@/features/buy/CustomKeyboard";
import { useSellForm } from "@/features/sell/hooks/use-sell-form";
import { useSellContext } from "@/features/sell/sell.context";
import useGetPrice from "@/hooks/contracts/use-get-price";
import { useMemeData } from "@/hooks/contracts/use-meme-data";
import useQuoteAmountInOnDex from "@/hooks/contracts/use-quote-amount-in-dex";
import { useTokenBalance } from "@/hooks/contracts/use-token-balance";
import useOutsideClick from "@/hooks/utils/use-outside-click";
import { toCurrency, truncateToDecimals } from "@/lib/number";
import { useMemeControllerFindDetail } from "@/services/queries";
import { sendHapticAction } from "@/utils/miniapp";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { formatEther } from "viem";

export function SellTokenIdPage() {
  const { t } = useTranslation();
  const { tokenId } = useParams({
    strict: false,
  });
  const { data: sellContextData, saveData } = useSellContext();
  const navigate = useNavigate();
  const { data: memeDetail } = useMemeControllerFindDetail(tokenId);
  const isTokenOnDex = memeDetail?.status === "completed";

  const { data: tokenBalance } = useTokenBalance(memeDetail?.tokenAddress);
  const [isSellMax, setIsSellMax] = useState(sellContextData.isSellMax);

  const { form } = useSellForm({
    defaultValues: {
      ...sellContextData,
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isFirstInputKeyboard, setIsFirstInputKeyboard] = useState(true);
  const keyboardRef = useRef<HTMLDivElement>(null);
  useOutsideClick(keyboardRef, () => setShowKeyboard(false));

  const { convertWldToUsd, convertUsdToWld } = useGetPrice(5000);

  const handleKeyPress = (key: string) => {
    if (key === "←") {
      isFirstInputKeyboard && setIsFirstInputKeyboard(false);

      const currentValue = form.getValues("amount").replace("WLD", "");

      if (currentValue.length > 0) {
        setIsSellMax(false);
        const newValue = currentValue.slice(0, -1);
        compareInputAmountWithTotalAsset(newValue);

        form.setValue("amount", currentValue.slice(0, -1));
      }
    } else {
      if (isFirstInputKeyboard && key !== ".") {
        form.setValue("amount", key);
        setIsFirstInputKeyboard(false);
        setIsSellMax(false);
        return;
      }

      const currentValue = form.getValues("amount");
      const newValue = currentValue + key;
      form.setValue("amount", newValue);
      setIsSellMax(false);
      compareInputAmountWithTotalAsset(newValue);
      setIsFirstInputKeyboard(false);
    }
  };

  const handleSetAmountByPercent = (percent: number) => {
    if (isNaN(totalAssetsByUsd)) {
      return;
    }
    const decimalNumber = totalAssetsByUsd > 1 ? 2 : 6;

    if (percent === 100) {
      setIsSellMax(true);
      form.setValue("amount", truncateToDecimals(totalAssetsByUsd, decimalNumber).toString());

      return;
    } else {
      setIsSellMax(false);
    }

    const usdAmount = (totalAssetsByUsd * percent) / 100;
    form.setValue("amount", truncateToDecimals(usdAmount, decimalNumber).toString());
  };

  const { quoteWldAmountIn: quoteTokenAmountIn, isLoadingQuoteOnDex } = useQuoteAmountInOnDex({
    tokenId: tokenId || "",
    amountOut: Number(
      convertUsdToWld(Number(form.watch("amount").replace("$", "").replace(/,/g, "")))
    ),
    isBuy: false,
    isOnDex: isTokenOnDex,
    pairAddress: memeDetail?.pairAddress,
  });

  const { state: totalMemeData } = useMemeData(
    tokenId,
    formatEther(tokenBalance ?? BigInt(0)),
    false,
    Number(form.watch("slippage").replace("%", "").trim()),
    isTokenOnDex
  );

  const totalAssetsByUsd = convertWldToUsd(Number(totalMemeData?.amountOut) || 0);
  const percentages = [5, 10, 20, 100];

  const amount = Number(form.watch("amount").replace("$", "").replace(/,/g, ""));

  const compareInputAmountWithTotalAsset = (amount: string) => {
    const parseTotalAmount = truncateToDecimals(totalAssetsByUsd, 2);
    if (parseTotalAmount === Number(amount)) {
      setIsSellMax(true);
    } else {
      setIsSellMax(false);
    }
  };

  const handleDisabled = () => {
    if (isSellMax) {
      return false;
    }
    return !totalMemeData || amount <= 0 || isLoadingQuoteOnDex;
  };

  return (
    <section className="rounded-t-2xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(data => {
            const amount = Number(data.amount.replace("$", "").replace(/,/g, ""));

            if (amount < 0.0001) {
              form.setError("amount", {
                type: "manual",
                message: t("sell.amountMustBeGreaterThan0"),
              });
              return;
            }

            if (
              !isSellMax &&
              (Number(amount) > totalAssetsByUsd ||
                Number(quoteTokenAmountIn) > Number(formatEther(tokenBalance || BigInt(0))))
            ) {
              form.setError("amount", {
                type: "manual",
                message: t("sell.insufficientBalance"),
              });
              return;
            }
            sendHapticAction();

            saveData({
              amount: data.amount,
              amountToken: isSellMax ? formatEther(tokenBalance || BigInt(0)) : quoteTokenAmountIn,
              slippage: data.slippage,
              isSellMax: isSellMax,
            });

            navigate({
              to: "confirm",
            });
          })}
          id="sell-form"
        >
          <SlippageSettingBottomDraw open={isOpen} setOpen={setIsOpen} form={form} />
          <Header
            title={`${t("sell.sell")} ${memeDetail?.symbol}`}
            rightSection={<SettingIcon className="size-5" onClick={() => setIsOpen(true)} />}
          />
          <div className="m-4 mx-auto flex w-fit items-center justify-between gap-1 rounded-full bg-[#F4F5F6] px-[10px] py-[4px]">
            <Image
              src={memeDetail?.image}
              alt={memeDetail?.symbol}
              className="size-5 rounded-full"
            />

            <p className="text-xs font-medium leading-5 text-[#141416]">
              <span className="text-[#A3A8B5]">{t("sell.balance")}:</span> $
              {truncateToDecimals(totalAssetsByUsd, 2)}
            </p>
          </div>

          <div className="flex min-h-[216px] items-center justify-center p-4 text-center">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="h-fit w-[-webkit-fill-available]">
                  <FormControl>
                    <NumericFormat
                      {...field}
                      className="w-[-webkit-fill-available] rounded-full border-none bg-transparent px-3 text-center text-5xl font-medium text-[#141416] placeholder:text-5xl placeholder:font-medium"
                      thousandSeparator=","
                      decimalSeparator="."
                      prefix={"$"}
                      readOnly
                      onClick={() => setShowKeyboard(prev => !prev)}
                    />
                  </FormControl>
                  <FormDescription className="text-sm font-medium text-[rgb(163,168,181)]">
                    ~
                    {isSellMax
                      ? toCurrency(formatEther(tokenBalance || BigInt(0)), { decimals: 0 })
                      : toCurrency(quoteTokenAmountIn, { decimals: 0 })}{" "}
                    {memeDetail?.symbol}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="fixed bottom-[90px] left-0 w-full space-y-2 p-4">
            <div className="flex items-center justify-center gap-3 pt-2">
              {percentages.map(percent => (
                <Button
                  key={percent}
                  variant="pillOutline"
                  className="py-5"
                  onClick={() => handleSetAmountByPercent(percent)}
                  disabled={!totalMemeData}
                >
                  {percent === 100 ? t("sell.max") : `${percent} %`}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                id="sell-form"
                className="flex-1 rounded-xl bg-[#FF5858] text-white"
                disabled={handleDisabled()}
              >
                {t("sell.sell")}
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
