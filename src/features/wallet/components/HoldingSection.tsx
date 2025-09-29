import { HorizontalProjectCard } from "@/components/shared/horizontal-project-card";
import { NoData } from "@/components/shared/no-data";
import { Separate } from "@/components/shared/separate";
import { useQueryParamsSortBy } from "@/hooks/params/use-query-sort-by";
import { MemeResponse } from "@/services/models";
import { useTranslation } from "react-i18next";

type HoldingSectionProps = {
  mappedBalanceMemes: (MemeResponse & {
    rawBalance?: string;
    readableBalance?: string;
  })[];
};

export function HoldingSection({ mappedBalanceMemes }: HoldingSectionProps) {
  const { t } = useTranslation();
  const { sortBy } = useQueryParamsSortBy("default");

  const sortedMappedBalanceMemes = [...mappedBalanceMemes].sort((a, b) => {
    const totalA = parseFloat(a.readableBalance ?? "0") * parseFloat(a.currentPriceByUsd ?? "0");
    const totalB = parseFloat(b.readableBalance ?? "0") * parseFloat(b.currentPriceByUsd ?? "0");

    if (sortBy === "holdingAsc") {
      return totalA - totalB; // Sort in ascending order (lowest to highest)
    } else if (sortBy === "holdingDesc") {
      return totalB - totalA; // Sort in descending order (highest to lowest)
    } else {
      // default sorting - no sorting, keep original order
      return 0;
    }
  });

  return mappedBalanceMemes?.length && mappedBalanceMemes?.length > 0 ? (
    <div className="px-4 py-3">
      <div className="space-y-2">
        {sortedMappedBalanceMemes.map((item, index) => (
          <div key={index}>
            <HorizontalProjectCard
              key={index}
              data={item as MemeResponse}
              isHoldingMode
              isShowGuarded={true}
              isShowBond
            />
            {index < mappedBalanceMemes.length - 1 && <Separate />}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <NoData title={t("wallet.noTokens")} description={t("wallet.noTokensDescription")} />
  );
}
