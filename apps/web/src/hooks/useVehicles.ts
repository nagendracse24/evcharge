import { useQuery } from '@tanstack/react-query'
import { Vehicle, ApiResponse } from '@evcharge/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function fetchVehicles(): Promise<ApiResponse<Vehicle[]>> {
  const response = await fetch(`${API_URL}/api/vehicles`)
  if (!response.ok) {
    throw new Error('Failed to fetch vehicles')
  }
  return response.json()
}

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime: 1000 * 60 * 60, // 1 hour - vehicle catalog doesn't change often
  })
}

