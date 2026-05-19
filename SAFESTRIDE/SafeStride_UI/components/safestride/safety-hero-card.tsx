"use client"

import { Shield, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLocation } from "@/lib/location-context"
import { formatDistanceToNow } from "date-fns"

export function SafetyHeroCard() {
  const { safetyScore, lastChecked } = useLocation()

  const isSafe = safetyScore.overall >= 70

  return (
    <div className="px-4">
      <Card
        className={`relative overflow-hidden p-6 ${
          isSafe
            ? "bg-gradient-to-br from-safe-green to-safe-green-light"
            : "bg-gradient-to-br from-warning-yellow to-accent"
        } text-primary-foreground shadow-lg`}
      >
        <div className="absolute right-0 top-0 opacity-10">
          <Shield className="h-32 w-32 -translate-y-4 translate-x-4" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
            {isSafe ? (
              <CheckCircle className="h-8 w-8" />
            ) : (
              <Shield className="h-8 w-8" />
            )}
          </div>

          <h2 className="mb-2 text-2xl font-bold">
            {isSafe ? "You're Safe" : "Stay Alert"}
          </h2>

          <p className="mb-4 text-primary-foreground/90">
            {isSafe
              ? "No immediate risks detected in your area"
              : "Some caution advised in your current area"}
          </p>

          <p className="text-sm text-primary-foreground/70">
            Last checked: {formatDistanceToNow(lastChecked, { addSuffix: true })}
          </p>
        </div>
      </Card>
    </div>
  )
}
