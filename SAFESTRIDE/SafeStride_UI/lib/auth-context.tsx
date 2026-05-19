"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { authAPI, contactAPI, deviceAPI } from './api'
import type { User, Device, EmergencyContact } from './types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  addDevice: (device: Omit<Device, 'id' | 'userId'>) => void
  removeDevice: (deviceId: string) => void
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'userId'>) => void
  removeEmergencyContact: (contactId: string) => void
  updateEmergencyContact: (contactId: string, updates: Partial<EmergencyContact>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await authAPI.login({ email, password })
      if (data.user_id) {
        // Fetch contacts and devices
        let contacts: EmergencyContact[] = []
        let devices: Device[] = []
        try {
          const contactsData = await contactAPI.getAll(data.user_id)
          contacts = Array.isArray(contactsData) ? contactsData.map((c: any) => ({
            id: String(c.id),
            userId: String(data.user_id),
            name: c.name,
            phone: c.phone,
            email: c.email || '',
            relationship: 'Contact',
            isPrimary: c.priority_order === 1,
            notifyOnSOS: true,
            notifyOnCheckIn: false,
          })) : []
        } catch (e) { }
        try {
          const devicesData = await deviceAPI.getAll(data.user_id)
          devices = Array.isArray(devicesData) ? devicesData.map((d: any) => ({
            id: String(d.id),
            userId: String(data.user_id),
            name: d.device_name,
            type: 'tracker' as const,
            bluetoothId: d.mac_address,
            isConnected: d.is_connected,
            batteryLevel: d.battery_level,
            lastSyncAt: new Date(d.last_synced),
          })) : []
        } catch (e) { }

        setUser({
          id: String(data.user_id),
          email: email,
          name: data.name,
          phone: '',
          createdAt: new Date(),
          devices,
          emergencyContacts: contacts,
        })
        setIsLoading(false)
        return true
      }
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }, [])

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await authAPI.signup({ name, email, phone, password })
      if (data.id) {
        setUser({
          id: String(data.id),
          name: data.name,
          email: data.email,
          phone: data.phone,
          createdAt: new Date(data.created_at),
          devices: [],
          emergencyContacts: [],
        })
        setIsLoading(false)
        return true
      }
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Register error:', error)
      setIsLoading(false)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  const addDevice = useCallback(async (device: Omit<Device, 'id' | 'userId'>) => {
    if (!user) return
    try {
      const data = await deviceAPI.register(Number(user.id), {
        device_name: device.name,
        mac_address: device.bluetoothId || `BT-${Date.now()}`,
      })
      const newDevice: Device = {
        ...device,
        id: String(data.id),
        userId: user.id,
      }
      setUser(prev => prev ? { ...prev, devices: [...prev.devices, newDevice] } : null)
    } catch (error) {
      console.error('Add device error:', error)
    }
  }, [user])

  const removeDevice = useCallback((deviceId: string) => {
    setUser(prev => {
      if (!prev) return null
      return { ...prev, devices: prev.devices.filter(d => d.id !== deviceId) }
    })
  }, [])

  const addEmergencyContact = useCallback(async (contact: Omit<EmergencyContact, 'id' | 'userId'>) => {
    if (!user) return
    try {
      const data = await contactAPI.add(Number(user.id), {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        priority_order: contact.isPrimary ? 1 : 2,
      })
      const newContact: EmergencyContact = {
        ...contact,
        id: String(data.id),
        userId: user.id,
      }
      setUser(prev => prev ? { ...prev, emergencyContacts: [...prev.emergencyContacts, newContact] } : null)
    } catch (error) {
      console.error('Add contact error:', error)
    }
  }, [user])

  const removeEmergencyContact = useCallback(async (contactId: string) => {
    try {
      await contactAPI.delete(Number(contactId))
      setUser(prev => {
        if (!prev) return null
        return { ...prev, emergencyContacts: prev.emergencyContacts.filter(c => c.id !== contactId) }
      })
    } catch (error) {
      console.error('Remove contact error:', error)
    }
  }, [])

  const updateEmergencyContact = useCallback((contactId: string, updates: Partial<EmergencyContact>) => {
    setUser(prev => {
      if (!prev) return null
      return {
        ...prev,
        emergencyContacts: prev.emergencyContacts.map(c =>
          c.id === contactId ? { ...c, ...updates } : c
        ),
      }
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        addDevice,
        removeDevice,
        addEmergencyContact,
        removeEmergencyContact,
        updateEmergencyContact,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}