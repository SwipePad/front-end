import ProfileInvite from "@/features/profile-invite";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/$profileId_/invite")({
  component: ProfileInvite,
});
