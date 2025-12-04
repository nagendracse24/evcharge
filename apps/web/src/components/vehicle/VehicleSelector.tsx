'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { useVehicles } from '@/hooks/useVehicles'
import { Vehicle } from '@evcharge/shared'

export function VehicleSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedVehicle, setSelectedVehicle } = useAppStore()
  const { data: vehiclesData, isLoading } = useVehicles()

  const vehicles = vehiclesData?.data || []

  const handleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary flex items-center gap-3 min-w-[200px]"
      >
        <div className="flex-1 text-left">
          {selectedVehicle ? (
            <>
              <div className="text-xs text-[var(--text-tertiary)] font-medium">Vehicle</div>
              <div className="text-sm font-semibold truncate">
                {selectedVehicle.brand} {selectedVehicle.model}
              </div>
            </>
          ) : (
            <div className="text-sm font-semibold">Select Vehicle</div>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown - PROPERLY VISIBLE */}
          <div className="absolute right-0 mt-2 w-[400px] bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl shadow-2xl z-50 overflow-hidden fade-in">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--border-light)]">
              <h3 className="font-semibold">Select Your Vehicle</h3>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                Get personalized compatibility & cost estimates
              </p>
            </div>

            {/* Content */}
            <div className="max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="spinner mx-auto mb-3" />
                  <p className="text-sm text-[var(--text-secondary)]">Loading vehicles...</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)]">
                  No vehicles available
                </div>
              ) : (
                <div className="p-2">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => handleSelect(vehicle)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedVehicle?.id === vehicle.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800'
                          : 'hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {vehicle.brand} {vehicle.model}
                          </div>
                          {vehicle.variant && (
                            <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                              {vehicle.variant}
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-secondary)]">
                            <span className="font-mono">{vehicle.battery_capacity_kwh}kWh</span>
                            <span>•</span>
                            <span>{vehicle.dc_connector_type || vehicle.ac_connector_type}</span>
                          </div>
                        </div>
                        <div className="badge badge-neutral">
                          {vehicle.vehicle_type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {selectedVehicle && (
              <div className="px-4 py-3 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]">
                <button
                  onClick={() => {
                    setSelectedVehicle(null)
                    setIsOpen(false)
                  }}
                  className="text-sm text-[var(--accent-error)] hover:underline font-medium"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
