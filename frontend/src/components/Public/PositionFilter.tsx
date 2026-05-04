interface PositionFilterProps {
  positions: string[]
  selected: string
  onChange: (position: string) => void
}

export function PositionFilter({
  positions,
  selected,
  onChange,
}: PositionFilterProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <div className="flex items-center gap-1 md:gap-2">
        {positions.map((pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => onChange(pos)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-body text-sm transition-colors ${
              selected === pos
                ? "bg-primary font-semibold text-primary-foreground"
                : "bg-transparent font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  )
}
