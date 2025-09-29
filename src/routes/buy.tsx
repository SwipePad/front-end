import { BuyProvider } from "@/features/buy/buy.context";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/buy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <BuyProvider>
      <Outlet />
    </BuyProvider>
  );
}
