import { createLazyFileRoute } from "@tanstack/react-router";
import { ExploreSearch } from "@/features/explore-search";

export const Route = createLazyFileRoute("/explore/search/")({
  component: ExploreSearch,
});
