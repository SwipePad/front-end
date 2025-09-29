import { CreatorCard } from "@/components/shared/creator-card";
import { MemeDetailResponse } from "@/services/models";
import { useTranslation } from "react-i18next";

export function AboutSection({ data }: { data?: MemeDetailResponse }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <p className="font-medium text-black">{data?.name}</p>
        <p className="text-sm text-[#777E90]">{data?.description}</p>
      </div>

      <div className="space-y-1">
        <p className="font-medium text-black">{t("tokenDetail.creator")}</p>
        <CreatorCard data={data?.userInfo} />
      </div>
    </div>
  );
}
