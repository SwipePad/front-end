import { createLazyFileRoute } from "@tanstack/react-router";
import { Tokens } from "@/features/tokens";

export const Route = createLazyFileRoute("/tokens/")({
  component: Tokens,
});
