"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { sosAPI, communityAPI } from './api'
import type { SOSAlert, Location, Notification } from './types'

interface SOSContextType {
  activeAlert: SOSAlert | null
  alertHistory: SOSAlert[]
  notifications: Notification[]
  unreadCount: number
  triggerSOS: (location: Location | null) => Promise<SOSAlert>
  cancelSOS: () => void
  resolveSOS: (notes?: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  sendCheckIn: (message?: string) => Promise<boolean>
}

const SOSContext = createContext<SOSContextType | undefined>(undefined)

export function SOSProvider({ children }: { children: ReactNode }) {
  const [activeAlert, setActiveAlert] = useState<SOSAlert | null>(null)
  const [alertHistory, setAlertHistory] = useState<SOSAlert[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const triggerSOS = useCallback(async (location: Location | null): Promise<SOSAlert> => {
    const lat = location?.latitude || 13.0827
    const lng = location?.longitude || 80.2707

    // Call your FastAPI backend
    try {
      const data = await sosAPI.trigger(1, 1, "heel_tap", lat, lng)

      const alert: SOSAlert = {
        id: String(data.alert_id),
        userId: '1',
        location: location || {
          latitude: lat,
          longitude: lng,
          accuracy: 10,
          timestamp: new Date(),
        },
        status: 'active',
        type: 'sos',
        triggeredAt: new Date(),
        notifiedContacts: data.contacts_notified || [],
      }

      setActiveAlert(alert)

      // Add notification
      const notification: Notification = {
        id: String(Date.now()),
        userId: '1',
        type: 'sos',
        title: 'SOS Alert Triggered',
        message: `Emergency contacts notified: ${(data.contacts_notified || []).join(', ')}`,
        isRead: false,
        createdAt: new Date(),
      }
      setNotifications(prev => [notification, ...prev])

      return alert
    } catch (error) {
      console.error('SOS trigger error:', error)
      // Fallback alert even if API fails
      const fallbackAlert: SOSAlert = {
        id: String(Date.now()),
        userId: '1',
        location: location || { latitude: lat, longitude: lng, accuracy: 10, timestamp: new Date() },
        status: 'active',
        type: 'sos',
        triggeredAt: new Date(),
        notifiedContacts: [],
      }
      setActiveAlert(fallbackAlert)
      return fallbackAlert
    }
  }, [])

  const cancelSOS = useCallback(async () => {
    if (activeAlert) {
      try {
        await sosAPI.cancel(Number(activeAlert.id))
      } catch (error) {
        console.error('Cancel SOS error:', error)
      }
      setAlertHistory(prev => [...prev, { ...activeAlert, status: 'cancelled' }])
      setActiveAlert(null)

      const notification: Notification = {
        id: String(Date.now()),
        userId: '1',
        type: 'info',
        title: 'SOS Cancelled',
        message: 'Your emergency alert has been cancelled.',
        isRead: false,
        createdAt: new Date(),
      }
      setNotifications(prev => [notification, ...prev])
    }
  }, [activeAlert])

  const resolveSOS = useCallback(async (notes?: string) => {
    if (activeAlert) {
      try {
        await sosAPI.resolve(Number(activeAlert.id))
      } catch (error) {
        console.error('Resolve SOS error:', error)
      }
      const resolved = {
        ...activeAlert,
        status: 'resolved' as const,
        resolvedAt: new Date(),
        notes,
      }
      setAlertHistory(prev => [...prev, resolved])
      setActiveAlert(null)

      const notification: Notification = {
        id: String(Date.now()),
        userId: '1',
        type: 'info',
        title: 'SOS Resolved',
        message: 'Your emergency alert has been resolved. Contacts notified.',
        isRead: false,
        createdAt: new Date(),
      }
      setNotifications(prev => [notification, ...prev])
    }
  }, [activeAlert])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }, [])

  const sendCheckIn = useCallback(async (message?: string) => {
    const notification: Notification = {
      id: String(Date.now()),
      userId: '1',
      type: 'info',
      title: 'Check-in Sent',
      message: message || 'Your contacts have been notified that you\'re safe.',
      isRead: false,
      createdAt: new Date(),
    }
    setNotifications(prev => [notification, ...prev])
    return true
  }, [])

  return (
    <SOSContext.Provider
      value={{
        activeAlert,
        alertHistory,
        notifications,
        unreadCount,
        triggerSOS,
        cancelSOS,
        resolveSOS,
        markNotificationRead,
        markAllNotificationsRead,
        sendCheckIn,
      }}
    >
      {children}
    </SOSContext.Provider>
  )
}

export function useSOS() {
  const context = useContext(SOSContext)
  if (context === undefined) {
    throw new Error('useSOS must be used within a SOSProvider')
  }
  return context
}