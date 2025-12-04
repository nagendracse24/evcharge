'use client'

import { StationWithDetails } from '@evcharge/shared'

interface StationCardProps {
  station: StationWithDetails
  onClick?: () => void
}

export function StationCard({ station, onClick }: StationCardProps) {
  const priceInfo = station.pricing[0]
  const hasDCFast = station.connectors.some((c) => c.is_dc_fast)

  return (
    <div
      onClick={onClick}
      className="card-ultra cursor-pointer m-4 hover:glow-accent group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1 group-hover:text-gradient transition-all">
            {station.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {station.distance_km !== undefined && (
              <span>{station.distance_km.toFixed(1)} km</span>
            )}
            {station.avg_rating && (
              <>
                <span>•</span>
                <span>⭐ {station.avg_rating.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>

        {/* Compatibility Badge */}
        {station.compatibility_status && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${
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

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {hasDCFast && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400">
            ⚡ DC Fast
          </span>
        )}
        {station.is_24x7 && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
            24/7
          </span>
        )}
        {station.network && (
          <span className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400">
            {station.network}
          </span>
        )}
      </div>

      {/* Pricing */}
      {priceInfo && (
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <div className="text-xs text-gray-500 mb-1">
              {priceInfo.pricing_model === 'per_kwh' ? 'Per kWh' : 'Per min'}
            </div>
            <div className="text-2xl font-bold">₹{priceInfo.price_value.toFixed(2)}</div>
          </div>
          {station.estimated_cost !== undefined && (
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Est. charge</div>
              <div className="text-xl font-bold text-gradient">
                ₹{Math.round(station.estimated_cost)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
