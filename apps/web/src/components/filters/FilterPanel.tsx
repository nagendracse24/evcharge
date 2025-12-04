'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { ConnectorType } from '@evcharge/shared'

export function FilterPanel() {
  const { filters, setFilters, resetFilters } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(false)

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
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden text-sm text-primary-600 font-medium"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className={`space-y-4 ${!isExpanded && 'hidden lg:block'}`}>
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort by
          </label>
          <select
            value={filters.sort_by || 'distance'}
            onChange={(e) => setFilters({ sort_by: e.target.value as any })}
            className="input text-sm"
          >
            <option value="distance">Nearest</option>
            <option value="price">Cheapest</option>
            <option value="rating">Highest Rated</option>
            <option value="best">Best Overall</option>
          </select>
        </div>

        {/* DC Fast Charging */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.is_dc_fast || false}
              onChange={(e) => setFilters({ is_dc_fast: e.target.checked || undefined })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              DC Fast Charging Only
            </span>
          </label>
        </div>

        {/* Connector Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Connector Type
          </label>
          <select
            value={filters.connector_type || ''}
            onChange={(e) =>
              setFilters({ connector_type: e.target.value || undefined })
            }
            className="input text-sm"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Network
          </label>
          <select
            value={filters.network || ''}
            onChange={(e) => setFilters({ network: e.target.value || undefined })}
            className="input text-sm"
          >
            <option value="">All Networks</option>
            {networks.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={resetFilters}
          className="w-full text-sm text-gray-600 hover:text-gray-900 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}

