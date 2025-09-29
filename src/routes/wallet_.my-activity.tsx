import MyActivityPage from "@/features/my-activity";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/wallet_/my-activity")({
  component: MyActivityPage,
});
