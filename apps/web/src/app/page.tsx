'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { StationList } from '@/components/stations/StationList'
import { StationDetailPanel } from '@/components/stations/StationDetailPanel'
import { useStations } from '@/hooks/useStations'
import { useUserLocation } from '@/hooks/useUserLocation'
import { useAppStore } from '@/store/appStore'
import { useVehicles } from '@/hooks/useVehicles'
import { useAuth } from '@/context/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { RecentSearches } from '@/components/search/RecentSearches'
import { AdvancedFilters, FilterOptions } from '@/components/filters/AdvancedFilters'
import { useRecentSearches } from '@/hooks/useRecentSearches'
import { StationListSkeleton } from '@/components/ui/LoadingSkeleton'

// Lazy load heavy components
const MapView = dynamic(() => import('@/components/map/MapView').then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center glass-ultra">
      <div className="text-center">
        <div className="loading-ultra mx-auto mb-4" />
        <div className="text-gradient font-bold text-lg">Loading map...</div>
      </div>
    </div>
  ),
})

export default function HomePage() {
  const { location } = useUserLocation()
  const selectedVehicle = useAppStore((state) => state.selectedVehicle)
  const setSelectedVehicle = useAppStore((state) => state.setSelectedVehicle)
  const filters = useAppStore((state) => state.filters)
  const setFilters = useAppStore((state) => state.setFilters)
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showVehicleSelector, setShowVehicleSelector] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showRecentSearches, setShowRecentSearches] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({})
  const { user, signOut } = useAuth()
  const { addSearch } = useRecentSearches()

  const { data: vehicles } = useVehicles()
  const { data: stations, isLoading, error } = useStations({
    lat: location?.latitude || 12.9716,
    lng: location?.longitude || 77.5946,
    radius_km: 10,
    vehicle_id: selectedVehicle?.id,
    ...filters,
  })

  // Filter and sort stations
  const filteredStations = (stations?.data || [])
    .filter((station: any) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          station.name.toLowerCase().includes(query) ||
          station.address?.toLowerCase().includes(query) ||
          station.city?.toLowerCase().includes(query) ||
          station.network?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Advanced filters
      if (advancedFilters.connector_types && advancedFilters.connector_types.length > 0) {
        const hasConnector = station.connectors.some(c => 
          advancedFilters.connector_types?.includes(c.connector_type)
        )
        if (!hasConnector) return false
      }

      if (advancedFilters.networks && advancedFilters.networks.length > 0) {
        if (!advancedFilters.networks.includes(station.network || '')) return false
      }

      if (advancedFilters.is_dc_fast) {
        if (!station.connectors.some(c => c.is_dc_fast)) return false
      }

      if (advancedFilters.is_24x7) {
        if (!station.is_24x7) return false
      }

      if (advancedFilters.min_power && advancedFilters.min_power > 0) {
        const maxPower = Math.max(...station.connectors.map(c => c.power_kw))
        if (maxPower < advancedFilters.min_power) return false
      }

      if (advancedFilters.amenities && advancedFilters.amenities.length > 0) {
        // Check amenities
        const amenities = station.amenities
        if (!amenities) return false
        
        for (const amenity of advancedFilters.amenities) {
          if (amenity === 'food' && !amenities.has_food) return false
          if (amenity === 'washroom' && !amenities.has_washroom) return false
          if (amenity === 'wifi' && !amenities.has_wifi) return false
          if (amenity === 'coffee' && !amenities.has_coffee_tea) return false
          if (amenity === 'sitting_area' && !amenities.has_sitting_area) return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // Client-side sorting for instant feedback
      const sortBy = filters.sort_by || 'distance'
      
      if (sortBy === 'distance') {
        return (a.distance_km || 999) - (b.distance_km || 999)
      } else if (sortBy === 'price') {
        const priceA = a.pricing[0]?.price_value || 999
        const priceB = b.pricing[0]?.price_value || 999
        return priceA - priceB
      } else if (sortBy === 'rating') {
        return (b.avg_rating || 0) - (a.avg_rating || 0)
      }
      return 0
    })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      addSearch(query)
    }
  }

  return (
    <div className="min-h-screen w-full" data-theme="dark">
      {/* Particles */}
      <div className="particles-container">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`particle particle-${(i % 3) + 1}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${50 + Math.random() * 50}%`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* STICKY TOP BAR - Well Sized */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-between z-50 shadow-lg">
        <div className="flex items-center gap-4 sm:gap-8 flex-1">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow-accent flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-base sm:text-xl font-bold whitespace-nowrap">EVCharge India</span>
          </div>

          {/* SEARCH BAR */}
          <div className="relative flex-1 max-w-xl">
            <svg className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowRecentSearches(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowRecentSearches(false)
                  e.currentTarget.blur() // Remove focus to close keyboard on mobile
                }
              }}
              placeholder="Search stations, areas..."
              className="w-full h-10 sm:h-11 pl-10 sm:pl-12 pr-3 sm:pr-4 rounded-xl 
                bg-gray-900/90 border border-gray-700
                text-white placeholder-gray-400 caret-white
                focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                transition-all text-sm sm:text-base"
            />
            
            {/* Recent Searches */}
            {showRecentSearches && (
              <RecentSearches
                onSelect={handleSearch}
                onClose={() => setShowRecentSearches(false)}
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add Station Button */}
          <a
            href="/add-station"
            className="h-10 sm:h-11 px-3 sm:px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center gap-1 sm:gap-2 font-semibold text-white text-sm sm:text-base whitespace-nowrap"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Station</span>
            <span className="sm:hidden">Add</span>
          </a>

          {/* Vehicle Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowVehicleSelector(!showVehicleSelector)}
              className="h-10 sm:h-11 px-3 sm:px-5 rounded-xl bg-gray-800 border-2 border-gray-600 hover:border-indigo-500 transition-all flex items-center gap-2 sm:gap-3 font-medium min-w-[140px] sm:min-w-[180px] text-sm sm:text-base text-white"
            >
              <span className="flex-1 text-left truncate">
                {selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : 'Select Vehicle'}
              </span>
              <svg
                className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${showVehicleSelector ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showVehicleSelector && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowVehicleSelector(false)} />
                <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[380px] max-h-[400px] sm:max-h-[450px] bg-gray-900 border-2 border-gray-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                  <div className="p-3 sm:p-4 border-b border-gray-700 bg-gray-800">
                    <h3 className="font-bold text-sm sm:text-base text-white">Select Your Vehicle</h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Get personalized compatibility</p>
                  </div>
                  <div className="overflow-y-auto max-h-[320px] sm:max-h-[360px] p-2 sm:p-3">
                    {vehicles?.data.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => {
                          setSelectedVehicle(vehicle)
                          setShowVehicleSelector(false)
                        }}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-lg hover:bg-gray-800 transition-all mb-1.5 sm:mb-2 text-sm sm:text-base ${
                          selectedVehicle?.id === vehicle.id ? 'bg-indigo-600 border-2 border-indigo-400 text-white' : 'text-gray-300'
                        }`}
                      >
                        <div className={`font-semibold ${selectedVehicle?.id === vehicle.id ? 'text-white' : 'text-white'}`}>{vehicle.brand} {vehicle.model}</div>
                        <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${selectedVehicle?.id === vehicle.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                          {vehicle.battery_capacity_kwh}kWh • {vehicle.vehicle_type}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Auth/Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white hover:shadow-lg transition-all flex-shrink-0"
              >
                {user.email?.charAt(0).toUpperCase()}
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border-2 border-gray-700 rounded-xl overflow-hidden z-50 shadow-2xl">
                    <div className="p-4 border-b border-gray-700 bg-gray-800">
                      <div className="font-semibold truncate text-white">{user.email}</div>
                      <div className="text-xs text-gray-400 mt-1">Signed in</div>
                    </div>
                    <div className="p-2">
                      <a
                        href="/profile"
                        className="block px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all text-white"
                        onClick={() => setShowUserMenu(false)}
                      >
                        👤 My Profile
                      </a>
                      <a
                        href="/favorites"
                        className="block px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all text-white"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ⭐ Favorite Stations
                      </a>
                      <button
                        onClick={async () => {
                          await signOut()
                          setShowUserMenu(false)
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-all"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-gray-800 border-2 border-gray-600 hover:border-indigo-500 transition-all font-semibold text-sm sm:text-base whitespace-nowrap text-white"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-5">
          {/* Filters & Results */}
          <div className="mb-4 sm:mb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                <button
                  onClick={() => setFilters({ sort_by: 'distance' })}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
                    filters.sort_by === 'distance' || !filters.sort_by
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'bg-gray-800 border-2 border-gray-600 hover:border-indigo-500 text-white hover:bg-gray-700'
                  }`}
                >
                  Nearest
                </button>
                <button
                  onClick={() => setFilters({ sort_by: 'price' })}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
                    filters.sort_by === 'price'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'bg-gray-800 border-2 border-gray-600 hover:border-indigo-500 text-white hover:bg-gray-700'
                  }`}
                >
                  Cheapest
                </button>
                <button
                  onClick={() => setFilters({ sort_by: 'rating' })}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
                    filters.sort_by === 'rating'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'bg-gray-800 border-2 border-gray-600 hover:border-indigo-500 text-white hover:bg-gray-700'
                  }`}
                >
                  Top Rated
                </button>
                
                {/* Advanced Filters */}
                <AdvancedFilters
                  onApply={(newFilters) => {
                    setAdvancedFilters(newFilters)
                    // Apply filters client-side for now
                  }}
                  onReset={() => {
                    setAdvancedFilters({})
                  }}
                />
              </div>

              {/* Results Count */}
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <span className="text-sm sm:text-base text-gray-400">
                  Found <span className="text-white font-bold text-base sm:text-lg">{filteredStations.length}</span> stations
                  {searchQuery && <span className="text-xs ml-1">(filtered)</span>}
                </span>
                {selectedVehicle && (
                  <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-medium">
                    Compatible with {selectedVehicle.brand}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-900/30 border-2 border-red-500 text-red-300">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-bold">Failed to load stations</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Make sure the backend is running at <code className="px-2 py-1 bg-black/30 rounded">http://localhost:3001</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Section */}
          <div className="mb-4 sm:mb-6">
            <div className="card-ultra p-0 overflow-hidden rounded-xl sm:rounded-2xl" style={{ height: '300px', minHeight: '300px', maxHeight: '450px' }}>
              <div className="relative w-full h-full">
                <MapView
                  stations={filteredStations}
                  center={location ? [location.longitude, location.latitude] : [77.5946, 12.9716]}
                  onStationClick={(station) => setSelectedStationId(station.id)}
                />

                {/* Floating Stats */}
                {filteredStations.length > 0 && !isLoading && (
                  <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 glass-ultra border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-3 animate-in">
                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse glow-accent" />
                      <span className="font-medium">{filteredStations.length} stations {searchQuery ? 'found' : 'nearby'}</span>
                    </div>
                  </div>
                )}

                {/* Loading */}
                {isLoading && (
                  <div className="absolute inset-0 glass-ultra flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="loading-ultra mx-auto mb-3 sm:mb-4" />
                      <div className="text-gradient text-lg sm:text-xl font-bold">Finding stations...</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">This may take a few seconds</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Station List */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-5">Available Stations</h2>
            {isLoading ? (
              <StationListSkeleton count={6} />
            ) : error ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Unable to load stations</h3>
                <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 px-4">Please check your backend server</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm sm:text-base"
                >
                  Retry
                </button>
              </div>
            ) : filteredStations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {filteredStations.map((station) => (
                  <div key={station.id} onClick={() => setSelectedStationId(station.id)}>
                    <div className="card-ultra cursor-pointer hover:glow-accent group h-full">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold mb-1 group-hover:text-gradient transition-all truncate">
                            {station.name}
                          </h3>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
                            {station.distance_km !== undefined && (
                              <span className="flex items-center gap-0.5 sm:gap-1">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {station.distance_km.toFixed(1)}km
                              </span>
                            )}
                            {station.avg_rating && (
                              <>
                                <span>•</span>
                                <span>⭐ {station.avg_rating.toFixed(1)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {station.compatibility_status && (
                          <div
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-bold flex-shrink-0 ml-2 sm:ml-3 ${
                              station.compatibility_status === 'compatible'
                                ? 'bg-green-500/20 text-green-400'
                                : station.compatibility_status === 'partial'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {station.compatibility_status === 'compatible' ? '✓' : station.compatibility_status === 'partial' ? '◐' : '✗'}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {station.connectors.some((c) => c.is_dc_fast) && (
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-500/20 text-indigo-400">
                            ⚡ DC Fast
                          </span>
                        )}
                        {station.is_24x7 && (
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-semibold bg-purple-500/20 text-purple-400">
                            24/7
                          </span>
                        )}
                        {station.network && (
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm bg-white/5 text-gray-400 truncate max-w-[120px]">
                            {station.network}
                          </span>
                        )}
                      </div>

                      {station.pricing[0] && (
                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/5">
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5 sm:mb-1">
                              {station.pricing[0].pricing_model === 'per_kwh' ? 'Per kWh' : 'Per min'}
                            </div>
                            <div className="text-lg sm:text-2xl font-bold">₹{station.pricing[0].price_value.toFixed(2)}</div>
                          </div>
                          {station.estimated_cost !== undefined && (
                            <div className="text-right">
                              <div className="text-xs text-gray-500 mb-0.5 sm:mb-1">Est. charge</div>
                              <div className="text-base sm:text-xl font-bold text-gradient">
                                ₹{Math.round(station.estimated_cost)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 px-4">
                  {searchQuery ? `No stations matching "${searchQuery}"` : 'No stations found'}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 px-4">
                  {searchQuery ? (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Clear search
                    </button>
                  ) : (
                    'Try adjusting your filters or search area'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedStationId && (
        <StationDetailPanel
          stationId={selectedStationId}
          onClose={() => setSelectedStationId(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
