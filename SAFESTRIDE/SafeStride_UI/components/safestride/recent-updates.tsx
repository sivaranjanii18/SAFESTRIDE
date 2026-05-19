"use client"

import { CheckCircle, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSOS } from "@/lib/sos-context"
import { formatDistanceToNow } from "date-fns"

export function RecentUpdates() {
  const { notifications } = useSOS()

  const recentNotifications = notifications.slice(0, 3)
  const hasAlerts = notifications.some(n => n.type === 'alert' || n.type === 'sos')

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
      case 'sos':
        return <AlertTriangle className="h-4 w-4 text-alert-red" />
      case 'info':
        return <Info className="h-4 w-4 text-primary" />
      default:
        return <CheckCircle className="h-4 w-4 text-safe-green" />
    }
  }

  return (
    <div className="px-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {recentNotifications.length === 0 || !hasAlerts ? (
            <div className="flex items-center gap-3 rounded-lg bg-safe-green/10 p-3">
              <CheckCircle className="h-5 w-5 text-safe-green" />
              <p className="text-sm text-foreground">
                No critical alerts at this time
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                >
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
