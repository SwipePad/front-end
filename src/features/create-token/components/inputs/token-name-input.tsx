import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { CreateTokenFormData } from "@/features/create-token/schema";
import ErrorIcon from "@/assets/icons/error-triangle.svg?react";
import { useTranslation } from "react-i18next";

export function TokenNameInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateTokenFormData>();
  const { t } = useTranslation();
  return (
    <div className="">
      <Label className="mb-2 block text-[#141416]">{t("createToken.projectName")}</Label>
      <input
        {...register("name")}
        type="text"
        placeholder={t("createToken.yourProjectName")}
        className="!placeholder:text-[#777E90] !placeholder:text-sm !placeholder:font-inter !placeholder:leading-5 !placeholder:tracking-[-0.56px] w-full rounded-full border border-[#E6E8EC] bg-transparent p-4 text-sm focus:outline-none"
      />
      {errors.name && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
          <ErrorIcon className="color-[#FF3E56] h-[14px] w-[14px]" />
          {errors.name.message}
        </p>
      )}
    </div>
  );
}
