"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X, Phone, MapPin, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useSOS } from "@/lib/sos-context"
import { useLocation } from "@/lib/location-context"
import { useAuth } from "@/lib/auth-context"

interface SOSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SOSModal({ open, onOpenChange }: SOSModalProps) {
  const [countdown, setCountdown] = useState(5)
  const [isTriggered, setIsTriggered] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const { triggerSOS, cancelSOS, activeAlert, resolveSOS } = useSOS()
  const { currentLocation } = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    if (!open) {
      setCountdown(5)
      setIsTriggered(false)
      setIsCancelling(false)
      return
    }

    if (countdown > 0 && !isTriggered && !isCancelling) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }

    if (countdown === 0 && !isTriggered) {
      triggerSOS(currentLocation)
      setIsTriggered(true)
    }
  }, [open, countdown, isTriggered, isCancelling, triggerSOS, currentLocation])

  const handleCancel = () => {
    setIsCancelling(true)
    if (activeAlert) {
      cancelSOS()
    }
    onOpenChange(false)
  }

  const handleResolve = () => {
    resolveSOS()
    onOpenChange(false)
  }

  const emergencyContacts = user?.emergencyContacts.filter(c => c.notifyOnSOS) || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-alert-red">
            <AlertCircle className="h-6 w-6" />
            SOS Alert
          </DialogTitle>
          <DialogDescription className="text-center">
            {!isTriggered
              ? "Emergency alert will be sent automatically"
              : "Emergency contacts have been notified"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {!isTriggered ? (
            <>
              <div className="relative flex h-28 w-28 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-alert-red/20" />
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-alert-red text-primary-foreground">
                  <span className="text-4xl font-bold">{countdown}</span>
                </div>
              </div>

              <Progress value={(5 - countdown) * 20} className="h-2 w-full" />

              <p className="text-center text-sm text-muted-foreground">
                Tap cancel if this was a mistake
              </p>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Alert
              </Button>
            </>
          ) : (
            <>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-alert-red/10">
                <AlertCircle className="h-10 w-10 text-alert-red" />
              </div>

              <div className="w-full space-y-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    Location Shared
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentLocation?.address || "Current location sent to contacts"}
                  </p>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    Contacts Notified ({emergencyContacts.length})
                  </div>
                  <div className="space-y-1">
                    {emergencyContacts.map((contact) => (
                      <p key={contact.id} className="text-xs text-muted-foreground">
                        {contact.name} - {contact.phone}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex w-full gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleResolve}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  I&apos;m Safe
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => window.open('tel:911')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call 911
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
