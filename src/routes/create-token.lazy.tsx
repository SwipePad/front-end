import { createLazyFileRoute } from "@tanstack/react-router";
import { CreateToken } from "@/features/create-token";

export const Route = createLazyFileRoute("/create-token")({
  component: CreateToken,
});
