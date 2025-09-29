import { AddCollection } from "@/features/add-collection";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/collections/add")({
  component: AddCollection,
});
