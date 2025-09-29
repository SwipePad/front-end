import { NoColorAppLogoIcon } from "@/components/shared/icons";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import ArrowRight from "@/assets/icons/arrow-right.svg?react";
import BgSvg from "@/assets/icons/campaign-item-bg.svg?react";
import TwoThoundsandWld from "@/assets/icons/2000wld.svg?react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";

const EmptyCampaign = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-5 px-4 py-11">
      <NoColorAppLogoIcon />

      <p className="text-xs font-medium text-[#A3A8B5]">{t("profile.noCampaignsAtTheMoment")}</p>
    </div>
  );
};

type CampaignSectionItemProps = {
  isOnlyBanner?: boolean;
};
export const CampaignSectionItem = ({ isOnlyBanner = false }: CampaignSectionItemProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="relative rounded-2xl bg-[#F4F5F6] p-1"
      onClick={() => {
        navigate({ to: "/create-token" });
      }}
    >
      <div
        className={cn(
          "absolute left-1/2 top-1 max-w-[calc(100%-8px)] -translate-x-1/2 overflow-hidden rounded-xl bg-[#00CE41]",
          {
            "rounded-xl": isOnlyBanner,
            "rounded-b-none": !isOnlyBanner,
          }
        )}
      >
        <BgSvg className="h-[98px] w-[500px] text-white" />
      </div>

      <div className="relative flex flex-col">
        <div className="relative z-10 flex items-center justify-between rounded-2xl px-4 pb-3 pt-1">
          <div className="item-start flex flex-col justify-center gap-1">
            <p
              className="text-border-black text-left text-base"
              style={{
                textShadow:
                  "-1.5px -1.5px 0 #23262f, 1.5px -1.5px 0 #23262f, -1.5px 1.5px 0 #23262f, 1.5px 1.5px 0 #23262f",
              }}
            >
              {t("profile.createTokenAndEarn")}
            </p>

            <div className="flex items-center gap-1">
              <p className="text-border-black uppercase">{t("profile.upTo")}</p>

              <TwoThoundsandWld />
            </div>

            <Button className="h-6 w-max text-nowrap px-1.5 text-[13px]">
              <div className="flex items-center gap-1">
                {t("createToken.createToken")}
                <ArrowRight className="h-[14px] w-[14px]" />
              </div>
            </Button>
          </div>

          <Image
            src="/images/profile/wld-token_1.png"
            alt="wld-token_image"
            className="h-[90px] w-[90px] rounded-full"
          />
        </div>

        {!isOnlyBanner && (
          <div className="flex flex-col gap-2 px-4 pb-2">
            <p className="font-semibold">{t("profile.campaignCreateTokenTitle")}</p>

            <p className="mt-1 text-[13px] font-medium text-[#777E90]">
              {t("profile.campaignCreateTokenDesc")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CampaignsSection = ({ totalCampaigns }: { totalCampaigns: number }) => {
  return (
    <div className="relative">
      {totalCampaigns === 0 ? (
        <EmptyCampaign />
      ) : (
        <div className="flex flex-col gap-4">
          <CampaignSectionItem />
        </div>
      )}
    </div>
  );
};

export default CampaignsSection;
