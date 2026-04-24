import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { PublicService } from "@/client"

export const Route = createFileRoute("/_public/team")({
  component: TeamPage,
  head: () => ({
    meta: [{ title: "球队介绍 - 鹏飏足球" }],
  }),
})

function TeamPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-team-content"],
    queryFn: () => PublicService.getTeamContent(),
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <h1
        className="mb-8 text-4xl uppercase tracking-[-0.02em] md:text-5xl"
        style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
      >
        球队介绍
      </h1>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 animate-pulse rounded bg-[#F5F5F5]"
              style={{ width: `${80 - i * 15}%` }}
            />
          ))}
        </div>
      ) : data?.content ? (
        <div
          className="prose prose-lg max-w-none"
          style={{ fontFamily: "Inter, sans-serif" }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: content is sanitized server-side via nh3
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      ) : (
        <p
          className="text-[#707072]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          暂无球队介绍内容
        </p>
      )}
    </div>
  )
}
