import { createLazyFileRoute } from "@tanstack/react-router";
import { Explore } from "@/features/explore";

export const Route = createLazyFileRoute("/explore/")({
  component: Explore,
});
