"use client"

import { Home, Search, FileText, User, MoreHorizontal, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

export type TabId = 'home' | 'chip' | 'search' | 'reports' | 'profile' | 'more'

interface BottomNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs = [
  { id: 'home' as TabId, label: 'Home', icon: Home },
  { id: 'chip' as TabId, label: 'Chip', icon: Cpu },
  { id: 'search' as TabId, label: 'Search', icon: Search },
  { id: 'reports' as TabId, label: 'Reports', icon: FileText },
  { id: 'profile' as TabId, label: 'Profile', icon: User },
  { id: 'more' as TabId, label: 'More', icon: MoreHorizontal },
]

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-lg">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-110"
                )}
              />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
