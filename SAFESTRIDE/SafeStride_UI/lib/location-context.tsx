"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { locationAPI, aiAPI } from './api'
import type { Location, SafetyScore } from './types'

interface LocationContextType {
  currentLocation: Location | null
  isTracking: boolean
  safetyScore: SafetyScore
  lastChecked: Date
  startTracking: () => void
  stopTracking: () => void
  shareLocation: (contactIds: string[]) => Promise<boolean>
  refreshSafetyScore: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const defaultSafetyScore: SafetyScore = {
  overall: 78,
  areaScore: 82,
  timeScore: 75,
  recentIncidents: 2,
  lastUpdated: new Date(),
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [safetyScore, setSafetyScore] = useState<SafetyScore>(defaultSafetyScore)
  const [lastChecked, setLastChecked] = useState(new Date())

  // Get real GPS location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
            address: 'Current Location',
          }
          setCurrentLocation(loc)

          // Get AI safety score for current location
          aiAPI.areaSafety(loc.latitude, loc.longitude)
            .then((data) => {
              const riskToSafety = Math.round((1 - data.overall_risk) * 100)
              setSafetyScore({
                overall: riskToSafety,
                areaScore: riskToSafety,
                timeScore: Math.round((1 - (data.time_breakdown?.[2]?.risk_score || 0.5)) * 100),
                recentIncidents: data.time_breakdown?.length || 0,
                lastUpdated: new Date(),
              })
              setLastChecked(new Date())
            })
            .catch(() => {})
        },
        () => {
          // Fallback to Chennai if GPS not available
          setCurrentLocation({
            latitude: 13.0827,
            longitude: 80.2707,
            accuracy: 10,
            timestamp: new Date(),
            address: 'Chennai, Tamil Nadu',
          })
        }
      )
    }
  }, [])

  // Live tracking - send location to backend every 30 seconds
  useEffect(() => {
    if (!isTracking || !currentLocation) return

    const interval = setInterval(() => {
      navigator.geolocation?.getCurrentPosition(
        async (position) => {
          const newLoc: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
            address: currentLocation.address,
          }
          setCurrentLocation(newLoc)
          setLastChecked(new Date())

          // Send to backend
          try {
            await locationAPI.update(1, newLoc.latitude, newLoc.longitude)
          } catch (error) {
            console.error('Location update error:', error)
          }
        }
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [isTracking, currentLocation])

  const startTracking = useCallback(() => {
    setIsTracking(true)
  }, [])

  const stopTracking = useCallback(() => {
    setIsTracking(false)
  }, [])

  const shareLocation = useCallback(async (contactIds: string[]) => {
    console.log('Sharing location with contacts:', contactIds)
    return true
  }, [])

  const refreshSafetyScore = useCallback(async () => {
    if (!currentLocation) return

    try {
      const data = await aiAPI.areaSafety(currentLocation.latitude, currentLocation.longitude)
      const riskToSafety = Math.round((1 - data.overall_risk) * 100)
      setSafetyScore({
        overall: riskToSafety,
        areaScore: riskToSafety,
        timeScore: Math.round((1 - (data.time_breakdown?.[2]?.risk_score || 0.5)) * 100),
        recentIncidents: data.time_breakdown?.length || 0,
        lastUpdated: new Date(),
      })
      setLastChecked(new Date())
    } catch (error) {
      console.error('Refresh safety score error:', error)
    }
  }, [currentLocation])

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isTracking,
        safetyScore,
        lastChecked,
        startTracking,
        stopTracking,
        shareLocation,
        refreshSafetyScore,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}