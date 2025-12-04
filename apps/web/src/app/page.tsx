'use client'

import { useState } from 'react'
import { MapView } from '@/components/map/MapView'
import { StationList } from '@/components/stations/StationList'
import { StationDetailPanel } from '@/components/stations/StationDetailPanel'
import { useStations } from '@/hooks/useStations'
import { useUserLocation } from '@/hooks/useUserLocation'
import { useAppStore } from '@/store/appStore'
import { useVehicles } from '@/hooks/useVehicles'

export default function HomePage() {
  const { location } = useUserLocation()
  const selectedVehicle = useAppStore((state) => state.selectedVehicle)
  const setSelectedVehicle = useAppStore((state) => state.setSelectedVehicle)
  const filters = useAppStore((state) => state.filters)
  const setFilters = useAppStore((state) => state.setFilters)
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showVehicleSelector, setShowVehicleSelector] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const { data: vehicles } = useVehicles()
  const { data: stations, isLoading } = useStations({
    lat: location?.latitude || 12.9716,
    lng: location?.longitude || 77.5946,
    radius_km: 10,
    vehicle_id: selectedVehicle?.id,
    ...filters,
  })

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" data-theme={theme}>
      {/* TOP BAR - Ultra Minimal */}
      <div className="glass-ultra border-b border-white/5 px-8 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">EVCharge</span>
          </div>

          {/* HUGE SEARCH BAR */}
          <div className="relative w-[600px]">
            <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stations, areas, or networks..."
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-lg focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Vehicle Selector - Clean */}
          <div className="relative">
            <button
              onClick={() => setShowVehicleSelector(!showVehicleSelector)}
              className="h-14 px-6 rounded-2xl glass-ultra border border-white/10 hover:border-indigo-500 transition-all flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="font-semibold">
                {selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : 'Select Vehicle'}
              </span>
            </button>

            {/* Vehicle Dropdown */}
            {showVehicleSelector && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowVehicleSelector(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-[400px] max-h-[500px] glass-ultra border border-white/10 rounded-2xl overflow-hidden z-50 animate-in">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="font-bold text-lg">Select Your Vehicle</h3>
                    <p className="text-sm text-gray-400 mt-1">Get personalized results</p>
                  </div>
                  <div className="overflow-y-auto max-h-[400px] p-2">
                    {vehicles?.data.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => {
                          setSelectedVehicle(vehicle)
                          setShowVehicleSelector(false)
                        }}
                        className={`w-full text-left p-4 rounded-xl hover:bg-white/5 transition-all ${
                          selectedVehicle?.id === vehicle.id ? 'bg-indigo-500/20 border border-indigo-500' : ''
                        }`}
                      >
                        <div className="font-semibold">{vehicle.brand} {vehicle.model}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          {vehicle.battery_capacity_kwh}kWh • {vehicle.vehicle_type}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-14 h-14 rounded-2xl glass-ultra border border-white/10 hover:border-indigo-500 transition-all flex items-center justify-center"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDE - Station List */}
        <div className="w-[480px] border-r border-white/5 flex flex-col">
          {/* Filters */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilters({ sort_by: 'distance' })}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filters.sort_by === 'distance'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'glass-ultra hover:bg-white/5'
                }`}
              >
                Nearest
              </button>
              <button
                onClick={() => setFilters({ sort_by: 'price' })}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filters.sort_by === 'price'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'glass-ultra hover:bg-white/5'
                }`}
              >
                Cheapest
              </button>
              <button
                onClick={() => setFilters({ sort_by: 'rating' })}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filters.sort_by === 'rating'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'glass-ultra hover:bg-white/5'
                }`}
              >
                Top Rated
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="px-6 py-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Found <span className="text-white font-bold">{stations?.data.length || 0}</span> stations
              </span>
              {selectedVehicle && (
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                  Compatible with {selectedVehicle.brand}
                </span>
              )}
            </div>
          </div>

          {/* Station List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <StationList
              stations={stations?.data || []}
              isLoading={isLoading}
              onStationClick={(id) => setSelectedStationId(id)}
            />
          </div>
        </div>

        {/* RIGHT SIDE - Map (Full Height) */}
        <div className="flex-1 relative">
          <MapView
            stations={stations?.data || []}
            center={location ? [location.longitude, location.latitude] : [77.5946, 12.9716]}
            onStationClick={(station) => setSelectedStationId(station.id)}
          />

          {/* Floating Stats */}
          {stations?.data && stations.data.length > 0 && !isLoading && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-ultra border border-white/10 rounded-2xl px-8 py-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>{stations.data.length} stations nearby</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="absolute inset-0 glass-ultra flex items-center justify-center">
              <div className="text-center">
                <div className="loading-ultra mx-auto mb-4" />
                <div className="text-gradient text-xl font-bold">Finding stations...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedStationId && (
        <StationDetailPanel
          stationId={selectedStationId}
          onClose={() => setSelectedStationId(null)}
        />
      )}
    </div>
  )
}
