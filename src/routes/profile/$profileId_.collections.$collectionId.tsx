import ProfileCollection from "@/features/profile-collection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/$profileId_/collections/$collectionId")({
  component: ProfileCollection,
});
