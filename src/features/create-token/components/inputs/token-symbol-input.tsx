import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { CreateTokenFormData } from "../../schema";
import ErrorIcon from "@/assets/icons/error-triangle.svg?react";
import { useTranslation } from "react-i18next";

export function TokenSymbolInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateTokenFormData>();
  const { t } = useTranslation();
  return (
    <div className="">
      <Label className="mb-2 block text-[#141416]">{t("createToken.tokenSymbol")}</Label>
      <input
        {...register("symbol")}
        type="text"
        placeholder={t("createToken.yourProjectSymbol")}
        maxLength={6}
        className="!placeholder:text-[#777E90] !placeholder:text-sm !placeholder:leading-5 !placeholder:tracking-[-0.56px] w-full rounded-full border border-[#E6E8EC] bg-transparent p-4 text-sm focus:outline-none"
        onChange={e => {
          e.target.value = e.target.value.toUpperCase();
          register("symbol").onChange(e);
        }}
      />
      {errors.symbol && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
          <ErrorIcon className="color-[#FF3E56] h-[14px] w-[14px]" />
          {errors.symbol.message}
        </p>
      )}
    </div>
  );
}
