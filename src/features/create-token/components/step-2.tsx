import { FormProvider, UseFormReturn } from "react-hook-form";

import { BottomBar, Button, TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import ArrowLeft from "@/assets/icons/arrow-left.svg?react";
import { BannerFormData, CreateTokenFormData } from "../schema";
import { useUser } from "@/components/providers/user-provider";
// import CreateTokenHighLightBanner from "@/components/shared/create-token-reward-banner";
import clsx from "clsx";
import { AnimatedProgress } from "@/features/create-token/components/step-1";
import { useTranslation } from "react-i18next";
import { useAccount } from "@/hooks/mini-app/useAccount";
import { useTokenBalance } from "@/hooks/contracts/use-token-balance";
import { formatEther } from "viem";
import { toast } from "@/components/shared/toast";
import { sendHapticAction } from "@/utils/miniapp";
import UploadImageIcon from "@/assets/icons/upload-image.svg?react";
import { TokenLogoUpload } from "@/features/create-token/components/inputs/token-logo-upload";
import { useState } from "react";
import { useFileUploadControllerUploadSingle } from "@/services/queries";
import { get } from "es-toolkit/compat";
import { cn, formatImageUrl } from "@/lib/utils";
import ErrorIcon from "@/assets/icons/error-triangle.svg?react";
import CreateTokenHighLightBanner from "@/components/shared/create-token-reward-banner";

type Props = {
  methods: UseFormReturn<BannerFormData>;
  methodsTokenDetails: UseFormReturn<CreateTokenFormData>;
  backToPreviousStep: () => void;
  onPublish: () => void;
  freeCount?: number;
  isPendingCreating: boolean;
};
export function Step2({
  methods,
  methodsTokenDetails,
  backToPreviousStep,
  onPublish,
  freeCount,
  isPendingCreating,
}: Props) {
  const { isHiddenHighLightBanner } = useUser();
  const { t } = useTranslation();
  const { nativeToken } = useAccount();
  const { data: tokenBalance } = useTokenBalance(nativeToken);
  const [isUploading, setIsUploading] = useState(false);

  const checkUserBalance = () => {
    if (Number(freeCount) <= 0 && Number(formatEther(tokenBalance || BigInt(0))) < 5) {
      sendHapticAction("notification", "error");
      toast.error(
        t("createToken.insufficientBalanceCreateToken", {
          amount: 5,
        })
      );
      return;
    }

    onPublish();
  };
  const { token } = useUser();
  const description = methodsTokenDetails.getValues("description")?.trim() || "";
  const [isShowFullDescription, setIsShowFullDescription] = useState(description.length <= 75);
  const uploadMutation = useFileUploadControllerUploadSingle({
    request: {
      headers: {
        "x-jwt": token,
      },
    },
  });

  const previewBanner = methods.watch("bannerPreview");

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
      methods.setValue("banner", formattedUrl);
      // remove error
      methods.clearErrors("banner");
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        methods.setValue("bannerPreview", reader.result as string);
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

  const disableSubmit = () => {
    return !methods.watch("logoPreview") || !previewBanner;
  };

  return (
    <div className="min-h-[calc(100vh-240px)] w-full">
      <TopBar
        startAdornment={<ArrowLeft onClick={() => backToPreviousStep()} />}
        title={t("createToken.uploadBannerProject")}
        className="fixed top-0 z-10 bg-white"
      />

      <div className="mt-20 h-full px-2 py-2">
        <div className="w-full">
          <AnimatedProgress target={100} duration={500} />
        </div>

        {!isHiddenHighLightBanner && <CreateTokenHighLightBanner />}

        <div className={clsx(!isHiddenHighLightBanner && "mt-[40px]", "h-full w-full")}>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(() => {
                checkUserBalance();
              })}
            >
              <div className="flex h-full flex-1 flex-col space-y-4 px-2 sm:space-y-6">
                <div
                  className="relative flex h-full min-h-[calc(100vh-290px)] flex-col justify-between rounded-3xl border border-[#D1D4DC]"
                  style={{
                    background: previewBanner
                      ? `
                            linear-gradient(
                              180deg,
                              rgba(0, 0, 0, 0.72) 0%,
                              rgba(0, 0, 0, 0) 15.38%,
                              rgba(0, 0, 0, 0) 41.35%,
                              rgba(0, 0, 0, 0.30) 65.87%,
                              rgba(0, 0, 0, 0.64) 100%
                            ),
                            url(${previewBanner}) lightgray 50% / cover no-repeat
                            `
                      : "",
                  }}
                >
                  {previewBanner && (
                    <label>
                      <div className="min-h-[calc(100vh-465px)]">
                        <input
                          {...methods.register("banner")}
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg,image/gif"
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                        <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-[#D1D4DC] bg-[#FFFFFF]">
                          <UploadImageIcon className="z-10 h-4 w-4 text-[#000000]" />
                        </div>
                      </div>
                    </label>
                  )}

                  <label>
                    {!previewBanner && (
                      <div className="flex min-h-[calc(100vh-465px)] flex-col">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex flex-col">
                            <h4 className="font-semibold">{t("toaster.form.displayImage")}</h4>
                            <p className="text-[10px] font-medium text-[#777E90]">
                              {t("toaster.form.recommendDisplaySize")}
                            </p>
                          </div>
                          <div className="rounded-full border border-[#E6E8EC] p-2">
                            <UploadImageIcon className="h-5 w-5 text-[#141416]" />
                          </div>

                          <input
                            {...methods.register("banner")}
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,image/gif"
                            onChange={handleFileChange}
                            disabled={isUploading}
                          />
                        </div>

                        {methods.formState.errors.banner && (
                          <p className="ml-2 flex min-w-[80px] -translate-y-1/2 items-center gap-1 rounded-md bg-white p-1 text-xs text-red-500">
                            <ErrorIcon className="color-[#FF3E56] h-[14px] w-[14px]" />
                            {methods.formState.errors.banner.message?.toString()}
                          </p>
                        )}
                      </div>
                    )}
                  </label>

                  <div
                    className={cn("relative z-10 flex flex-col gap-2 p-4", {
                      "text-[#000]": !previewBanner,
                      "text-[#fff]": previewBanner,
                    })}
                  >
                    <TokenLogoUpload />

                    <p className="druk-wide-font mt-3 text-lg font-bold">
                      {methodsTokenDetails.getValues("name")}
                    </p>
                    <p className="break-words text-sm font-normal">
                      {isShowFullDescription ? description : `${description.slice(0, 75)}...`}{" "}
                      {description.length > 75 && (
                        <span
                          className="text-sm font-bold"
                          onClick={() => setIsShowFullDescription(prev => !prev)}
                        >
                          {isShowFullDescription
                            ? t("tokenDetail.showLess")
                            : t("tokenDetail.showMore")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <BottomBar>
                  <div className="fixed bottom-[30px] left-1/2 mt-4 w-[calc(100%-32px)] -translate-x-1/2">
                    <Button
                      type="submit"
                      fullWidth
                      variant="primary"
                      disabled={isPendingCreating || disableSubmit()}
                    >
                      {t(
                        disableSubmit()
                          ? "createToken.uploadImageToPublish"
                          : "createToken.publishNow"
                      )}
                    </Button>
                    {freeCount && freeCount > 0 ? (
                      <p className="text-border-black absolute left-6 top-[-8px] text-center text-[14px] font-black italic leading-[16px] tracking-[-0.14px] text-white">
                        {t("createToken.free")} x{freeCount}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </BottomBar>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
