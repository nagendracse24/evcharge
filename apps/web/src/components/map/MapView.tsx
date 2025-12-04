'use client'

import { useRef, useEffect } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import { StationWithDetails } from '@evcharge/shared'

interface MapViewProps {
  stations: StationWithDetails[]
  center?: [number, number]
  onStationClick?: (station: StationWithDetails) => void
}

const MAPLIBRE_STYLE = process.env.NEXT_PUBLIC_MAPLIBRE_STYLE_URL || 
  'https://tiles.openfreemap.org/styles/liberty'

export function MapView({ stations, center = [77.5946, 12.9716], onStationClick }: MapViewProps) {
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (mapRef.current && stations.length > 0) {
      // Fit bounds to show all stations
      const bounds = stations.reduce(
        (acc, station) => {
          return {
            minLat: Math.min(acc.minLat, station.latitude),
            maxLat: Math.max(acc.maxLat, station.latitude),
            minLng: Math.min(acc.minLng, station.longitude),
            maxLng: Math.max(acc.maxLng, station.longitude),
          }
        },
        { minLat: Infinity, maxLat: -Infinity, minLng: Infinity, maxLng: -Infinity }
      )

      if (bounds.minLat !== Infinity) {
        mapRef.current.fitBounds(
          [
            [bounds.minLng, bounds.minLat],
            [bounds.maxLng, bounds.maxLat],
          ],
          {
            padding: 50,
            duration: 1000,
          }
        )
      }
    }
  }, [stations])

  const getMarkerColor = (station: StationWithDetails) => {
    if (station.compatibility_status === 'compatible') return '#10b981' // green
    if (station.compatibility_status === 'partial') return '#f59e0b' // orange
    if (station.compatibility_status === 'incompatible') return '#ef4444' // red
    return '#0ea5e9' // blue (default)
  }

  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      initialViewState={{
        longitude: center[0],
        latitude: center[1],
        zoom: 12,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={MAPLIBRE_STYLE}
    >
      <NavigationControl position="top-right" />

      {/* Station Markers */}
      {stations.map((station) => (
        <Marker
          key={station.id}
          longitude={station.longitude}
          latitude={station.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            onStationClick?.(station)
          }}
        >
          <div
            className="cursor-pointer hover:scale-110 transition-transform"
            style={{
              width: 32,
              height: 32,
              background: getMarkerColor(station),
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ transform: 'rotate(45deg)', fontSize: '14px' }}>⚡</div>
          </div>
        </Marker>
      ))}

      {/* User Location Marker */}
      <Marker longitude={center[0]} latitude={center[1]} anchor="center">
        <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
      </Marker>
    </Map>
  )
}

