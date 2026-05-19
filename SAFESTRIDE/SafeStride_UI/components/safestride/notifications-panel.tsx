"use client"

import { Bell, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSOS } from "@/lib/sos-context"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface NotificationsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useSOS()

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-warning-yellow" />
      case 'sos':
        return <AlertCircle className="h-5 w-5 text-alert-red" />
      case 'info':
        return <Info className="h-5 w-5 text-primary" />
      default:
        return <CheckCircle className="h-5 w-5 text-safe-green" />
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm p-0">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllNotificationsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
          <SheetDescription>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Bell className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={cn(
                    "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                    !notification.isRead && "bg-primary/5"
                  )}
                >
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm", !notification.isRead && "font-medium")}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground/70">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
