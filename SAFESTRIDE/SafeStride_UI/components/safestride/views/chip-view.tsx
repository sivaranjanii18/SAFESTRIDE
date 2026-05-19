"use client"

import { useState } from "react"
import {
  Cpu,
  Bluetooth,
  Battery,
  Wifi,
  RefreshCw,
  Signal,
  MapPin,
  BatteryCharging,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { formatDistanceToNow } from "date-fns"

// SafeStride Chip data
const chipData = {
  id: 'SS-CHIP-001',
  name: 'SafeStride Chip',
  batteryLevel: 78,
  isConnected: true,
  isCharging: false,
  signalStrength: 'Strong',
  lastSyncAt: new Date(Date.now() - 1000 * 60 * 5),
  firmwareVersion: '2.1.4',
  lastLocation: 'T. Nagar, Chennai',
}

export function ChipView() {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSyncing(false)
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-safe-green'
    if (level > 20) return 'text-warning-yellow'
    return 'text-alert-red'
  }

  const getBatteryBgColor = (level: number) => {
    if (level > 50) return 'bg-safe-green'
    if (level > 20) return 'bg-warning-yellow'
    return 'bg-alert-red'
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div>
        <h1 className="text-xl font-semibold">SafeStride Chip</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your chip status and battery
        </p>
      </div>

      {/* Chip Battery Card - Main Focus */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              {chipData.name}
            </span>
            <Badge
              variant={chipData.isConnected ? 'default' : 'secondary'}
              className={chipData.isConnected ? 'bg-safe-green text-primary-foreground' : ''}
            >
              {chipData.isConnected ? 'Connected' : 'Offline'}
            </Badge>
          </CardTitle>
          <CardDescription>ID: {chipData.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Battery Display */}
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <svg className="h-24 w-24 -rotate-90 transform">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * chipData.batteryLevel) / 100}
                  className={getBatteryColor(chipData.batteryLevel)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                {chipData.isCharging ? (
                  <BatteryCharging className={`h-6 w-6 ${getBatteryColor(chipData.batteryLevel)}`} />
                ) : (
                  <Battery className={`h-6 w-6 ${getBatteryColor(chipData.batteryLevel)}`} />
                )}
                <span className={`text-xl font-bold ${getBatteryColor(chipData.batteryLevel)}`}>
                  {chipData.batteryLevel}%
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {chipData.isCharging ? 'Charging...' : 'Battery Level'}
            </p>
          </div>

          {/* Chip Stats */}
          <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-safe-green">
                <Signal className="h-4 w-4" />
              </div>
              <p className="mt-1 text-xs font-medium">{chipData.signalStrength}</p>
              <p className="text-[10px] text-muted-foreground">Signal</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary">
                <Bluetooth className="h-4 w-4" />
              </div>
              <p className="mt-1 text-xs font-medium">Active</p>
              <p className="text-[10px] text-muted-foreground">Bluetooth</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-safe-green">
                <Wifi className="h-4 w-4" />
              </div>
              <p className="mt-1 text-xs font-medium">Online</p>
              <p className="text-[10px] text-muted-foreground">Network</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Known Location */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Last Known Location</p>
              <p className="text-xs text-muted-foreground">{chipData.lastLocation}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(chipData.lastSyncAt, { addSuffix: true })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sync Button */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Last Synced</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(chipData.lastSyncAt, { addSuffix: true })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Device Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-sync Location</p>
              <p className="text-xs text-muted-foreground">
                Sync location data in background
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Low Battery Alerts</p>
              <p className="text-xs text-muted-foreground">
                Notify when device battery is low
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Bluetooth Auto-connect</p>
              <p className="text-xs text-muted-foreground">
                Automatically connect nearby devices
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Data Storage Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="h-4 w-4" />
            Data Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Location History</span>
              <span className="text-muted-foreground">2.3 MB / 10 MB</span>
            </div>
            <Progress value={23} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Incident Reports</span>
              <span className="text-muted-foreground">856 KB / 5 MB</span>
            </div>
            <Progress value={17} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Analytics Data</span>
              <span className="text-muted-foreground">1.1 MB / 5 MB</span>
            </div>
            <Progress value={22} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
