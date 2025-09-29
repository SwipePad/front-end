import { useState } from "react";
import UploadProjectIcon from "@/assets/icons/upload-project.svg?react";
import { toast } from "@/components/shared/toast";
import { Image } from "@/components/ui/image";
import CheckBadgeIcon from "@/assets/icons/check-badge.svg?react";
import CloseIcon from "@/assets/icons/close-x.svg?react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AnimatedProgress2 } from "@/components/shared/animated-progress-2";

const useToastCreateToken = () => {
  const [creatingTokenToastId, setCreatingTokenToastId] = useState<string | number>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const toastCreatingToken = () => {
    const toastId = toast.custom(
      () => {
        return (
          <div className="rounded-2xl border border-[#E6E8EC] bg-[#FFF] p-4">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2.5">
                <UploadProjectIcon className="h-4 w-4 text-[#19BF58]" />

                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="text-sm font-semibold">{t("createToken.projectBeingUpload")}</h3>
                  <p className="text-[13px] font-normal text-[#777E90]">
                    {t("createToken.stayStillprojectBeingUpload")}
                  </p>
                </div>

                <CloseIcon
                  className="h-4 w-4 text-[#B3B3B3]"
                  onClick={() => toast.dismiss(toastId)}
                />
              </div>

              <AnimatedProgress2 duration={7000} target={90} className="!relative !top-0 !w-full" />
            </div>
          </div>
        );
      },
      {
        duration: Infinity,
      }
    );
    setCreatingTokenToastId(toastId);
  };

  const toastCreateSuccessfully = (image: string, tokenAddress: string) => {
    const toastId = toast.custom(
      () => (
        <div className="flex gap-4 rounded-2xl border border-[#E6E8EC] bg-[#FFF] p-4">
          <div className="relative h-[34px] w-[28px]">
            <Image src={image} className="h-full w-full rotate-[-7.8deg]" />

            <CheckBadgeIcon className="absolute -right-3 top-4 h-6 w-6 text-[#19BF58]" />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <h3 className="text-sm font-semibold"> {t("createToken.projectUploadSuccess")}</h3>
            <p
              className="w-max rounded-full border border-[#E6E8EC] px-2 text-[13px] font-normal text-[#141416]"
              onClick={() => {
                navigate({ to: `/tokens/${tokenAddress}` });
                toast.dismiss(toastId);
              }}
            >
              {t("createToken.viewNow")}
            </p>
          </div>

          <CloseIcon className="h-4 w-4 text-[#B3B3B3]" onClick={() => toast.dismiss(toastId)} />
        </div>
      ),
      { duration: 7000 }
    );
  };

  return {
    creatingTokenToastId,
    toastCreatingToken,
    toastCreateSuccessfully,
  };
};

export default useToastCreateToken;
