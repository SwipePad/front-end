import { BuyConfirmPage } from "@/features/buy-confirm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/buy/$tokenId_/confirm")({
  component: BuyConfirmPage,
});
