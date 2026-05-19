"use client"

import {
  Settings,
  HelpCircle,
  FileText,
  Shield,
  Bell,
  Moon,
  Globe,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  Map,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface MenuItem {
  icon: React.ReactNode
  label: string
  description?: string
  badge?: string
  onClick?: () => void
}

const features: MenuItem[] = [
  {
    icon: <Sparkles className="h-5 w-5 text-primary" />,
    label: "AI Safety Assistant",
    description: "Get personalized safety recommendations",
    badge: "New",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-primary" />,
    label: "Analytics Dashboard",
    description: "View detailed safety analytics",
  },
  {
    icon: <Map className="h-5 w-5 text-primary" />,
    label: "Safe Routes",
    description: "Find the safest path to your destination",
  },
  {
    icon: <Zap className="h-5 w-5 text-primary" />,
    label: "Quick Actions",
    description: "Customize your quick action buttons",
  },
]

const settings: MenuItem[] = [
  {
    icon: <Bell className="h-5 w-5" />,
    label: "Notifications",
    description: "Manage alert preferences",
  },
  {
    icon: <Moon className="h-5 w-5" />,
    label: "Appearance",
    description: "Dark mode and themes",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    label: "Language & Region",
    description: "English (US)",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    label: "Privacy",
    description: "Data and location settings",
  },
]

const support: MenuItem[] = [
  {
    icon: <HelpCircle className="h-5 w-5" />,
    label: "Help Center",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    label: "Contact Support",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Terms of Service",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    label: "Privacy Policy",
  },
]

export function MoreView() {
  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div>
        <h1 className="text-xl font-semibold">More</h1>
        <p className="text-sm text-muted-foreground">
          Additional features and settings
        </p>
      </div>

      {/* Premium Features */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            Premium Features
          </CardTitle>
          <CardDescription>
            Unlock advanced safety features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {features.map((item, index) => (
            <button
              key={index}
              className="flex w-full items-center justify-between rounded-lg bg-card p-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {settings.map((item, index) => (
            <button
              key={index}
              className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{item.icon}</span>
                <div>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Push Notifications</span>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Map className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Location Sharing</span>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-4 w-4" />
            Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {support.map((item, index) => (
            <button
              key={index}
              className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">SafeStride v1.0.0</p>
        <p className="text-xs text-muted-foreground">Made with care for your safety</p>
      </div>
    </div>
  )
}
