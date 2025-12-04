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
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        <span>🚗</span>
        {selectedVehicle ? (
          <span className="max-w-[150px] truncate">
            {selectedVehicle.brand} {selectedVehicle.model}
          </span>
        ) : (
          <span className="text-gray-600">Select Vehicle</span>
        )}
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-40">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Select Your EV</h3>
              <p className="text-xs text-gray-500 mt-1">
                Get compatibility and cost estimates
              </p>
            </div>

            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
              <div className="p-2">
                {vehicles.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No vehicles available
                  </div>
                ) : (
                  vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => handleSelect(vehicle)}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        selectedVehicle?.id === vehicle.id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          {vehicle.variant && (
                            <p className="text-xs text-gray-500">{vehicle.variant}</p>
                          )}
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {vehicle.vehicle_type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {vehicle.battery_capacity_kwh}kWh • {vehicle.dc_connector_type || vehicle.ac_connector_type}
                      </div>
                    </button>
                  ))
                )}

                {/* Clear selection */}
                {selectedVehicle && (
                  <button
                    onClick={() => {
                      setSelectedVehicle(null)
                      setIsOpen(false)
                    }}
                    className="w-full text-center px-3 py-2 mt-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

