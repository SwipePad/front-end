import { Leaderboard } from "@/features/explore-leaderboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/explore/leaderboard/")({
  component: Leaderboard,
});
