import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { CreateTokenFormData } from "../../schema";
import TextareaAutosize from "react-textarea-autosize";
import ErrorIcon from "@/assets/icons/error-triangle.svg?react";
import { useTranslation } from "react-i18next";

export function TokenDescriptionInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateTokenFormData>();
  const { t } = useTranslation();
  return (
    <div className="">
      <Label className="mb-2 block text-[#141416]">{t("createToken.description")} </Label>
      <TextareaAutosize
        {...register("description")}
        placeholder={t("createToken.tellUsABitAboutYourProject")}
        maxRows={4}
        minRows={4}
        className="w-full rounded-[24px] border border-[#E6E8EC] p-4 text-sm focus:outline-none"
      />
      {errors.description && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
          <ErrorIcon className="color-[#FF3E56] h-[14px] w-[14px]" />
          {errors.description.message}
        </p>
      )}
    </div>
  );
}
