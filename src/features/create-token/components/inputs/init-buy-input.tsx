import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { CreateTokenFormData } from "@/features/create-token/schema";
import ErrorIcon from "@/assets/icons/error-triangle.svg?react";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import useOutsideClick from "@/hooks/utils/use-outside-click";
import { useTokenBalance } from "@/hooks/contracts/use-token-balance";
import { NATIVE_TOKEN_ADDRESS } from "@/constants/blockchain";
import { formatEther } from "viem";
import WalletIcon from "@/assets/icons/wallet1.svg?react";
import { truncateToDecimals } from "@/lib/number";

type InitBuyInputProps = {
  isShowCustomKeyboard: boolean;
  setIsShowCustomKeyboard: (isShowCustomKeyboard: boolean) => void;
};
export function InitBuyInput({ isShowCustomKeyboard, setIsShowCustomKeyboard }: InitBuyInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateTokenFormData>();
  const { t } = useTranslation();

  const keyboardRef = useRef<HTMLDivElement>(null);
  useOutsideClick(keyboardRef, () => setIsShowCustomKeyboard(false));

  const { data: nativeTokenBalance } = useTokenBalance(NATIVE_TOKEN_ADDRESS);

  return (
    <div className="">
      <div className="mb-2 flex items-center justify-between">
        <Label className="my-auto h-full text-[#434959]">
          {t("createToken.creatorBuy")}
          <span className="text-xs text-[#434959]">{` (${t("createToken.optional")})`}</span>
        </Label>

        <span className="flex items-center gap-1 text-xs font-medium text-[#777E90]">
          <WalletIcon className="h-4 w-4" />
          {t("buy.balance")}: {truncateToDecimals(formatEther(nativeTokenBalance ?? 0n), 2)} WLD
        </span>
      </div>
      <div className="relative w-full">
        <input
          {...register("initBuy")}
          type="text"
          placeholder={t("feed.amount")}
          className="!placeholder:text-[#777E90] !placeholder:text-sm !placeholder:font-inter !placeholder:leading-5 !placeholder:tracking-[-0.56px] w-full rounded-full border border-[#E6E8EC] bg-transparent p-4 pr-12 text-sm focus:outline-none"
          onClick={() => setIsShowCustomKeyboard(!isShowCustomKeyboard)}
          readOnly
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium">
          {"WLD"}
        </span>
      </div>
      {errors.initBuy && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
          <ErrorIcon className="color-[#FF3E56] h-[14px] w-[14px]" />
          {errors.initBuy.message}
        </p>
      )}
    </div>
  );
}
