// SafeStride Type Definitions

export interface User {
  id: string
  email: string
  name: string
  phone: string
  avatar?: string
  createdAt: Date
  devices: Device[]
  emergencyContacts: EmergencyContact[]
}

export interface Device {
  id: string
  userId: string
  name: string
  type: 'smartphone' | 'smartwatch' | 'tracker'
  bluetoothId?: string
  isConnected: boolean
  batteryLevel: number
  lastSyncAt: Date
}

export interface EmergencyContact {
  id: string
  userId: string
  name: string
  phone: string
  email?: string
  relationship: string
  isPrimary: boolean
  notifyOnSOS: boolean
  notifyOnCheckIn: boolean
}

export interface Location {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
  address?: string
}

export interface SOSAlert {
  id: string
  userId: string
  location: Location
  status: 'active' | 'resolved' | 'cancelled'
  type: 'sos' | 'check_in' | 'timer'
  triggeredAt: Date
  resolvedAt?: Date
  notifiedContacts: string[]
  audioRecordingUrl?: string
  notes?: string
}

export interface Incident {
  id: string
  userId: string
  type: 'unsafe_area' | 'harassment' | 'theft' | 'accident' | 'other'
  description: string
  location: Location
  severity: 'low' | 'medium' | 'high'
  reportedAt: Date
  status: 'pending' | 'reviewed' | 'resolved'
  isAnonymous: boolean
  attachments?: string[]
}

export interface SafetyScore {
  overall: number
  areaScore: number
  timeScore: number
  recentIncidents: number
  lastUpdated: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'alert' | 'info' | 'reminder' | 'sos'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  details: string
  timestamp: Date
  location?: Location
}

export interface SafetyTip {
  id: string
  title: string
  content: string
  category: string
  priority: number
}

export interface AnalyticsData {
  totalReports: number
  safetyScore: number
  emergencyContactsCount: number
  checkInsThisWeek: number
  lastSOSDate?: Date
  mostActiveTime: string
  safeZonesVisited: number
}

// AI Model Types
export interface SafetyPredictionRequest {
  latitude: number
  longitude: number
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: string
  userId?: string
}

export interface SafetyPredictionResponse {
  safetyScore: number
  riskFactors: string[]
  recommendation: string
  confidence: number
  predictedAt: Date
}

export interface HeatmapDataPoint {
  id: string
  latitude: number
  longitude: number
  safetyScore: number
  intensity: number // 0-1 scale for heatmap
  incidentCount: number
  lastUpdated: Date
}

export interface HeatmapResponse {
  data: HeatmapDataPoint[]
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
  generatedAt: Date
}

export interface SafetyZone {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number // in meters
  safetyScore: number
  type: 'safe' | 'caution' | 'avoid'
  factors: string[]
}
export default function Home() {
  return (
    <div>
    <h1>Smart Safety Dashboard </h1>

      < iframe
  src = "aiheatmap-da5m7mm7eevyc98e8jtthj.streamlit.app"
  width = "100%"
  height = "700px"
  style = {{ border: "none" }
}
      > </iframe>
  </div>
  );
}