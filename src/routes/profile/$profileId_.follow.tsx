import ProfileFollow from "@/features/profile-follow";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/$profileId_/follow")({
  component: ProfileFollow,
});
