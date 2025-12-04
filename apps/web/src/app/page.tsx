'use client'

import { useState } from 'react'
import { MapView } from '@/components/map/MapView'
import { StationList } from '@/components/stations/StationList'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { VehicleSelector } from '@/components/vehicle/VehicleSelector'
import { useStations } from '@/hooks/useStations'
import { useUserLocation } from '@/hooks/useUserLocation'
import { useAppStore } from '@/store/appStore'

export default function HomePage() {
  const { location } = useUserLocation()
  const selectedVehicle = useAppStore((state) => state.selectedVehicle)
  const filters = useAppStore((state) => state.filters)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const { data: stations, isLoading } = useStations({
    lat: location?.latitude || 12.9716, // Default to Bangalore
    lng: location?.longitude || 77.5946,
    radius_km: 10,
    vehicle_id: selectedVehicle?.id,
    ...filters,
  })

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚡</div>
              <h1 className="text-xl font-bold text-gray-900">
                EVCharge India
              </h1>
            </div>
            <VehicleSelector />
          </div>
          <SearchBar />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: Side panel with filters and list */}
        <div className="hidden lg:flex lg:w-[480px] flex-col border-r border-gray-200 bg-gray-50">
          <FilterPanel />
          <div className="flex-1 overflow-y-auto">
            <StationList stations={stations?.data || []} isLoading={isLoading} />
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 relative">
          <MapView
            stations={stations?.data || []}
            center={
              location
                ? [location.longitude, location.latitude]
                : [77.5946, 12.9716]
            }
          />

          {/* Mobile: Toggle View Buttons */}
          <div className="lg:hidden absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 bg-white rounded-full shadow-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🗺️ Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📋 List
            </button>
          </div>
        </div>

        {/* Mobile: Full-screen list overlay */}
        {viewMode === 'list' && (
          <div className="lg:hidden absolute inset-0 bg-white z-20 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <FilterPanel />
            </div>
            <div className="flex-1 overflow-y-auto">
              <StationList stations={stations?.data || []} isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {stations?.data && stations.data.length > 0 && (
        <div className="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-600 text-center">
          Showing {stations.data.length} stations
          {selectedVehicle && (
            <span className="ml-2 text-primary-600 font-medium">
              compatible with {selectedVehicle.brand} {selectedVehicle.model}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

