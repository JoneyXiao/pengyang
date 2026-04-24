import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/match-management")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" })
  },
})
