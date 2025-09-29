import TokenEdit from "@/features/tokens-edit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tokens/edit/$tokenId")({
  component: TokenEdit,
});
