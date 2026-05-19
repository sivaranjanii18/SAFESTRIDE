"use client"

import { useState } from "react"
import { MapPin, Send, Check, User } from "lucide-react"
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
import { useAuth } from "@/lib/auth-context"
import { useLocation } from "@/lib/location-context"
import { useSOS } from "@/lib/sos-context"

interface ShareLocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareLocationModal({ open, onOpenChange }: ShareLocationModalProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const { user } = useAuth()
  const { currentLocation, shareLocation } = useLocation()
  const { sendCheckIn } = useSOS()

  const contacts = user?.emergencyContacts || []

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    )
  }

  const selectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(contacts.map((c) => c.id))
    }
  }

  const handleShare = async () => {
    if (selectedContacts.length === 0) return

    setIsSending(true)
    await shareLocation(selectedContacts)
    await sendCheckIn(message || "I'm sharing my location with you.")
    setIsSending(false)
    setIsSent(true)

    setTimeout(() => {
      onOpenChange(false)
      setIsSent(false)
      setSelectedContacts([])
      setMessage("")
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-safe-green" />
            Share Location
          </DialogTitle>
          <DialogDescription>
            Send your current location to selected contacts
          </DialogDescription>
        </DialogHeader>

        {isSent ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-safe-green/10">
              <Check className="h-8 w-8 text-safe-green" />
            </div>
            <p className="text-center font-medium">Location Shared!</p>
            <p className="text-center text-sm text-muted-foreground">
              {selectedContacts.length} contact(s) notified
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-safe-green" />
                  Current Location
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentLocation?.address || "Location detected"}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Select Contacts</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectAll}
                    className="h-auto py-1 text-xs"
                  >
                    {selectedContacts.length === contacts.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>

                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <label
                      key={contact.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleContact(contact.id)}
                      />
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.relationship}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Add a message (optional)
                </label>
                <Textarea
                  placeholder="I'm on my way home..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleShare}
                disabled={selectedContacts.length === 0 || isSending}
                className="w-full bg-safe-green text-primary-foreground hover:bg-safe-green/90"
              >
                {isSending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Share with {selectedContacts.length || ""} Contact
                    {selectedContacts.length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
