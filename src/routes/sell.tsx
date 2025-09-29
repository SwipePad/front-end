import { SellProvider } from "@/features/sell/sell.context";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/sell")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SellProvider>
      <Outlet />
    </SellProvider>
  );
}
