import { Feed } from "@/features/feed";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feed")({
  component: Feed,
});
