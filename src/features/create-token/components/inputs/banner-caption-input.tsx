import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { BannerFormData } from "../../schema";
import TextareaAutosize from "react-textarea-autosize";
import ErrorIcon from "@/assets/icons/error-triangle.svg?react";
import { useTranslation } from "react-i18next";

export function BannerCaptionInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BannerFormData>();
  const { t } = useTranslation();
  return (
    <div className="">
      <Label className="mb-2 block text-[#141416]">{t("createToken.caption")}</Label>
      <TextareaAutosize
        {...register("caption")}
        placeholder={t("createToken.yourCaption")}
        minRows={1}
        maxRows={3}
        className="w-full rounded-[24px] border border-[#E6E8EC] p-4 text-sm placeholder:text-sm placeholder:font-normal placeholder:leading-5 placeholder:tracking-[-0.56px] placeholder:text-[#777E90] focus:outline-none"
      />
      {errors.caption && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
          <ErrorIcon className="color-[#FF3E56] h-[14px] w-[14px]" />
          {errors.caption.message}
        </p>
      )}
    </div>
  );
}
