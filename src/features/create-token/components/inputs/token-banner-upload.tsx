import { useFormContext } from "react-hook-form";
import { useState } from "react";
import type { BannerFormData } from "../../schema";
import { useFileUploadControllerUploadSingle } from "@/services/queries";
import { toast } from "@/components/shared/toast";
import { get } from "es-toolkit/compat";
import { formatImageUrl } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import { useUser } from "@/components/providers/user-provider";
import { UploadImageIcon } from "@/components/shared/icons";
import ErrorIcon from "@/assets/icons/error-triangle.svg?react";
import { useTranslation } from "react-i18next";
import { sendHapticAction } from "@/utils/miniapp";

export function TokenBannerUpload() {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useUser();
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useFormContext<BannerFormData>();
  const uploadMutation = useFileUploadControllerUploadSingle({
    request: {
      headers: {
        "x-jwt": token,
      },
    },
  });

  const preview = watch("bannerPreview");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("banner", { message: t("createToken.fileSizeExceeds2MBLimit") });
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
      setValue("banner", formattedUrl);
      // remove error
      clearErrors("banner");
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("bannerPreview", reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      sendHapticAction("notification", "error");
      toast.error(t("createToken.failedToUploadLogo"), t("createToken.pleaseTryAgain"));
      console.error("Logo upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mt-3 flex flex-col items-center">
        <label
          className={`relative block h-[200px] w-[160px] cursor-pointer rounded-lg border-2 border-dashed border-white/60 ${isUploading ? "opacity-50" : ""}`}
        >
          <UploadImageIcon />
          <input
            {...register("banner")}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/gif"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="flex h-full flex-col items-center justify-center">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <>
                <span className="h-[200px] w-[160px] rounded-[24px] border border-solid border-[#E6E8EC] bg-[#E6E8EC]">
                  {isUploading ? t("createToken.uploading") : <></>}
                </span>
              </>
            )}
          </div>
        </label>
        {errors.banner && (
          <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
            <ErrorIcon className="color-[#FF3E56] h-[14px] w-[14px]" />{" "}
            {errors.banner.message?.toString()}
          </p>
        )}
      </div>
    </div>
  );
}
