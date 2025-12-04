'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/appStore'

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const setSearchLocation = useAppStore((state) => state.setSearchLocation)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // For MVP, this is a placeholder
    // In production, integrate with geocoding API
    console.log('Search for:', searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by area, pincode, or station name..."
        className="input pr-10"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        🔍
      </button>
    </form>
  )
}

