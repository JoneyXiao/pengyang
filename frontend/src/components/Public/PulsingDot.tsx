interface PulsingDotProps {
  color?: string
  className?: string
}

export function PulsingDot({
  color = "bg-white",
  className = "h-1.5 w-1.5",
}: PulsingDotProps) {
  return (
    <span className={`relative flex ${className}`}>
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${color}`}
      />
      <span className={`relative inline-flex rounded-full ${className} ${color}`} />
    </span>
  )
}
