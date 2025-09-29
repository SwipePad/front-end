import ProfileEdit from "@/features/profile-edit";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/profile/edit/")({
  component: ProfileEdit,
});
