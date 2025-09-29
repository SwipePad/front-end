import { Image } from "@/components/ui/image";
import { useTranslation } from "react-i18next";

export const LookEmpty = () => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-8 text-center">
      <p className="font-semibold text-black">{t("wallet.looksEmpty")}</p>
      <p className="pb-6 text-sm font-medium text-[#777E90]">{t("wallet.createYourFirstProjectToday")}</p>
      <Image src="/images/wallet/empty-arrow.png" alt="" className="mx-auto h-[124px]" />
    </div>
  );
};
