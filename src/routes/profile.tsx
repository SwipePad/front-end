import { ProfileProvider } from "@/features/profile/profile.context";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProfileProvider>
      <Outlet />
    </ProfileProvider>
  );
}
