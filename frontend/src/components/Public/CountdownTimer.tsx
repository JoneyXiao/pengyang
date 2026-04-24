import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="font-display text-4xl tabular-nums tracking-tight md:text-5xl lg:text-6xl"
        style={{ fontWeight: 900, lineHeight: 1 }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 font-body text-[10px] uppercase tracking-[0.15em] text-white/50 md:text-xs">
        {label}
      </span>
    </div>
  )
}

function Colon() {
  return (
    <span
      className="font-display text-3xl text-[#FA5400] md:text-4xl lg:text-5xl"
      style={{ fontWeight: 900, lineHeight: 1 }}
    >
      :
    </span>
  )
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate))

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0

  useEffect(() => {
    if (new Date(targetDate).getTime() <= Date.now()) return
    const id = setInterval(() => {
      const next = calcTimeLeft(targetDate)
      setTimeLeft(next)
      if (
        next.days === 0 &&
        next.hours === 0 &&
        next.minutes === 0 &&
        next.seconds === 0
      ) {
        clearInterval(id)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (isExpired) {
    return (
      <p
        className="font-display text-2xl tracking-tight text-[#FA5400] md:text-3xl"
        style={{ fontWeight: 900 }}
      >
        已开赛
      </p>
    )
  }

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      <Segment value={timeLeft.days} label="天" />
      <Colon />
      <Segment value={timeLeft.hours} label="时" />
      <Colon />
      <Segment value={timeLeft.minutes} label="分" />
      <Colon />
      <Segment value={timeLeft.seconds} label="秒" />
    </div>
  )
}
