interface ProfileCardProps {
  name: string
  role?: string | null
  position?: string | null
  jerseyNumber?: number | null
  biography?: string | null
  photoUrl?: string | null
  hasFullProfile: boolean
  type: "coach" | "player"
}

export function ProfileCard({
  name,
  role,
  position,
  jerseyNumber,
  biography,
  photoUrl,
  hasFullProfile,
  type,
}: ProfileCardProps) {
  const subtitle =
    type === "coach"
      ? role
      : hasFullProfile
        ? [position, jerseyNumber != null ? `#${jerseyNumber}` : null]
            .filter(Boolean)
            .join(" · ") || "球员"
        : jerseyNumber != null
          ? `#${jerseyNumber}`
          : "球员"

  return (
    <div className="group relative overflow-hidden bg-white transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {/* Photo */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
        {hasFullProfile && photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-full w-full object-cover grayscale transition-all duration-300 ease-out group-hover:scale-105 group-hover:grayscale-0"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {jerseyNumber != null ? (
              <span
                className="font-display text-6xl text-[#E5E5E5] md:text-7xl"
                style={{ fontWeight: 900 }}
              >
                {jerseyNumber}
              </span>
            ) : (
              <span
                className="font-display text-5xl text-[#E5E5E5]"
                style={{ fontWeight: 700 }}
              >
                {name.charAt(0)}
              </span>
            )}
          </div>
        )}

        {/* Jersey number badge (players only) */}
        {type === "player" && jerseyNumber != null && hasFullProfile && (
          <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-sm bg-[#111111] md:h-9 md:w-9">
            <span
              className="font-display text-sm text-white md:text-base"
              style={{ fontWeight: 900 }}
            >
              {jerseyNumber}
            </span>
          </div>
        )}
      </div>

      {/* Info strip */}
      <div className="px-2 py-3 md:px-3">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072] md:text-xs">
          {subtitle}
        </p>
        <h3
          className="mt-0.5 font-display text-sm tracking-tight md:text-base"
          style={{ fontWeight: 700 }}
        >
          {name}
        </h3>
        {hasFullProfile && biography && (
          <p className="mt-1 line-clamp-2 font-body text-xs leading-relaxed text-[#707072]">
            {biography}
          </p>
        )}
      </div>
    </div>
  )
}
