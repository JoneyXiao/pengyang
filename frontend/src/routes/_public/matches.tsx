import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/matches")({
  component: () => <Outlet />,
})
