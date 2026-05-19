"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { LocationProvider } from "@/lib/location-context"
import { SOSProvider } from "@/lib/sos-context"
import { Header } from "@/components/safestride/header"
import { SearchBar } from "@/components/safestride/search-bar"
import { SafetyHeroCard } from "@/components/safestride/safety-hero-card"
import { QuickActions } from "@/components/safestride/quick-actions"
import { InfoCards } from "@/components/safestride/info-cards"
import { RecentUpdates } from "@/components/safestride/recent-updates"
import { BottomNavigation, type TabId } from "@/components/safestride/bottom-navigation"
import { SOSModal } from "@/components/safestride/sos-modal"
import { ShareLocationModal } from "@/components/safestride/share-location-modal"
import { ReportIncidentModal } from "@/components/safestride/report-incident-modal"
import { NotificationsPanel } from "@/components/safestride/notifications-panel"
import { ChipView } from "@/components/safestride/views/chip-view"
import { SearchView } from "@/components/safestride/views/search-view"
import { ReportsView } from "@/components/safestride/views/reports-view"
import { ProfileView } from "@/components/safestride/views/profile-view"
import { MoreView } from "@/components/safestride/views/more-view"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"

function LoginPage() {
  const { login, register } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    const success = await login(email, password)
    if (!success) setError("Invalid email or password")
    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    setError("")
    const success = await register(name, email, phone, password)
    if (!success) setError("Signup failed. Email may already exist.")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">SafeStride</h1>
            <p className="text-sm text-muted-foreground">
              {isSignup ? "Create your account" : "Welcome back"}
            </p>
          </div>

          <div className="space-y-4">
            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (isSignup ? handleSignup() : handleLogin())} />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" onClick={isSignup ? handleSignup : handleLogin} disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button className="text-primary font-medium" onClick={() => { setIsSignup(!isSignup); setError("") }}>
                {isSignup ? "Log In" : "Sign Up"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SafeStrideApp() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [sosModalOpen, setSosModalOpen] = useState(false)
  const [shareLocationOpen, setShareLocationOpen] = useState(false)
  const [reportIncidentOpen, setReportIncidentOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col gap-5 pb-24 pt-4">
            <SafetyHeroCard />
            <QuickActions
              onSOSClick={() => setSosModalOpen(true)}
              onShareLocationClick={() => setShareLocationOpen(true)}
              onReportIncidentClick={() => setReportIncidentOpen(true)}
            />
            <InfoCards />
            <RecentUpdates />
          </div>
        )
      case 'chip':
        return <ChipView />
      case 'search':
        return <SearchView />
      case 'reports':
        return <ReportsView />
      case 'profile':
        return <ProfileView />
      case 'more':
        return <MoreView />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNotificationsClick={() => setNotificationsOpen(true)}
        onProfileClick={() => setActiveTab('profile')}
      />
      <main className="mx-auto max-w-md">{renderContent()}</main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <SOSModal open={sosModalOpen} onOpenChange={setSosModalOpen} />
      <ShareLocationModal open={shareLocationOpen} onOpenChange={setShareLocationOpen} />
      <ReportIncidentModal open={reportIncidentOpen} onOpenChange={setReportIncidentOpen} />
      <NotificationsPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <LocationProvider>
        <SOSProvider>
          <SafeStrideApp />
        </SOSProvider>
      </LocationProvider>
    </AuthProvider>
  )
}