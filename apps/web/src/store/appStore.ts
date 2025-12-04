import { create } from 'zustand'
import { Vehicle, StationFilters } from '@evcharge/shared'

interface AppState {
  selectedVehicle: Vehicle | null
  setSelectedVehicle: (vehicle: Vehicle | null) => void
  
  filters: StationFilters
  setFilters: (filters: Partial<StationFilters>) => void
  resetFilters: () => void
  
  searchLocation: { lat: number; lng: number } | null
  setSearchLocation: (location: { lat: number; lng: number } | null) => void
}

const initialFilters: StationFilters = {}

export const useAppStore = create<AppState>((set) => ({
  selectedVehicle: null,
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  
  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: initialFilters }),
  
  searchLocation: null,
  setSearchLocation: (location) => set({ searchLocation: location }),
}))

