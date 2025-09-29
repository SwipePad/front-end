import { useTranslation } from "react-i18next";

export function NoData({
  title,
  description,
  isShowDescription = true,
}: {
  title?: string;
  description?: string;
  isShowDescription?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-36 flex-col items-center justify-center gap-1 p-4 text-center">
      <p className="text-lg font-semibold text-[#141416]">{title || t("shared.noData.title")}</p>
      {isShowDescription && (
        <p className="text-sm text-[#777E90]">{description || t("shared.noData.description")}</p>
      )}
    </div>
  );
}
