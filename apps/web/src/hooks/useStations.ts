import { useQuery } from '@tanstack/react-query'
import { StationWithDetails, ApiResponse } from '@evcharge/shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface UseStationsParams {
  lat: number
  lng: number
  radius_km?: number
  limit?: number
  vehicle_id?: string
  connector_type?: string
  is_dc_fast?: boolean
  network?: string
  sort_by?: 'distance' | 'price' | 'rating' | 'best'
}

async function fetchStations(params: UseStationsParams): Promise<ApiResponse<StationWithDetails[]>> {
  const queryParams = new URLSearchParams()
  queryParams.append('lat', params.lat.toString())
  queryParams.append('lng', params.lng.toString())
  
  if (params.radius_km) queryParams.append('radius_km', params.radius_km.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.vehicle_id) queryParams.append('vehicle_id', params.vehicle_id)
  if (params.connector_type) queryParams.append('connector_type', params.connector_type)
  if (params.is_dc_fast !== undefined) queryParams.append('is_dc_fast', params.is_dc_fast.toString())
  if (params.network) queryParams.append('network', params.network)
  if (params.sort_by) queryParams.append('sort_by', params.sort_by)

  const response = await fetch(`${API_URL}/api/stations/nearby?${queryParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch stations')
  }
  return response.json()
}

export function useStations(params: UseStationsParams) {
  return useQuery({
    queryKey: ['stations', params],
    queryFn: () => fetchStations(params),
    enabled: !!(params.lat && params.lng),
  })
}

