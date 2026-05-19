"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Clock, Star, Filter, Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { searchAPI, aiAPI, analyticsAPI } from "@/lib/api"

interface SearchResult {
  id: string
  name: string
  address: string
  distance: string
  safetyRating: number
  type: 'location' | 'route' | 'zone'
  tags: string[]
  latitude: number
  longitude: number
  riskLabel: number
}

interface HeatmapPoint {
  lat: number
  lng: number
  risk: number
  location: string
}

interface AISafety {
  overall_risk: number
  overall_level: string
  time_breakdown: {
    time: string
    scenario: string
    risk_score: number
    risk_level: string
  }[]
}

const recentSearches = ['T Nagar', 'Anna Nagar', 'Velachery', 'Koyambedu']

export function SearchView() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([])
  const [aiSafety, setAiSafety] = useState<AISafety | null>(null)
  const [timeRisk, setTimeRisk] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  // Load heatmap data on mount
  useEffect(() => {
    loadHeatmap()
  }, [])

  const loadHeatmap = async () => {
    try {
      const data = await searchAPI.heatmap()
      if (Array.isArray(data)) {
        setHeatmapData(data)
      }
    } catch (error) {
      console.error('Heatmap load error:', error)
    }
  }

  // Render map with Leaflet
  useEffect(() => {
    if (!mapRef.current || heatmapData.length === 0) return
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const loadMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      const map = L.map(mapRef.current!, {
        center: [13.0827, 80.2707],
        zoom: 12,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Add markers with color based on risk
      heatmapData.forEach((point) => {
        const color = point.risk >= 0.7 ? '#ef4444' : point.risk >= 0.5 ? '#f59e0b' : '#22c55e'
        const radius = point.risk >= 0.7 ? 12 : point.risk >= 0.5 ? 9 : 6

        L.circleMarker([point.lat, point.lng], {
          radius: radius,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.5,
        }).addTo(map).bindPopup(
          `<b>${point.location}</b><br/>Risk: ${(point.risk * 100).toFixed(0)}%`
        )
      })

      mapInstanceRef.current = map
      setMapLoaded(true)

      setTimeout(() => map.invalidateSize(), 100)
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [heatmapData])

  // Focus map on search results
  useEffect(() => {
    if (!mapInstanceRef.current || results.length === 0) return

    const firstResult = results[0]
    mapInstanceRef.current.setView([firstResult.latitude, firstResult.longitude], 14)

    // Add highlighted markers for search results
    results.forEach((r) => {
      const L = require('leaflet')
      L.marker([r.latitude, r.longitude], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; white-space: nowrap; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${r.name}</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        })
      }).addTo(mapInstanceRef.current)
    })
  }, [results])

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    setIsSearching(true)
    setSearched(true)
    setAiSafety(null)
    setTimeRisk(null)

    try {
      const data = await searchAPI.search(searchQuery)

      if (data.data && data.data.length > 0) {
        const mapped: SearchResult[] = data.data.map((item: any, index: number) => ({
          id: String(index),
          name: item.location,
          address: item.report_text,
          distance: item.time,
          safetyRating: Math.round((1 - item.risk_label) * 5 * 10) / 10,
          type: 'location' as const,
          tags: [
            item.risk_label >= 0.7 ? 'High Risk' : item.risk_label >= 0.5 ? 'Medium Risk' : 'Low Risk',
            item.heel_tap === 1 ? 'SOS Triggered' : 'Report',
          ],
          latitude: item.latitude,
          longitude: item.longitude,
          riskLabel: item.risk_label,
        }))
        setResults(mapped)

        const firstResult = data.data[0]
        try {
          const aiData = await aiAPI.areaSafety(firstResult.latitude, firstResult.longitude)
          setAiSafety(aiData)
        } catch (e) { }

        try {
          const timeData = await analyticsAPI.timeRisk(searchQuery)
          setTimeRisk(timeData)
        } catch (e) { }
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    }

    setIsSearching(false)
  }

  const getSafetyColor = (rating: number) => {
    if (rating >= 3.5) return 'text-green-500'
    if (rating >= 2.5) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getRiskBadgeColor = (risk: number) => {
    if (risk >= 0.7) return 'bg-red-100 text-red-800'
    if (risk >= 0.5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div>
        <h1 className="text-xl font-semibold">Search & Safety Map</h1>
        <p className="text-sm text-muted-foreground">
          Find locations and check safety with AI
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search locations (e.g. T Nagar, Anna Nagar)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => handleSearch(query)}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Heatmap */}
      <Card>
        <CardContent className="p-0 overflow-hidden rounded-lg">
          <div ref={mapRef} style={{ height: '300px', width: '100%' }} />
          <div className="p-3 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Low</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Medium</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> High</span>
            </div>
            <span className="text-xs text-muted-foreground">{heatmapData.length} incidents</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Search */}
      {!searched && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Quick Search
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Button key={index} variant="outline" size="sm" className="h-auto py-1.5 text-xs"
                  onClick={() => handleSearch(search)}>
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isSearching && (
        <div className="text-center py-8 text-muted-foreground">
          Searching and analyzing with AI...
        </div>
      )}

      {/* AI Safety Analysis */}
      {aiSafety && (
        <Card className={`border-2 ${aiSafety.overall_level === 'high' ? 'border-red-300' : aiSafety.overall_level === 'medium' ? 'border-yellow-300' : 'border-green-300'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5" />
              <h3 className="font-semibold">AI Safety Analysis</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`text-2xl font-bold ${aiSafety.overall_level === 'high' ? 'text-red-500' : aiSafety.overall_level === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                {aiSafety.overall_level.toUpperCase()} RISK
              </div>
              <div className="text-sm text-muted-foreground">Score: {aiSafety.overall_risk}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {aiSafety.time_breakdown.map((tb, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-xs">{tb.time}</span>
                  <Badge className={`text-[10px] ${getRiskBadgeColor(tb.risk_score)}`}>{tb.risk_level}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time-Based Analysis */}
      {timeRisk && timeRisk.recommendation && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <h3 className="font-medium text-sm">Safety Recommendation</h3>
            </div>
            <p className="text-sm text-muted-foreground">{timeRisk.recommendation}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searched && !isSearching && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{results.length} incidents found</p>
          {results.map((result) => (
            <Card key={result.id} className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{result.name}</h3>
                      <div className={`flex items-center gap-0.5 ${getSafetyColor(result.safetyRating)}`}>
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-sm font-medium">{result.safetyRating}</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {result.address}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {result.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className={`text-[10px] ${tag === 'High Risk' ? 'bg-red-100 text-red-800' : tag === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' : tag === 'SOS Triggered' ? 'bg-red-100 text-red-800' : ''}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-muted-foreground">{result.distance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}