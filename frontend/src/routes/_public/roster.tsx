import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { PublicService } from "@/client"
import { ProfileCard } from "@/components/Public/ProfileCard"

export const Route = createFileRoute("/_public/roster")({
  component: RosterPage,
  head: () => ({
    meta: [{ title: "教练与球员 - 鹏飏足球" }],
  }),
})

function RosterPage() {
  const { data: coachesData, isLoading: loadingCoaches } = useQuery({
    queryKey: ["public-coaches"],
    queryFn: () => PublicService.getCoaches(),
  })

  const { data: playersData, isLoading: loadingPlayers } = useQuery({
    queryKey: ["public-players"],
    queryFn: () => PublicService.getPlayers(),
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      {/* Coaches Section */}
      <section className="mb-16">
        <h2
          className="mb-8 text-3xl uppercase tracking-[-0.02em] md:text-4xl"
          style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
        >
          教练组
        </h2>
        {loadingCoaches ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-lg bg-[#F5F5F5]"
              />
            ))}
          </div>
        ) : coachesData?.data && coachesData.data.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {coachesData.data.map((coach) => (
              <ProfileCard
                key={coach.id}
                name={coach.name}
                role={coach.role}
                biography={coach.biography}
                photoUrl={coach.photo_url}
                hasFullProfile={true}
                type="coach"
              />
            ))}
          </div>
        ) : (
          <p
            className="text-[#707072]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            暂无教练信息
          </p>
        )}
      </section>

      {/* Players Section */}
      <section>
        <h2
          className="mb-8 text-3xl uppercase tracking-[-0.02em] md:text-4xl"
          style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
        >
          球员阵容
        </h2>
        {loadingPlayers ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-lg bg-[#F5F5F5]"
              />
            ))}
          </div>
        ) : playersData?.data && playersData.data.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {playersData.data.map((player) => (
              <ProfileCard
                key={player.id}
                name={player.first_name}
                position={player.position}
                jerseyNumber={player.jersey_number}
                biography={player.biography}
                photoUrl={player.photo_url}
                hasFullProfile={player.has_full_profile}
                type="player"
              />
            ))}
          </div>
        ) : (
          <p
            className="text-[#707072]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            暂无球员信息
          </p>
        )}
      </section>
    </div>
  )
}
