"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Search, Locate, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import LimitedSpotsBadge from "@/components/limited-spots-badge"
import { INDIAN_CITIES } from "@/data/indian-cities"

export default function GymSearchWidget() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLocating, setIsLocating] = useState(false)
  const [location, setLocation] = useState<string | null>(null)

  // Filter cities based on user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim().length > 1) {
      const filteredCities = INDIAN_CITIES.filter((city) => city.toLowerCase().includes(value.toLowerCase())).slice(
        0,
        6,
      ) // Limit to 6 suggestions

      setSuggestions(filteredCities)
      setShowSuggestions(filteredCities.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
    setSelectedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        handleSelectCity(suggestions[selectedIndex])
      } else if (query) {
        handleSearch()
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSelectCity = (city: string) => {
    setQuery(city)
    setShowSuggestions(false)
    saveRecentSearch(city)
  }

  const handleSearch = () => {
    if (query.trim()) {
      saveRecentSearch(query)
      setShowSuggestions(false)
      // In a real app, this would navigate to search results
      window.location.href = `/search?location=${encodeURIComponent(query)}`
    }
  }

  const handleClearInput = () => {
    setQuery("")
  }

  const handleUseLocation = () => {
    setIsLocating(true)
    // Simulate geolocation
    setTimeout(() => {
      setQuery("Mumbai")
      setLocation("Mumbai")
      setIsLocating(false)
      saveRecentSearch("Mumbai")
    }, 1500)
  }

  // Save recent search to localStorage
  const saveRecentSearch = (city: string) => {
    const updatedSearches = [city, ...recentSearches.filter((item) => item !== city)].slice(0, 3)
    setRecentSearches(updatedSearches)
    try {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
    } catch (e) {
      // Handle localStorage errors silently
    }
  }

  // Load recent searches from localStorage on component mount
  useState(() => {
    try {
      const savedSearches = localStorage.getItem("recentSearches")
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches).slice(0, 3))
      }
    } catch (e) {
      // Handle localStorage errors silently
    }
  })

  return (
    <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-xl font-bold text-blue-900">Find Your Perfect Gym</h3>
          <p className="text-gray-600 text-sm mt-1">Search from 2000+ gyms across 20+ cities</p>
        </div>
        <LimitedSpotsBadge />
      </div>

      <div className="relative w-full">
        <div className="flex flex-col space-y-4">
          {/* Search input with suggestions */}
          <div className="relative">
            <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <div className="pl-4 pr-2 text-blue-900">
                <MapPin className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Enter your city or location"
                className="flex-1 py-4 px-2 bg-transparent border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true)
                  }
                }}
              />
              {query && (
                <button onClick={handleClearInput} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="pr-3">
                <Button
                  type="button"
                  onClick={handleSearch}
                  className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg px-5 py-2 h-10"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* City suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-100"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {suggestions.map((city, index) => (
                    <div
                      key={city}
                      className={`px-4 py-3 cursor-pointer hover:bg-blue-50 ${
                        index === selectedIndex ? "bg-blue-100" : ""
                      } transition-colors`}
                      onClick={() => handleSelectCity(city)}
                    >
                      <div className="flex items-center">
                        <MapPin className="text-blue-900 mr-3 flex-shrink-0 h-4 w-4" />
                        <div>
                          <span className="font-medium text-gray-900">{city}</span>
                          <p className="text-xs text-gray-500 mt-0.5">Find gyms in {city}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Additional options */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Use my location button */}
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-900 hover:border-gray-400"
              onClick={handleUseLocation}
              disabled={isLocating}
            >
              {isLocating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
                  Locating...
                </>
              ) : (
                <>
                  <Locate className="mr-2 h-4 w-4" />
                  Use my location
                </>
              )}
            </Button>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 whitespace-nowrap">Recent:</span>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {recentSearches.map((city) => (
                    <Button
                      key={city}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-700 hover:text-blue-900 hover:bg-blue-50"
                      onClick={() => {
                        setQuery(city)
                        handleSearch()
                      }}
                    >
                      {city}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular cities */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-sm font-medium text-gray-700">Popular:</span>
        {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"].map((city) => (
          <Link
            key={city}
            href={`/search?location=${city}`}
            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-full text-sm font-medium transition-colors"
          >
            {city}
          </Link>
        ))}
      </div>
    </div>
  )
}
