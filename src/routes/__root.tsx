import { createRootRoute } from "@tanstack/react-router";
// import { MainLayout } from "@/components/layout/main-layout";
import { HomeLayout } from "@/components/layout/home-layout";
// import { useReferralParams } from "@/hooks/use-referral-params";

export const Route = createRootRoute({
  component: () => {
    return <HomeLayout />;
  },
});
