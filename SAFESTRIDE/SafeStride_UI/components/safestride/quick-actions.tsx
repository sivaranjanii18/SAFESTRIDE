"use client"

import { AlertCircle, MapPin, FileWarning } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  color: 'red' | 'green' | 'yellow'
  onClick: () => void
}

interface QuickActionsProps {
  onSOSClick: () => void
  onShareLocationClick: () => void
  onReportIncidentClick: () => void
}

export function QuickActions({
  onSOSClick,
  onShareLocationClick,
  onReportIncidentClick,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'sos',
      label: 'SOS Alert',
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'red',
      onClick: onSOSClick,
    },
    {
      id: 'share',
      label: 'Share Location',
      icon: <MapPin className="h-6 w-6" />,
      color: 'green',
      onClick: onShareLocationClick,
    },
    {
      id: 'report',
      label: 'Report Incident',
      icon: <FileWarning className="h-6 w-6" />,
      color: 'yellow',
      onClick: onReportIncidentClick,
    },
  ]

  const colorStyles = {
    red: 'bg-alert-red/10 text-alert-red hover:bg-alert-red/20 border-alert-red/20',
    green: 'bg-safe-green/10 text-safe-green hover:bg-safe-green/20 border-safe-green/20',
    yellow: 'bg-warning-yellow/10 text-foreground hover:bg-warning-yellow/20 border-warning-yellow/30',
  }

  return (
    <div className="px-4">
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <Card
            key={action.id}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 border p-4 transition-all active:scale-95",
              colorStyles[action.color]
            )}
            onClick={action.onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && action.onClick()}
          >
            {action.icon}
            <span className="text-xs font-medium">{action.label}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
