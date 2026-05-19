"use client"

import { useState } from "react"
import { FileWarning, MapPin, Check, AlertTriangle, User, Car, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocation } from "@/lib/location-context"
import type { Incident } from "@/lib/types"

interface ReportIncidentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const incidentTypes = [
  { value: 'unsafe_area', label: 'Unsafe Area', icon: AlertTriangle },
  { value: 'harassment', label: 'Harassment', icon: User },
  { value: 'theft', label: 'Theft', icon: Eye },
  { value: 'accident', label: 'Accident', icon: Car },
  { value: 'other', label: 'Other', icon: FileWarning },
] as const

export function ReportIncidentModal({ open, onOpenChange }: ReportIncidentModalProps) {
  const [type, setType] = useState<Incident['type']>('unsafe_area')
  const [severity, setSeverity] = useState<Incident['severity']>('medium')
  const [description, setDescription] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { currentLocation } = useLocation()

  const handleSubmit = async () => {
    if (!description.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    // Send report to backend
    try {
      const { communityAPI } = await import("@/lib/api")
      await communityAPI.report(
        1,
        currentLocation?.address || "Unknown Location",
        currentLocation?.latitude || 13.0827,
        currentLocation?.longitude || 80.2707,
        `${type}: ${description}`,
        severity === 'high' ? 0.8 : severity === 'medium' ? 0.6 : 0.4
      )
    } catch (error) {
      console.error('Report error:', error)
    }
    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      onOpenChange(false)
      setIsSubmitted(false)
      setDescription("")
      setType('unsafe_area')
      setSeverity('medium')
      setIsAnonymous(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-warning-yellow" />
            Report Incident
          </DialogTitle>
          <DialogDescription>
            Help keep the community safe by reporting incidents
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-safe-green/10">
              <Check className="h-8 w-8 text-safe-green" />
            </div>
            <p className="text-center font-medium">Report Submitted!</p>
            <p className="text-center text-sm text-muted-foreground">
              Thank you for helping keep the community safe
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  Report Location
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentLocation?.address || "Current location will be used"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Incident Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as Incident['type'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((item) => {
                      const Icon = item.icon
                      return (
                        <SelectItem key={item.value} value={item.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severity Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={severity === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSeverity(level)}
                      className={
                        severity === level
                          ? level === 'high'
                            ? 'bg-alert-red hover:bg-alert-red/90'
                            : level === 'medium'
                            ? 'bg-warning-yellow text-foreground hover:bg-warning-yellow/90'
                            : 'bg-safe-green hover:bg-safe-green/90'
                          : ''
                      }
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what happened..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                />
                <Label htmlFor="anonymous" className="text-sm font-normal">
                  Submit anonymously
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={!description.trim() || isSubmitting}
                className="w-full bg-warning-yellow text-foreground hover:bg-warning-yellow/90"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
