import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParamsTabs } from "@/hooks/params/use-query-state-tabs";
import { useTranslation } from "react-i18next";

export function TabsSection({
  tabsContent,
  totalHolders,
}: {
  tabsContent: React.ReactNode;
  totalHolders: number;
}) {
  const { tabs, setTabs } = useQueryParamsTabs();
  const { t } = useTranslation();
  return (
    <>
      <Tabs defaultValue={tabs || "overview"}>
        <div className="overflow-x-scroll border-b border-[#E6E8EC] px-3" id="tabs">
          <TabsList variant="underline">
            <TabsTrigger
              value="overview"
              variant="underline"
              onClick={() => {
                setTabs("overview");
              }}
            >
              {t("tokenDetail.overview")}
            </TabsTrigger>
            <TabsTrigger
              value="top-holder"
              variant="underline"
              onClick={() => {
                setTabs("top-holder");
              }}
            >
              {totalHolders >= 2 ? t("tokenDetail.topHolders") : t("tokenDetail.topHolder")}
            </TabsTrigger>
            <TabsTrigger
              value="tx-history"
              variant="underline"
              onClick={() => {
                setTabs("tx-history");
              }}
            >
              {t("tokenDetail.txHistory")}
            </TabsTrigger>
            <TabsTrigger
              value="comment"
              variant="underline"
              onClick={() => {
                setTabs("comment");
              }}
            >
              {t("tokenDetail.comment")}
            </TabsTrigger>
          </TabsList>
        </div>
        {tabsContent}
      </Tabs>
    </>
  );
}
