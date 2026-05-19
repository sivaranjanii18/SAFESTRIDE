"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  Shield,
  Users,
  Smartphone,
  Bell,
  Lock,
  ChevronRight,
  Edit,
  Plus,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export function ProfileView() {
  const { user, addEmergencyContact, removeEmergencyContact, logout } = useAuth()
  const [addContactOpen, setAddContactOpen] = useState(false)
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  })

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      addEmergencyContact({
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship || 'Other',
        isPrimary: false,
        notifyOnSOS: true,
        notifyOnCheckIn: false,
      })
      setNewContact({ name: '', phone: '', relationship: '' })
      setAddContactOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="bg-safe-green/10 text-safe-green">
                  <Shield className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Phone</p>
              <p className="text-xs text-muted-foreground">{user?.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Emergency Contacts
            </CardTitle>
            <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>
                    Add someone who should be notified in case of emergency
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Contact name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="+91 98765 12345"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Input
                      placeholder="e.g., Sister, Friend, Parent"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddContact} disabled={!newContact.name || !newContact.phone}>
                    Add Contact
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            {user?.emergencyContacts.length || 0} contacts configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {user?.emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{contact.name}</p>
                    {contact.isPrimary && (
                      <Badge variant="secondary" className="text-[10px]">Primary</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {contact.relationship} - {contact.phone}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => removeEmergencyContact(contact.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <button className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Notifications</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Privacy & Security</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Connected Devices</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button
        variant="outline"
        className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={logout}
      >
        Sign Out
      </Button>
    </div>
  )
}
