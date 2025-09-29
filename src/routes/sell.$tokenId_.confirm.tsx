import { SellConfirmPage } from "@/features/sell-confirm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sell/$tokenId_/confirm")({
  component: SellConfirmPage,
});
