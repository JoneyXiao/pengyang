import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Navbar } from "@/components/Public/Navbar"

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[#E5E5E5] bg-[#F5F5F5] py-8 text-center">
        <p
          className="text-sm text-[#707072]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          © {new Date().getFullYear()} 深圳市龙华区观湖实验学校足球队
        </p>
      </footer>
    </div>
  )
}
