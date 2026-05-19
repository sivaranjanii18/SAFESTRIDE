"use client"

import { useState, useEffect } from "react"
import { FileText, AlertTriangle, MapPin, Clock, Shield, TrendingUp, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reportAPI, sosAPI, communityAPI } from "@/lib/api"

interface ReportSummary {
  total_alerts: number
  heel_tap_alerts: number
  fall_detected_alerts: number
  resolved: number
  cancelled: number
}

interface Hotspot {
  location: string
  incident_count: number
  average_risk: number
  latitude: number
  longitude: number
}

export function ReportsView() {
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateReport, setShowCreateReport] = useState(false)
  const [reportLocation, setReportLocation] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportRisk, setReportRisk] = useState("0.6")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [summaryData, historyData, hotspotsData] = await Promise.all([
        reportAPI.summary(1).catch(() => null),
        sosAPI.history(1).catch(() => []),
        communityAPI.hotspots().catch(() => ({ hotspots: [] })),
      ])

      if (summaryData) setSummary(summaryData)
      if (Array.isArray(historyData)) setHistory(historyData)
      if (hotspotsData?.hotspots) setHotspots(hotspotsData.hotspots)
    } catch (error) {
      console.error('Load reports error:', error)
    }
    setIsLoading(false)
  }

  const handleSubmitReport = async () => {
    if (!reportLocation.trim() || !reportDescription.trim()) return
    setIsSubmitting(true)
    try {
      await communityAPI.report(
        1,
        reportLocation,
        13.0827,
        80.2707,
        reportDescription,
        parseFloat(reportRisk)
      )
      setSubmitSuccess(true)
      setReportLocation("")
      setReportDescription("")
      setReportRisk("0.6")
      setTimeout(() => {
        setSubmitSuccess(false)
        setShowCreateReport(false)
      }, 2000)
      loadData()
    } catch (error) {
      console.error('Submit report error:', error)
    }
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Your safety summary and incident history
          </p>
        </div>
        <Button onClick={() => setShowCreateReport(!showCreateReport)} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Report
        </Button>
      </div>

      {/* Create Report Form */}
      {showCreateReport && (
        <Card className="border-2 border-primary/30">
          <CardContent className="p-4">
            {submitSuccess ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium text-green-600">Report Submitted!</p>
                <p className="text-sm text-muted-foreground">Thank you for keeping the community safe</p>
              </div>
            ) : (
              <>
                <h2 className="text-base font-semibold mb-3">Create a Report</h2>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input
                      placeholder="e.g. T Nagar, Anna Nagar, Velachery"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>What happened?</Label>
                    <Textarea
                      placeholder="Describe the incident or unsafe situation..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Risk Level</Label>
                    <Select value={reportRisk} onValueChange={setReportRisk}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.4">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Low Risk
                          </span>
                        </SelectItem>
                        <SelectItem value="0.6">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            Medium Risk
                          </span>
                        </SelectItem>
                        <SelectItem value="0.8">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            High Risk
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={handleSubmitReport}
                      disabled={!reportLocation.trim() || !reportDescription.trim() || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateReport(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{summary.total_alerts}</div>
              <div className="text-xs text-muted-foreground">Total Alerts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{summary.resolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{summary.heel_tap_alerts}</div>
              <div className="text-xs text-muted-foreground">Heel Tap SOS</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{summary.fall_detected_alerts}</div>
              <div className="text-xs text-muted-foreground">Fall Detected</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Danger Hotspots */}
      {hotspots.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Danger Hotspots</h2>
          <div className="space-y-2">
            {hotspots.slice(0, 5).map((spot, index) => (
              <Card key={index}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{spot.location}</p>
                      <p className="text-xs text-muted-foreground">{spot.incident_count} incidents</p>
                    </div>
                  </div>
                  <Badge className={`${spot.average_risk >= 0.7 ? 'bg-red-100 text-red-800' : spot.average_risk >= 0.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    Risk: {spot.average_risk}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SOS History */}
      <div>
        <h2 className="text-lg font-semibold mb-3">SOS History</h2>
        {history.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-10 w-10 mx-auto mb-3 text-green-500" />
              <p className="text-sm text-muted-foreground">No SOS alerts yet. Stay safe!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {history.map((alert, index) => (
              <Card key={index}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${alert.status === 'resolved' ? 'text-green-500' : alert.status === 'cancelled' ? 'text-yellow-500' : 'text-red-500'}`} />
                      <span className="font-medium text-sm capitalize">{alert.alert_type?.replace('_', ' ')}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] capitalize">{alert.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {new Date(alert.triggered_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button variant="outline" onClick={loadData} className="w-full">
        Refresh Reports
      </Button>
    </div>
  )
}