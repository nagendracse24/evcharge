'use client'

import { StationWithDetails, ConnectorType } from '@evcharge/shared'
import Link from 'next/link'

interface StationCardProps {
  station: StationWithDetails
}

export function StationCard({ station }: StationCardProps) {
  const compatibilityBadge = () => {
    if (!station.compatibility_status) return null
    
    const badges = {
      compatible: { text: '✓ Compatible', color: 'bg-success-100 text-success-700' },
      partial: { text: '◐ Partial', color: 'bg-warning-100 text-warning-700' },
      incompatible: { text: '✗ Incompatible', color: 'bg-danger-100 text-danger-700' },
    }
    
    const badge = badges[station.compatibility_status]
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  const priceInfo = station.pricing[0]
  const hasDCFast = station.connectors.some((c) => c.is_dc_fast)

  return (
    <Link href={`/stations/${station.id}`}>
      <div className="card hover:shadow-soft transition-shadow cursor-pointer group">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {station.name}
              </h3>
              {station.network && (
                <p className="text-sm text-gray-500">{station.network}</p>
              )}
            </div>
            {compatibilityBadge()}
          </div>

          {/* Distance & Rating */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            {station.distance_km !== undefined && (
              <span>📍 {station.distance_km.toFixed(1)} km</span>
            )}
            {station.avg_rating && (
              <span>⭐ {station.avg_rating.toFixed(1)}</span>
            )}
            {station.is_24x7 && (
              <span className="text-primary-600 font-medium">24×7</span>
            )}
          </div>

          {/* Connectors */}
          <div className="flex flex-wrap gap-2 mb-3">
            {hasDCFast && (
              <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded font-medium">
                ⚡ DC Fast
              </span>
            )}
            {station.connectors.slice(0, 3).map((connector, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
              >
                {connector.connector_type} ({connector.power_kw}kW)
              </span>
            ))}
            {station.connectors.length > 3 && (
              <span className="text-xs px-2 py-1 text-gray-500">
                +{station.connectors.length - 3} more
              </span>
            )}
          </div>

          {/* Pricing */}
          {priceInfo && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">
                  {priceInfo.pricing_model === 'per_kwh' ? 'Price per kWh' : 'Price per min'}
                </p>
                <p className="font-semibold text-gray-900">
                  ₹{priceInfo.price_value.toFixed(2)}
                </p>
              </div>
              {station.estimated_cost !== undefined && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Est. cost (20-80%)</p>
                  <p className="font-semibold text-primary-600">
                    ₹{Math.round(station.estimated_cost)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Estimated Time */}
          {station.estimated_charge_time_minutes !== undefined && (
            <div className="mt-2 text-sm text-gray-600">
              ⏱️ ~{Math.round(station.estimated_charge_time_minutes)} mins to 80%
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

