import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Footer } from "@/components/Public/Footer"
import { Navbar } from "@/components/Public/Navbar"

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
