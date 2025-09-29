import { createLazyFileRoute } from "@tanstack/react-router";
import { TokenDetail } from "@/features/token-detail";

export const Route = createLazyFileRoute("/tokens/$tokenId")({
  component: TokenDetail,
});
