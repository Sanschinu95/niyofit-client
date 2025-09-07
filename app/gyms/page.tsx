"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, MapPin, Star, Filter, Loader2, Dumbbell, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { apiService, Gym } from "@/lib/api"

export default function GymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationSearch, setLocationSearch] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [priceFilter, setPriceFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchGyms()
  }, [currentPage, sortBy, priceFilter, searchTerm, locationSearch])

  const fetchGyms = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getGyms({
        page: currentPage,
        limit: 12,
        sort: sortBy
      })

      if (response.success && response.data) {
        let filteredGyms = response.data.gyms

        // Apply price filter
        if (priceFilter !== "all") {
          filteredGyms = filteredGyms.filter(gym => gym.priceRange === priceFilter)
        }

        // Apply search filter
        if (searchTerm) {
          filteredGyms = filteredGyms.filter(gym =>
            gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gym.description?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }

        // Apply location filter (simplified - in production, this would be proper geospatial search)
        if (locationSearch) {
          // For now, we'll show all gyms when location search is used
          // In a real implementation, you'd fetch location data and filter by coordinates
          // This is a placeholder for the location-based filtering
        }

        setGyms(filteredGyms)
        setTotalPages(response.data.pages)
      } else {
        setError("Failed to fetch gyms")
      }
    } catch (error) {
      console.error("Error fetching gyms:", error)
      setError("Failed to fetch gyms. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchGyms()
  }

  const formatOpeningHours = (gym: Gym) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' })
    const todayHours = gym.openingHours[today as keyof typeof gym.openingHours]
    
    if (todayHours?.closed) {
      return "Closed today"
    }
    
    return todayHours ? `${todayHours.open} - ${todayHours.close}` : "Hours not available"
  }

  const getPriceRangeColor = (priceRange?: string) => {
    switch (priceRange) {
      case 'budget': return 'bg-green-100 text-green-800'
      case 'mid-range': return 'bg-yellow-100 text-yellow-800'
      case 'premium': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriceRangeText = (priceRange?: string) => {
    switch (priceRange) {
      case 'budget': return 'Budget'
      case 'mid-range': return 'Mid-Range'
      case 'premium': return 'Premium'
      default: return 'Not specified'
    }
  }

  if (loading && gyms.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading gyms...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Gym</h1>
          <p className="text-gray-600">Discover gyms near you with the best facilities and pricing</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search gyms by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by location (city, state)..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="-name">Name (Z-A)</SelectItem>
                <SelectItem value="rating">Rating (Low to High)</SelectItem>
                <SelectItem value="-rating">Rating (High to Low)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="mid-range">Mid-Range</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <Button 
              onClick={fetchGyms} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Gyms Grid */}
        {gyms.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gyms found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 
                `No gyms found for "${searchTerm}". Try a different search term or location.` :
                "No gyms have been added to this location yet. Check back later or try a different area."
              }
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Looking for a specific gym?</p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {gyms.map((gym) => (
              <Card key={gym._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 right-4">
                    <Badge className={getPriceRangeColor(gym.priceRange)}>
                      {getPriceRangeText(gym.priceRange)}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">{gym.name}</h3>
                    {gym.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{gym.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {gym.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {gym.description}
                      </p>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatOpeningHours(gym)}</span>
                    </div>

                    {gym.contact?.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{gym.contact.phone}</span>
                      </div>
                    )}

                    {gym.facilities && gym.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {gym.facilities.slice(0, 3).map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                        {gym.facilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{gym.facilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Link href={`/gyms/${gym._id}`} className="w-full">
                    <Button className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && gyms.length > 0 && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}