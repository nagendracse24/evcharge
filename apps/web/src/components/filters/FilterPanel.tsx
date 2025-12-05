'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { ConnectorType } from '@/types/shared'

export function FilterPanel() {
  const { filters, setFilters, resetFilters } = useAppStore()

  const connectorTypes = [
    'CCS2',
    'Type 2 AC',
    'CHAdeMO',
    'Bharat AC001',
    'Bharat DC001',
    'GB/T DC',
  ]

  const networks = ['Tata Power', 'Statiq', 'ChargeZone', 'Ather Grid', 'JioBP']

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold gradient-text">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-xs text-gray-500 hover:text-purple-600 font-semibold transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Sort by
          </label>
          <select
            value={filters.sort_by || 'distance'}
            onChange={(e) => setFilters({ sort_by: e.target.value as any })}
            className="input-modern text-sm w-full"
          >
            <option value="distance">🎯 Nearest First</option>
            <option value="price">💰 Cheapest First</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="best">🏆 Best Overall</option>
          </select>
        </div>

        {/* DC Fast Charging */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.is_dc_fast || false}
                onChange={(e) => setFilters({ is_dc_fast: e.target.checked || undefined })}
                className="sr-only"
              />
              <div className={`w-12 h-7 rounded-full transition-all duration-300 ${
                filters.is_dc_fast
                  ? 'gradient-primary shadow-lg'
                  : 'bg-gray-200'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  filters.is_dc_fast ? 'translate-x-6' : 'translate-x-1'
                } mt-1`}></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
              ⚡ DC Fast Charging Only
            </span>
          </label>
        </div>

        {/* Connector Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Connector Type
          </label>
          <select
            value={filters.connector_types?.[0] || ''}
            onChange={(e) =>
              setFilters({ connector_types: e.target.value ? [e.target.value as any] : undefined })
            }
            className="input-modern text-sm w-full"
          >
            <option value="">All Connectors</option>
            {connectorTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Network */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Network
          </label>
          <select
            value={filters.networks?.[0] || ''}
            onChange={(e) => setFilters({ networks: e.target.value ? [e.target.value] : undefined })}
            className="input-modern text-sm w-full"
          >
            <option value="">All Networks</option>
            {networks.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}


