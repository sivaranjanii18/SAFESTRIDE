"use client"

import { FileText, Shield, Users, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { useLocation } from "@/lib/location-context"
import type { AnalyticsData, SafetyTip } from "@/lib/types"

const mockAnalytics: AnalyticsData = {
  totalReports: 12,
  safetyScore: 78,
  emergencyContactsCount: 3,
  checkInsThisWeek: 8,
  lastSOSDate: undefined,
  mostActiveTime: '9:00 AM - 6:00 PM',
  safeZonesVisited: 15,
}

const mockTips: SafetyTip[] = [
  {
    id: '1',
    title: 'Stay Visible',
    content: 'Stay on well-lit roads at night',
    category: 'night-safety',
    priority: 1,
  },
  {
    id: '2',
    title: 'Safe Area',
    content: 'Your area is generally safe during the day',
    category: 'area-info',
    priority: 2,
  },
]

export function InfoCards() {
  const { user } = useAuth()
  const { safetyScore } = useLocation()

  const contactsCount = user?.emergencyContacts.length || 0

  return (
    <div className="px-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Activity Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-primary" />
              Your Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Reports</span>
              <span className="text-sm font-semibold">{mockAnalytics.totalReports}</span>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Safety Score</span>
                <span className="text-sm font-semibold">{safetyScore.overall}/100</span>
              </div>
              <Progress value={safetyScore.overall} className="h-1.5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Contacts</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-semibold">{contactsCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-warning-yellow" />
              Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTips.map((tip) => (
              <div key={tip.id} className="flex items-start gap-2">
                <Shield className="mt-0.5 h-3 w-3 flex-shrink-0 text-safe-green" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {tip.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
