import { CreatorCard } from "@/components/shared/creator-card";
import { MemeDetailResponse } from "@/services/models";
import { useTranslation } from "react-i18next";

export function AboutCreator({ data }: { data?: MemeDetailResponse }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <p className="font-medium text-black">{t("tokenDetail.aboutCreator")}</p>
      <CreatorCard data={data?.userInfo} />
    </div>
  );
}
