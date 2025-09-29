import { BuyTokenIdPage } from "@/features/buy";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/buy/$tokenId")({
  component: BuyTokenIdPage,
});
