'use client'

import { VehicleSelector } from '@/components/vehicle/VehicleSelector'
import { SearchBar } from '@/components/search/SearchBar'
import { useTheme } from '@/context/ThemeContext'
import { useState, useEffect } from 'react'

interface HeaderProps {
  showFilters: boolean
  onToggleFilters: () => void
}

export function Header({ showFilters, onToggleFilters }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  let theme = 'light'
  let toggleTheme = () => {}

  // Safe theme hook usage
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
    toggleTheme = themeContext.toggleTheme
  } catch (e) {
    // Theme provider not ready yet
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="relative z-20 p-4 fade-in-up">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 gradient-bg"></div>

          <div className="flex items-center justify-between mb-4">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-3xl shadow-lg glow">
                ⚡
              </div>
              <div>
                <h1 className="text-3xl font-black gradient-text-animated">
                  EVCharge India
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Find • Compare • Charge Smarter
                </p>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              {/* Dark/Light Mode Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="w-12 h-12 rounded-2xl glass-hover flex items-center justify-center text-2xl transition-all hover:scale-110"
                  title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              )}

              {/* Vehicle Selector */}
              <VehicleSelector />
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Mobile Filter Toggle */}
          <button
            onClick={onToggleFilters}
            className="lg:hidden mt-4 w-full px-6 py-3 rounded-2xl glass-hover flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.02]"
          >
            <span className="text-xl">🔧</span>
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          </button>
        </div>
      </div>
    </header>
  )
}
