'use client'

import { StationWithDetails } from '@evcharge/shared'
import { StationCard } from './StationCard'

interface StationListProps {
  stations: StationWithDetails[]
  isLoading?: boolean
  onStationClick?: (stationId: string) => void
}

export function StationList({ stations, isLoading, onStationClick }: StationListProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-ultra shimmer h-40" />
        ))}
      </div>
    )
  }

  if (stations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">No stations found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {stations.map((station) => (
        <StationCard
          key={station.id}
          station={station}
          onClick={() => onStationClick?.(station.id)}
        />
      ))}
    </div>
  )
}
