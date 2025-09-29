import { useTranslation } from "react-i18next";

export function DeploymentInfo() {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <p className="text-sm">
        {t("createToken.onlyPayGasFeesAndTheInitial")} <span className="text-[#F0B90B]">1 ETH</span>{" "}
        {t("createToken.forTheLiquidityWhichWillBeReturnedToYouInLessThan")}{" "}
        <span className="text-[#F0B90B]">{t("createToken.twentyFourHour")}</span>
      </p>
    </div>
  );
}
