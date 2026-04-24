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
  return (
    <div className="group overflow-hidden rounded-lg border border-[#E5E5E5] bg-white transition-transform hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {/* Photo */}
      <div className="aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
        {hasFullProfile && photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {jerseyNumber != null ? (
              <span
                className="text-6xl text-[#E5E5E5]"
                style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
              >
                {jerseyNumber}
              </span>
            ) : (
              <span
                className="text-4xl text-[#E5E5E5]"
                style={{ fontFamily: "Jost, sans-serif", fontWeight: 700 }}
              >
                {name.charAt(0)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="text-base"
          style={{ fontFamily: "Jost, sans-serif", fontWeight: 700 }}
        >
          {name}
        </h3>
        <p
          className="mt-1 text-sm text-[#707072]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {type === "coach"
            ? role
            : hasFullProfile
              ? [position, jerseyNumber != null ? `#${jerseyNumber}` : null]
                  .filter(Boolean)
                  .join(" · ") || "球员"
              : jerseyNumber != null
                ? `#${jerseyNumber}`
                : "球员"}
        </p>
        {hasFullProfile && biography && (
          <p
            className="mt-2 line-clamp-3 text-sm text-[#707072]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {biography}
          </p>
        )}
      </div>
    </div>
  )
}
