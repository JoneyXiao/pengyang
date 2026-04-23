import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"
import badge from "/assets/images/badge.png"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
  asLink?: boolean
  forceLight?: boolean
}

export function Logo({
  variant = "full",
  className,
  asLink = true,
  forceLight = false,
}: LogoProps) {
  const badgeClassName = cn(
    "shrink-0 object-contain",
    forceLight && "drop-shadow-[0_0_16px_rgba(255,255,255,0.2)]",
    className,
  )

  const content =
    variant === "responsive" ? (
      <>
        <img
          src={badge}
          alt="鹏飏"
          width={48}
          height={48}
          className={cn(
            "size-12 group-data-[collapsible=icon]:hidden",
            badgeClassName,
          )}
        />
        <img
          src={badge}
          alt="鹏飏"
          width={36}
          height={36}
          className={cn(
            "hidden size-9 group-data-[collapsible=icon]:block",
            badgeClassName,
          )}
        />
      </>
    ) : (
      <img
        src={badge}
        alt="鹏飏"
        width={variant === "full" ? 64 : 36}
        height={variant === "full" ? 64 : 36}
        className={cn(
          variant === "full" ? "size-16" : "size-9",
          badgeClassName,
        )}
      />
    )

  if (!asLink) {
    return content
  }

  return <Link to="/">{content}</Link>
}
