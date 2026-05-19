"use client"

import { Shield, Bell, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useSOS } from "@/lib/sos-context"

interface HeaderProps {
  onNotificationsClick: () => void
  onProfileClick: () => void
}

export function Header({ onNotificationsClick, onProfileClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const { unreadCount } = useSOS()

  return (
    <header className="bg-gradient-to-r from-navy-dark to-navy-light px-4 py-4 text-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">SafeStride</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onNotificationsClick}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-alert-red text-[10px] font-medium text-primary-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9 border-2 border-primary-foreground/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-safe-green text-primary-foreground">
                    {user?.name?.split(' ').map(n => n[0]).join('') || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                Emergency Contacts
              </DropdownMenuItem>
              <DropdownMenuItem>
                Connected Devices
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
