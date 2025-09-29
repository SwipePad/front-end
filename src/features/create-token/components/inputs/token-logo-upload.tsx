import { useFormContext } from "react-hook-form";
import { useState } from "react";
import type { BannerFormData } from "../../schema";
import { useFileUploadControllerUploadSingle } from "@/services/queries";
import { toast } from "@/components/shared/toast";
import { get } from "es-toolkit/compat";
import { formatImageUrl } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import { useUser } from "@/components/providers/user-provider";
import UploadImageIcon from "@/assets/icons/upload-image.svg?react";
import ErrorIcon from "@/assets/icons/error-triangle.svg?react";
import { useTranslation } from "react-i18next";

export function TokenLogoUpload() {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useUser();
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useFormContext<BannerFormData>();
  const uploadMutation = useFileUploadControllerUploadSingle({
    request: {
      headers: {
        "x-jwt": token,
      },
    },
  });

  const preview = watch("logoPreview");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("createToken.fileSizeExceeds2MBLimit"));
      return;
    }

    try {
      setIsUploading(true);

      // Create blob for upload
      const blob = new Blob([file], { type: file.type });

      // Upload file
      const response = await uploadMutation.mutateAsync({
        data: {
          file: blob,
        },
      });

      // Set the uploaded file URL in the form
      const fileUrl = get(response, ["fileName"], "");
      const formattedUrl = formatImageUrl(fileUrl);
      setValue("logo", formattedUrl);
      // remove error
      clearErrors("logo");
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("logoPreview", reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error(t("createToken.failedToUploadLogo"), t("createToken.pleaseTryAgain"));
      console.error("Logo upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-[100px] w-[100px] items-center justify-center">
      <div className="relative mt-3 flex flex-col items-center">
        <label
          className={`block h-[100px] w-[100px] cursor-pointer rounded-3xl border border-[#E6E8EC] bg-[#F4F5F6] ${isUploading ? "opacity-50" : ""}`}
        >
          <input
            {...register("logo")}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/gif"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          <div className="flex h-full flex-col items-center justify-center">
            {preview ? (
              <div className="relative h-full w-full">
                <div className="absolute left-1 top-1 flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#FFF]">
                  <UploadImageIcon className="h-4 w-4 text-[#141416]" />
                </div>
                <Image
                  src={preview}
                  alt="Preview"
                  className="h-full w-full rounded-3xl object-cover"
                />
              </div>
            ) : (
              <div className="h-full w-full px-2 py-1">
                <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#FFF]">
                  <UploadImageIcon className="h-4 w-4 text-[#141416]" />
                </div>

                <p className="mt-1 text-[13px] font-semibold text-[#000]">
                  {" "}
                  {t("toaster.form.tokenLogo")}
                </p>
                <p className="mt-1 text-[10px] font-medium text-[#777E90]">
                  {t("toaster.form.recommendLogoSize")}
                </p>
              </div>
            )}
          </div>
        </label>

        {errors.logo && (
          <p className="absolute left-1 top-[110%] mt-1 flex min-w-[300px] -translate-y-1/2 items-center gap-1 rounded-md bg-white p-1 text-xs text-red-500">
            <ErrorIcon className="color-[#FF3E56] h-[14px] w-[14px]" />
            {errors.logo.message?.toString() === "Expected string, received object"
              ? t("toaster.form.tokenLogoIsRequired")
              : errors.logo.message?.toString()}
          </p>
        )}
      </div>
    </div>
  );
}
