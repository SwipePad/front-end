import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParamsTabs } from "@/hooks/params/use-query-state-tabs";
import { useTranslation } from "react-i18next";

export function TabsSection({
  totalProjects,
  totalCampaigns,
  isOtherProfile,
  children,
}: {
  totalCampaigns: number;
  totalProjects: number;
  isOtherProfile: boolean;
  children: React.ReactNode;
}) {
  const { tabs, setTabs } = useQueryParamsTabs(isOtherProfile ? "project" : "campaign");
  const { t } = useTranslation();
  return (
    <div className="px-3" id="tabs">
      <Tabs defaultValue={tabs}>
        <TabsList variant="underline" className="w-full justify-start border-b">
          {!isOtherProfile && (
            <TabsTrigger
              value="campaign"
              variant="underline"
              onClick={() => {
                setTabs("campaign");
              }}
            >
              {totalCampaigns > 1 ? t("profile.campaigns") : t("profile.campaign")}
            </TabsTrigger>
          )}
          <TabsTrigger
            value="project"
            variant="underline"
            onClick={() => {
              setTabs("project");
            }}
          >
            {totalProjects > 1 ? t("profile.projects") : t("profile.project")} ({totalProjects})
          </TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}
