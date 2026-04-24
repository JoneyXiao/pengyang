import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { PublicService } from "@/client"
import { PositionFilter } from "@/components/Public/PositionFilter"
import { ProfileCard } from "@/components/Public/ProfileCard"

export const Route = createFileRoute("/_public/roster")({
  component: RosterPage,
  head: () => ({
    meta: [{ title: "阵容 - 鹏飏足球" }],
  }),
})

const ALL_LABEL = "全部"

function RosterPage() {
  const [selectedPosition, setSelectedPosition] = useState(ALL_LABEL)

  const {
    data: coachesData,
    isLoading: loadingCoaches,
    isError: coachesError,
  } = useQuery({
    queryKey: ["public-coaches"],
    queryFn: () => PublicService.getCoaches(),
  })

  const {
    data: playersData,
    isLoading: loadingPlayers,
    isError: playersError,
  } = useQuery({
    queryKey: ["public-players"],
    queryFn: () => PublicService.getPlayers(),
  })

  const positions = useMemo(() => {
    if (!playersData?.data) return [ALL_LABEL]
    const set = new Set<string>()
    for (const p of playersData.data) {
      if (p.position) set.add(p.position)
    }
    return [ALL_LABEL, ...Array.from(set).sort()]
  }, [playersData])

  const filteredPlayers = useMemo(() => {
    if (!playersData?.data) return []
    if (selectedPosition === ALL_LABEL) return playersData.data
    return playersData.data.filter((p) => p.position === selectedPosition)
  }, [playersData, selectedPosition])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      {/* Page header */}
      <h1
        className="mb-2 font-display text-4xl tracking-tight md:text-5xl lg:text-6xl"
        style={{ fontWeight: 900 }}
      >
        阵容
      </h1>
      <p className="mb-12 font-body text-sm text-[#707072] md:text-base">
        了解我们的教练组和球员阵容
      </p>

      {/* Coaching Staff */}
      <section className="mb-16">
        <h2
          className="mb-8 border-b-4 border-[#111111] pb-2 font-display text-lg tracking-wide md:text-xl"
          style={{ fontWeight: 900 }}
        >
          教练组
        </h2>

        {coachesError ? (
          <p className="font-body text-[#707072]">加载失败，请刷新页面重试</p>
        ) : loadingCoaches ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse bg-[#F5F5F5]"
              />
            ))}
          </div>
        ) : coachesData?.data && coachesData.data.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
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
          <p className="font-body text-[#707072]">暂无教练信息</p>
        )}
      </section>

      {/* Players */}
      <section>
        <div className="mb-6 flex flex-col gap-4 border-b-4 border-[#111111] pb-2 md:flex-row md:items-center md:justify-between">
          <h2
            className="font-display text-lg tracking-wide md:text-xl"
            style={{ fontWeight: 900 }}
          >
            球员
          </h2>
          {positions.length > 1 && (
            <PositionFilter
              positions={positions}
              selected={selectedPosition}
              onChange={setSelectedPosition}
            />
          )}
        </div>

        {playersError ? (
          <div className="py-16 text-center">
            <p className="font-body text-[#707072]">加载失败，请刷新页面重试</p>
          </div>
        ) : loadingPlayers ? (
          <div className="grid grid-cols-2 gap-[4px] md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse bg-[#F5F5F5]"
              />
            ))}
          </div>
        ) : filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-[4px] lg:grid-cols-5">
            {filteredPlayers.map((player) => (
              <ProfileCard
                key={player.id}
                name={player.first_name}
                position={player.position}
                jerseyNumber={player.jersey_number}
                biography={player.biography}
                photoUrl={player.photo_url}
                hasFullProfile={player.has_full_profile ?? false}
                type="player"
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="font-body text-[#707072]">暂无球员信息</p>
          </div>
        )}
      </section>
    </div>
  )
}
