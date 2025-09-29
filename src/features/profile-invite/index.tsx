import { Header } from "@/components/shared/header";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { Copy } from "lucide-react";
import PeopleIcon from "@/assets/icons/people.svg?react";
import ChartIcon from "@/assets/icons/chart.svg?react";
import { Image } from "@/components/ui/image";
import { useCopyToClipboard } from "@/hooks/utils/use-copy-to-clipboard";
import { useTranslation } from "react-i18next";

export default function ProfileInvite() {
  const { copyToClipboard } = useCopyToClipboard();
  const { t } = useTranslation();
  const refLink = "holdstation.wld/25SN05";

  return (
    <section className="rounded-t-2xl">
      <Header title="Invite" />
      <div className="space-y-2 px-4 py-3">
        <div className="overflow-hidden rounded-2xl border border-[#E6E8EC]">
          <div className="overflow-hidden bg-[#F4F5F6] p-[10px]">
            <p className="text-center text-sm font-semibold uppercase text-[#777E90]">
              {t("profile.sendLinkGetBonus")}
            </p>
          </div>
          <Image src="/images/profile/separate.png" alt="" />
          <div className="pb-3 pt-2 text-center">
            <p className="text-sm text-[#777E90]">{t("profile.myInvitationLink")}</p>
            <p className="font-medium">{refLink}</p>
            <Button
              className="mx-auto mt-2 h-[32px] w-[110px] p-0 text-sm font-medium"
              onClick={() => copyToClipboard(refLink)}
            >
              {t("profile.copyLink")} <Copy className="size-3" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E6E8EC] p-1">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1 px-3 py-2">
              <p className="flex items-center gap-2 text-xs text-[#777E90]">
                <PeopleIcon className="size-4" />
                {t("profile.myInvites")}
              </p>
              <p className="font-medium">12 {t("profile.people")}</p>
            </div>

            <div className="flex-1 space-y-1 px-3 py-2">
              <p className="flex items-center gap-2 text-xs text-[#777E90]">
                <ChartIcon className="size-4" />
                {t("profile.totalVolume")}
              </p>
              <p className="font-medium">100M</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#F4F5F6] p-3 text-sm text-[#777E90]">
            <div className="flex items-center justify-between">
              <p>{t("profile.address")}</p>
              <p>{t("profile.volume")}</p>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between py-2">
              <div className="flex flex-1 items-center gap-1">
                <Image src="/images/fake-token.png" alt="" className="size-5 rounded-full" />
                <p>0x23...34st</p>
              </div>
              <p className="text-sm font-medium text-[#141416]">23M</p>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex flex-1 items-center gap-1">
                <Image src="/images/fake-token.png" alt="" className="size-5 rounded-full" />
                <p>0x23...34st</p>
              </div>
              <p className="text-sm font-medium text-[#141416]">23M</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E6E8EC] p-1">
          <p className="px-3 pb-2 pt-1 font-medium">{t("profile.referralReward")}</p>
          <div className="flex items-end justify-between gap-1 rounded-xl bg-[#F4F5F6] p-3 text-sm text-[#777E90]">
            <div>
              <p className="font-medium">{t("profile.miningUpgrade")}</p>
              <p className="text-sm text-[#777E90]">15 WLD</p>
            </div>
            <Button className="h-[28px] w-[72px] text-sm font-medium">
              {t("profile.claim")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
