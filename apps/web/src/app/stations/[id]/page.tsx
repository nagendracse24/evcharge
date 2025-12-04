'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { StationWithDetails } from '@evcharge/shared'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function fetchStation(id: string): Promise<{ data: StationWithDetails }> {
  const response = await fetch(`${API_URL}/api/stations/${id}`)
  if (!response.ok) throw new Error('Station not found')
  return response.json()
}

export default function StationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['station', id],
    queryFn: () => fetchStation(id),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-32 mb-4" />
          <div className="card p-6 space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Station not found</h2>
          <Link href="/" className="text-primary-600 hover:underline">
            ← Back to search
          </Link>
        </div>
      </div>
    )
  }

  const station = data.data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 font-medium mb-3 inline-block"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{station.name}</h1>
          {station.network && (
            <p className="text-gray-600 mt-1">{station.network}</p>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Location Card */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          <p className="text-gray-700 mb-4">{station.address}</p>
          <div className="flex flex-wrap gap-2">
            {station.is_24x7 && (
              <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                24×7 Open
              </span>
            )}
            {station.parking_type && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {station.parking_type}
              </span>
            )}
          </div>
        </div>

        {/* Connectors Card */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Connectors</h2>
          <div className="space-y-3">
            {station.connectors.map((connector, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{connector.connector_type}</p>
                  <p className="text-sm text-gray-600">
                    {connector.power_kw}kW {connector.is_dc_fast ? '• DC Fast' : '• AC'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="font-semibold text-gray-900">{connector.count} guns</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Card */}
        {station.pricing && station.pricing.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            {station.pricing.map((price, idx) => (
              <div key={idx} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {price.pricing_model === 'per_kwh' ? 'Per kWh' : 'Per Minute'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{price.price_value.toFixed(2)}
                  </span>
                </div>
                {price.parking_charges && (
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-600">Parking Charges</span>
                    <span className="text-gray-900">₹{price.parking_charges}</span>
                  </div>
                )}
                {price.remarks && (
                  <p className="text-sm text-gray-500 mt-2">{price.remarks}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Amenities Card */}
        {station.amenities && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {station.amenities.has_washroom && (
                <div className="flex items-center gap-2">
                  <span>🚻</span>
                  <span className="text-gray-700">Washroom</span>
                </div>
              )}
              {station.amenities.has_food && (
                <div className="flex items-center gap-2">
                  <span>🍔</span>
                  <span className="text-gray-700">Food</span>
                </div>
              )}
              {station.amenities.has_coffee_tea && (
                <div className="flex items-center gap-2">
                  <span>☕</span>
                  <span className="text-gray-700">Coffee/Tea</span>
                </div>
              )}
              {station.amenities.has_wifi && (
                <div className="flex items-center gap-2">
                  <span>📶</span>
                  <span className="text-gray-700">WiFi</span>
                </div>
              )}
              {station.amenities.has_sitting_area && (
                <div className="flex items-center gap-2">
                  <span>🪑</span>
                  <span className="text-gray-700">Sitting Area</span>
                </div>
              )}
              {station.amenities.has_shade && (
                <div className="flex items-center gap-2">
                  <span>☂️</span>
                  <span className="text-gray-700">Covered</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Card */}
        {station.reviews && station.reviews.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
              {station.avg_rating && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <span className="font-semibold text-gray-900">
                    {station.avg_rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({station.total_reviews} reviews)
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {station.reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Button */}
        <div className="card p-6">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center block"
          >
            🧭 Navigate to Station
          </a>
        </div>
      </div>
    </div>
  )
}

