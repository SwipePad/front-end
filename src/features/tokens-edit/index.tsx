import { useUser } from "@/components/providers/user-provider";
import { Header } from "@/components/shared/header";
import { toast } from "@/components/shared/toast";
import { Image } from "@/components/ui/image";
import { formatImageUrl } from "@/lib/utils";
import {
  useFileUploadControllerUploadSingle,
  useMemeControllerFindDetail,
  useMemeControllerUpdateOffChainData,
} from "@/services/queries";
import { sendHapticAction } from "@/utils/miniapp";
import { useNavigate, useParams } from "@tanstack/react-router";
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAddress } from "viem";
import UploadImageIcon from "@/assets/icons/upload-image.svg?react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import ErrorIcon from "@/assets/icons/error-triangle.svg?react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import i18n from "i18next";

const TokenEdit = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const { t } = useTranslation();

  const { tokenId } = useParams({
    strict: false,
  });
  const navigate = useNavigate();

  const bannerUpdateSchema = z.object({
    banner: z.string().min(1, i18n.t("toaster.form.bannerIsRequired")),
    bannerPreview: z.string().optional(),
    description: z.string().trim().max(100, i18n.t("toaster.form.maxDescriptionLength")).optional(),
  });

  type BannerUpdateFormData = z.infer<typeof bannerUpdateSchema>;

  const { token, address } = useUser();
  const uploadMutation = useFileUploadControllerUploadSingle({
    request: {
      headers: {
        "x-jwt": token,
      },
    },
  });

  const { data: memeDetails, isLoading } = useMemeControllerFindDetail(getAddress(tokenId), {
    query: {
      enabled: !!tokenId,
    },
  });
  const [previewDisplayImage, setPreviewDisplayImage] = useState<string | null>(null);

  const methodsTokenDetails = useForm<BannerUpdateFormData>({
    resolver: zodResolver(bannerUpdateSchema),
    defaultValues: {
      banner: memeDetails?.banner || "",
      bannerPreview: memeDetails?.banner || "",
      description: memeDetails?.description || "",
    },
  });

  const { mutateAsync: updateProjectOffChain } = useMemeControllerUpdateOffChainData({});
  useEffect(() => {
    if (memeDetails?.banner) {
      setPreviewDisplayImage(memeDetails.banner);
      methodsTokenDetails.setValue("bannerPreview", memeDetails.banner);
      methodsTokenDetails.setValue("banner", memeDetails.banner);
      methodsTokenDetails.setValue("description", memeDetails.description || "");
    }
  }, [memeDetails]);

  if (isLoading || !memeDetails) {
    <Loader2 className="text-primary h-8 w-8 animate-spin" />;
  }

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
      // remove error
      methodsTokenDetails.setValue("banner", formattedUrl);
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewDisplayImage(reader.result as string);
        methodsTokenDetails.setValue("bannerPreview", reader.result as string);
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

  const handleUpdateDisplayImage = async () => {
    try {
      setIsLoadingUpdate(true);
      const banner = methodsTokenDetails.getValues("banner");
      const description = methodsTokenDetails.getValues("description");

      if (banner === memeDetails?.banner && description === memeDetails?.description) {
        toast.warning(t("createToken.noChangesMade"));
        return;
      }

      await updateProjectOffChain({
        data: {
          tokenAddress: getAddress(tokenId),
          banner,
          description,
        },
      });

      toast.success(
        t("createToken.updateSuccessfully"),
        t("createToken.updateTokenSuccess", {
          symbol: memeDetails?.symbol || "Token",
        })
      );
      methodsTokenDetails.reset();

      navigate({
        to: `/profile/${getAddress(address as string)}?tabs=project`,
      });
    } catch (error) {
      sendHapticAction("notification", "error");
      toast.error(t("createToken.updateTokenFailed"));
      console.error("Update error:", error);
    } finally {
      setIsLoadingUpdate(false);
      setIsUploading(false);
      setPreviewDisplayImage(null);
    }
  };

  return (
    <div className="h-full w-full p-4">
      <Header title={t("tokenDetail.edit")} />

      <FormProvider {...methodsTokenDetails}>
        <form
          onSubmit={methodsTokenDetails.handleSubmit(() => {
            handleUpdateDisplayImage();
          })}
        >
          <div className="mt-4">
            <label>
              <input
                {...methodsTokenDetails.register("banner")}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/gif"
                onChange={handleFileChange}
                disabled={isUploading}
              />

              <div className="relative z-20 mx-auto h-[calc(100vh-300px)] max-h-[500px] w-[340px]">
                {previewDisplayImage && (
                  <div className="relative mx-auto mt-4 h-full w-full overflow-hidden rounded-[20px] border-[2px] border-[#D1D4DC]">
                    <Image
                      src={previewDisplayImage || ""}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 15.38%, rgba(0,0,0,0) 41.35%, rgba(0,0,0,0.30) 65.87%, rgba(0,0,0,0.64) 100%)",
                      }}
                    />
                  </div>
                )}

                <div className="absolute bottom-4 left-4 z-10 flex flex-col items-center justify-center font-semibold text-[#FFF]">
                  <div className="mr-auto flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] p-1">
                    <UploadImageIcon className="z-10 h-4 w-4 text-[#fff]" />
                  </div>
                  <p className="mr-auto mt-4">{t("createToken.tapToChange")}</p>
                  <p className="mr-auto">{t("createToken.tokenDisplayImage")}</p>

                  <p className="text-sm font-semibold opacity-55">
                    {t("toaster.form.recommendDisplaySize")}
                  </p>
                </div>
              </div>
            </label>

            <p className="mt-5">{t("createToken.description")}</p>
            <TextareaAutosize
              {...methodsTokenDetails.register("description")}
              placeholder={t("createToken.tellUsABitAboutYourProject")}
              maxRows={4}
              minRows={4}
              className="w-full rounded-[24px] border border-[#E6E8EC] p-4 text-sm focus:outline-none"
            />

            {methodsTokenDetails.formState.errors.description && (
              <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                <ErrorIcon className="color-[#FF3E56] h-[14px] w-[14px]" />
                {methodsTokenDetails.formState.errors.description.message}
              </p>
            )}
          </div>

          <Button className="mt-8 w-full" type="submit" disabled={isUploading}>
            {isLoadingUpdate ? (
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            ) : (
              t("createToken.update")
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default TokenEdit;
