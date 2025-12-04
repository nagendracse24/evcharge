'use client'

import { useQuery } from '@tanstack/react-query'
import { StationWithDetails } from '@evcharge/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function fetchStation(id: string): Promise<{ data: StationWithDetails }> {
  const response = await fetch(`${API_URL}/api/stations/${id}`)
  if (!response.ok) throw new Error('Station not found')
  return response.json()
}

interface StationDetailPanelProps {
  stationId: string
  onClose: () => void
}

export function StationDetailPanel({ stationId, onClose }: StationDetailPanelProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['station', stationId],
    queryFn: () => fetchStation(stationId),
  })

  const station = data?.data

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] glass-ultra border-l border-white/10 z-[101] animate-in overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 glass-ultra border-b border-white/10 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {isLoading ? (
            <div className="shimmer h-8 w-3/4 rounded-lg" />
          ) : station && (
            <div className="pr-12">
              <h2 className="text-2xl font-bold mb-1">{station.name}</h2>
              {station.network && <p className="text-gray-400">{station.network}</p>}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer h-32 rounded-2xl" />
              ))}
            </div>
          ) : station && (
            <>
              {/* Location */}
              <div className="card-ultra">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h3>
                <p className="text-gray-400 text-sm mb-3">{station.address}</p>
                <div className="flex gap-2">
                  {station.is_24x7 && (
                    <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">24/7</span>
                  )}
                  {station.parking_type && (
                    <span className="px-3 py-1 rounded-full text-xs bg-white/5">{station.parking_type}</span>
                  )}
                </div>
              </div>

              {/* Connectors */}
              <div className="card-ultra">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connectors
                </h3>
                <div className="space-y-3">
                  {station.connectors.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div>
                        <div className="font-semibold">{c.connector_type}</div>
                        <div className="text-sm text-gray-400">{c.power_kw}kW • {c.is_dc_fast ? 'DC' : 'AC'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{c.count}</div>
                        <div className="text-xs text-gray-400">available</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              {station.pricing && station.pricing.length > 0 && (
                <div className="card-ultra">
                  <h3 className="font-bold mb-4">Pricing</h3>
                  {station.pricing.map((p, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-400">{p.pricing_model === 'per_kwh' ? 'Per kWh' : 'Per min'}</span>
                      <span className="text-3xl font-bold text-gradient">₹{p.price_value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigate Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ultra w-full text-center block text-white"
              >
                Navigate to Station
              </a>
            </>
          )}
        </div>
      </div>
    </>
  )
}
