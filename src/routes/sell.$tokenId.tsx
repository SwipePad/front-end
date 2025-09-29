import { SellTokenIdPage } from "@/features/sell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sell/$tokenId")({
  component: SellTokenIdPage,
});
