'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { StationWithDetails } from '@/types/shared'
import { useAuth } from '@/context/AuthContext'
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '@/hooks/useFavorites'
import { ChargingCalculator } from '@/components/calculator/ChargingCalculator'
import SlotBooking from '@/components/booking/SlotBooking'
import { ReportPrice } from '@/components/reports/ReportPrice'
import { ReportAvailability } from '@/components/reports/ReportAvailability'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function fetchStation(id: string): Promise<{ data: StationWithDetails }> {
  const response = await fetch(`${API_URL}/api/stations/${id}`)
  if (!response.ok) throw new Error('Station not found')
  return response.json()
}

interface StationDetailPanelProps {
  stationId: string
  onClose: () => void
}

export function StationDetailPanel({ stationId, onClose }: StationDetailPanelProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [showReportForm, setShowReportForm] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reportType, setReportType] = useState<string>('offline')
  const [reportValue, setReportValue] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showReportPriceModal, setShowReportPriceModal] = useState(false)
  const [showReportAvailabilityModal, setShowReportAvailabilityModal] = useState(false)

  // Favorites hooks
  const { data: favoriteData } = useIsFavorite(stationId)
  const addFavorite = useAddFavorite()
  const removeFavorite = useRemoveFavorite()
  const isFavorite = favoriteData?.data?.is_favorite || false

  const { data, isLoading } = useQuery({
    queryKey: ['station', stationId],
    queryFn: () => fetchStation(stationId),
  })

  const reportMutation = useMutation({
    mutationFn: async (data: { report_type: string; value?: string }) => {
      const response = await fetch(`${API_URL}/api/stations/${stationId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to submit report')
      return response.json()
    },
    onSuccess: () => {
      setSuccessMessage('✓ Report submitted successfully!')
      setShowReportForm(false)
      setReportValue('')
      setTimeout(() => setSuccessMessage(null), 3000)
    },
  })

  const reviewMutation = useMutation({
    mutationFn: async (data: { rating: number; comment?: string }) => {
      const response = await fetch(`${API_URL}/api/stations/${stationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to submit review')
      }
      return response.json()
    },
    onSuccess: () => {
      setSuccessMessage('✓ Review added successfully!')
      setShowReviewForm(false)
      setComment('')
      setRating(5)
      queryClient.invalidateQueries({ queryKey: ['station', stationId] })
      setTimeout(() => setSuccessMessage(null), 3000)
    },
    onError: (error: Error) => {
      if (error.message.includes('Authentication required')) {
        setSuccessMessage('⚠️ Please sign in to add a review')
      } else {
        setSuccessMessage(`✗ ${error.message}`)
      }
      setTimeout(() => setSuccessMessage(null), 3000)
    },
  })

  const station = data?.data

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] glass-ultra border-l border-white/10 z-[101] animate-in overflow-y-auto">
        {/* Compact Header */}
        <div className="sticky top-0 glass-ultra border-b border-white/10 p-4 z-10">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 absolute top-4 right-4">
            {/* Favorite Button */}
            {user && (
              <button
                onClick={async () => {
                  if (isFavorite) {
                    await removeFavorite.mutateAsync(stationId)
                    setSuccessMessage('✓ Removed from favorites')
                  } else {
                    await addFavorite.mutateAsync(stationId)
                    setSuccessMessage('✓ Added to favorites!')
                  }
                  setTimeout(() => setSuccessMessage(null), 2000)
                }}
                disabled={addFavorite.isPending || removeFavorite.isPending}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isFavorite
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'hover:bg-white/10'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            )}
            
            {/* Share Button */}
            <button
              onClick={() => {
                const url = `${window.location.origin}?station=${stationId}`
                if (navigator.share) {
                  navigator.share({
                    title: station?.name,
                    text: `Check out ${station?.name} on EVCharge India`,
                    url,
                  })
                } else {
                  navigator.clipboard.writeText(url)
                  setSuccessMessage('✓ Link copied to clipboard!')
                  setTimeout(() => setSuccessMessage(null), 2000)
                }
              }}
              className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all"
              title="Share station"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="shimmer h-6 w-3/4 rounded-lg" />
          ) : station && (
            <div className="pr-10">
              <h2 className="text-xl font-bold mb-0.5">{station.name}</h2>
              {station.network && (
                <p className="text-gray-400 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-xs">
                    {station.network}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Compact Success Message */}
        {successMessage && (
          <div className="m-4 p-3 rounded-xl glass-ultra border border-indigo-500/50 text-indigo-400 text-sm animate-in">
            {successMessage}
          </div>
        )}

        {/* Compact Quick Actions */}
        {!isLoading && station && (
          <div className="px-4 pt-4">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* Book Slot Button - Prominent */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="col-span-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 font-semibold text-sm shadow-lg shadow-indigo-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Slot
              </button>
            </div>
            
            {/* Real-time Reporting Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowReportPriceModal(true)}
                className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-500/50 transition-all flex items-center justify-center gap-2 font-medium text-sm text-green-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Report Price
              </button>

              <button
                onClick={() => setShowReportAvailabilityModal(true)}
                className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 font-medium text-sm text-blue-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Report Status
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all flex items-center justify-center gap-1.5 font-medium text-sm text-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report Issue
              </button>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all flex items-center justify-center gap-1.5 font-medium text-sm text-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Write Review
              </button>
            </div>
          </div>
        )}

        {/* Report Form */}
        {showReportForm && (
          <div className="m-4 card-ultra space-y-3 p-4">
            <h3 className="font-bold text-lg">Report an Issue</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Issue Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none transition-all"
              >
                <option value="offline">Station Offline</option>
                <option value="price_change">Price Changed</option>
                <option value="busy">Currently Busy/Queue</option>
                <option value="incorrect_info">Incorrect Information</option>
                <option value="other">Other</option>
              </select>
            </div>

            {(reportType === 'price_change' || reportType === 'other') && (
              <div>
                <label className="block text-sm font-medium mb-2">Details</label>
                <textarea
                  value={reportValue}
                  onChange={(e) => setReportValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none transition-all"
                  rows={3}
                  placeholder="Provide additional details..."
                />
              </div>
            )}

            <button
              onClick={() => {
                reportMutation.mutate({
                  report_type: reportType,
                  value: reportValue || undefined,
                })
              }}
              disabled={reportMutation.isPending}
              className="w-full btn-ultra text-white disabled:opacity-50"
            >
              {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="m-4 card-ultra space-y-3 p-4">
            <h3 className="font-bold text-lg">Add Your Review</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-all ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none transition-all"
                rows={3}
                placeholder="Share your experience..."
              />
            </div>

            <button
              onClick={() => {
                reviewMutation.mutate({
                  rating,
                  comment: comment || undefined,
                })
              }}
              disabled={reviewMutation.isPending}
              className="w-full btn-ultra text-white disabled:opacity-50"
            >
              {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer h-24 rounded-xl" />
              ))}
            </div>
          ) : station && (
            <>
              {/* Rating */}
              {station.avg_rating && (
                <div className="card-ultra">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-4xl font-bold text-gradient">{station.avg_rating.toFixed(1)}</div>
                      <div className="text-sm text-gray-400">{station.total_reviews} reviews</div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-2xl ${
                            star <= Math.round(station.avg_rating!) ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="card-ultra">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h3>
                <p className="text-gray-400 text-sm mb-3">{station.address}</p>
                
                {/* Get Directions Button */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/20 font-semibold transition-all mb-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </a>
                
                <div className="flex gap-2">
                  {station.is_24x7 && (
                    <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 font-semibold">24/7</span>
                  )}
                  {station.parking_type && (
                    <span className="px-3 py-1 rounded-full text-xs bg-white/5">{station.parking_type}</span>
                  )}
                </div>
              </div>

              {/* Connectors */}
              <div className="card-ultra">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connectors
                </h3>
                <div className="space-y-3">
                  {station.connectors.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <div>
                        <div className="font-semibold">{c.connector_type}</div>
                        <div className="text-sm text-gray-400">
                          {c.power_kw}kW • {c.is_dc_fast ? 'DC Fast' : 'AC'} • {c.vehicle_type_supported}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl">{c.count}</div>
                        <div className="text-xs text-gray-400">available</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              {station.pricing && station.pricing.length > 0 && (
                <div className="card-ultra">
                  <h3 className="font-bold mb-4">Pricing</h3>
                  {station.pricing.map((p, i) => (
                    <div key={i} className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">
                        {p.pricing_model === 'per_kwh' ? 'Per kWh' : p.pricing_model === 'per_minute' ? 'Per Minute' : 'Flat Session'}
                      </span>
                      <span className="text-3xl font-bold text-gradient">₹{p.price_value.toFixed(2)}</span>
                    </div>
                  ))}
                  {station.estimated_cost !== undefined && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Estimated charge cost</span>
                        <span className="text-xl font-bold">₹{Math.round(station.estimated_cost)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Charging Calculator */}
              <ChargingCalculator stationPricing={station.pricing} />

              {/* Reviews */}
              {station.reviews && station.reviews.length > 0 && (
                <div className="card-ultra">
                  <h3 className="font-bold mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {station.reviews.slice(0, 3).map((review: any, i: number) => (
                      <div key={i} className="pb-4 border-b border-white/10 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-300">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigate Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ultra w-full text-center block text-white"
              >
                Navigate to Station →
              </a>
            </>
          )}
        </div>
      </div>

      {/* Slot Booking Modal */}
      {showBooking && station && (
        <SlotBooking
          stationId={stationId}
          stationName={station.name}
          connectors={station.connectors || []}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  )
}


