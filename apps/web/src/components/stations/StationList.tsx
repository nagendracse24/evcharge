'use client'

import { StationWithDetails } from '@evcharge/shared'
import { StationCard } from './StationCard'

interface StationListProps {
  stations: StationWithDetails[]
  isLoading?: boolean
}

export function StationList({ stations, isLoading }: StationListProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (stations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No stations found</h3>
        <p className="text-sm">Try adjusting your filters or search radius</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      {stations.map((station) => (
        <StationCard key={station.id} station={station} />
      ))}
    </div>
  )
}

