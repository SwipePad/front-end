import { Header } from "@/components/shared/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParamsTabs } from "@/hooks/params/use-query-state-tabs";
import FollowerTab from "./components/follower";
import { useState } from "react";
import FollowingTab from "./components/following";
import { useTranslation } from "react-i18next";

export default function ProfileFollow() {
  const { tabs, setTabs } = useQueryParamsTabs();
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalFollowing, setTotalFollowing] = useState(0);
  const { t } = useTranslation();
  return (
    <section className="rounded-t-2xl">
      <Header title={t("profile.follow")} />

      <Tabs defaultValue={tabs || "following"}>
        <TabsList variant="underline" className="w-full border-b border-[#E6E8EC] px-3">
          <TabsTrigger
            value="following"
            className="flex-1 font-semibold"
            variant="underline"
            onClick={() => setTabs("following")}
          >
            {t("profile.following")} ({totalFollowing})
          </TabsTrigger>
          <TabsTrigger
            value="followers"
            className="flex-1 font-semibold"
            variant="underline"
            onClick={() => setTabs("followers")}
          >
            {t("profile.followers")} ({totalFollowers})
          </TabsTrigger>
        </TabsList>

        <FollowingTab setTotal={(t: number) => setTotalFollowing(t)} />
        <FollowerTab setTotal={(t: number) => setTotalFollowers(t)} />
      </Tabs>
    </section>
  );
}
