"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, MapPin, Star, ArrowUpDown, Filter, ChevronDown, ChevronUp, CheckCircle, X, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MapView from "@/components/map-view"
import CitySearch from "@/components/city-search"

// Mock gym data
const mockGyms = [
  {
    id: "fitzone-premium",
    name: "FitZone Premium",
    location: "Bandra West, Mumbai",
    address: "24, Hill Road, Bandra West, Mumbai, Maharashtra 400050",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    rating: 4.8,
    reviewCount: 124,
    image: "/placeholder.svg?height=300&width=500&text=FitZone",
    price: "₹499",
    distance: "0.8 km",
    features: ["AC", "Personal Trainer", "24/7", "Locker", "Shower"],
    verified: true,
  },
  {
    id: "powerhouse-gym",
    name: "PowerHouse Gym",
    location: "Andheri East, Mumbai",
    address: "42, MIDC, Andheri East, Mumbai, Maharashtra 400093",
    coordinates: { lat: 19.1136, lng: 72.8697 },
    rating: 4.6,
    reviewCount: 98,
    image: "/placeholder.svg?height=300&width=500&text=PowerHouse",
    price: "₹399",
    distance: "1.2 km",
    features: ["AC", "Parking", "Women's Hours", "Cardio"],
    verified: true,
  },
  {
    id: "iron-fitness",
    name: "Iron Fitness Club",
    location: "Juhu, Mumbai",
    address: "10, Juhu Tara Road, Juhu, Mumbai, Maharashtra 400049",
    coordinates: { lat: 19.0883, lng: 72.8264 },
    rating: 4.7,
    reviewCount: 112,
    image: "/placeholder.svg?height=300&width=500&text=Iron+Fitness",
    price: "₹449",
    distance: "1.5 km",
    features: ["AC", "Locker", "Cardio Zone", "Free Weights"],
    verified: true,
  },
  {
    id: "gold-gym",
    name: "Gold's Gym",
    location: "Santacruz West, Mumbai",
    address: "5, Linking Road, Santacruz West, Mumbai, Maharashtra 400054",
    coordinates: { lat: 19.0784, lng: 72.8387 },
    rating: 4.5,
    reviewCount: 156,
    image: "/placeholder.svg?height=300&width=500&text=Gold's+Gym",
    price: "₹549",
    distance: "2.1 km",
    features: ["AC", "Pool", "Spa", "Group Classes", "Parking"],
    verified: true,
  },
  {
    id: "fitness-first",
    name: "Fitness First",
    location: "Malad West, Mumbai",
    address: "Infinity Mall, Malad West, Mumbai, Maharashtra 400064",
    coordinates: { lat: 19.1759, lng: 72.8422 },
    rating: 4.4,
    reviewCount: 87,
    image: "/placeholder.svg?height=300&width=500&text=Fitness+First",
    price: "₹399",
    distance: "2.8 km",
    features: ["AC", "Cardio", "Yoga", "Zumba Classes"],
    verified: true,
  },
  {
    id: "cult-fitness",
    name: "Cult Fitness",
    location: "Khar West, Mumbai",
    address: "16, 16th Road, Khar West, Mumbai, Maharashtra 400052",
    coordinates: { lat: 19.0728, lng: 72.8326 },
    rating: 4.3,
    reviewCount: 76,
    image: "/placeholder.svg?height=300&width=500&text=Cult+Fitness",
    price: "₹349",
    distance: "3.2 km",
    features: ["Group Classes", "Functional", "Cardio", "No Equipment"],
    verified: true,
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [filteredGyms, setFilteredGyms] = useState(mockGyms)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedDistance, setSelectedDistance] = useState<string[]>([])
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("recommended")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState("list")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          // In a real app, you would fetch gyms near this location
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enter it manually.")
        },
      )
    } else {
      alert("Geolocation is not supported by your browser")
    }
  }

  // Handle search form submission
  const handleSearch = (city: string) => {
    // In a real app, you would fetch gyms based on the location
    setLocation(city)
    router.push(`/search?location=${encodeURIComponent(city)}`)
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = [...mockGyms]

    // Filter by price
    filtered = filtered.filter((gym) => {
      const price = Number.parseInt(gym.price.replace(/[^\d]/g, ""))
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Filter by distance
    if (selectedDistance.length > 0) {
      filtered = filtered.filter((gym) => {
        const distance = Number.parseFloat(gym.distance.split(" ")[0])
        return selectedDistance.some((range) => {
          const [min, max] = range.split("-").map(Number)
          return distance >= min && (max ? distance <= max : true)
        })
      })
    }

    // Filter by facilities
    if (selectedFacilities.length > 0) {
      filtered = filtered.filter((gym) => selectedFacilities.every((facility) => gym.features.includes(facility)))
    }

    // Filter by ratings
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((gym) => selectedRatings.some((minRating) => gym.rating >= minRating))
    }

    // Sort results
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => Number.parseInt(a.price.replace(/[^\d]/g, "")) - Number.parseInt(b.price.replace(/[^\d]/g, "")),
        )
        break
      case "price-high":
        filtered.sort(
          (a, b) => Number.parseInt(b.price.replace(/[^\d]/g, "")) - Number.parseInt(a.price.replace(/[^\d]/g, "")),
        )
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "distance":
        filtered.sort(
          (a, b) => Number.parseFloat(a.distance.split(" ")[0]) - Number.parseFloat(b.distance.split(" ")[0]),
        )
        break
      default:
        // Default sorting (recommended) - could be a combination of factors
        break
    }

    setFilteredGyms(filtered)
    setIsFilterOpen(false)
  }

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 1000])
    setSelectedDistance([])
    setSelectedFacilities([])
    setSelectedRatings([])
    setSortBy("recommended")
    setFilteredGyms(mockGyms)
  }

  // Toggle distance selection
  const toggleDistance = (distance: string) => {
    setSelectedDistance((prev) => (prev.includes(distance) ? prev.filter((d) => d !== distance) : [...prev, distance]))
  }

  // Toggle facility selection
  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility],
    )
  }

  // Toggle rating selection
  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) => (prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]))
  }

  // Initialize with search params
  useEffect(() => {
    const locationParam = searchParams.get("location")
    if (locationParam) {
      setLocation(locationParam)
      // In a real app, you would fetch gyms based on this location
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Search Header */}
      <section className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Find Gyms Near You</h1>

          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-2 items-center">
            <div className="flex-1">
              <CitySearch onSearch={handleSearch} placeholder="Enter your location or pincode" buttonText="Search" />
            </div>
            <Button type="button" variant="outline" className="md:w-auto" onClick={getUserLocation}>
              <Locate className="mr-2" size={18} />
              Use My Location
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* View Toggle */}
        <div className="mb-4">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
            <TabsList className="grid w-full max-w-[200px] grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Filters</h2>
                <Button variant="ghost" size="sm" className="text-blue-900 h-auto p-1" onClick={resetFilters}>
                  Reset
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Price Range</h3>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={1000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}+</span>
                </div>
              </div>

              {/* Distance */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Distance</h3>
                <div className="space-y-2">
                  {["0-2", "2-5", "5-10", "10-"].map((option) => (
                    <div key={option} className="flex items-center">
                      <Checkbox
                        id={`distance-${option}`}
                        checked={selectedDistance.includes(option)}
                        onCheckedChange={() => toggleDistance(option)}
                      />
                      <label htmlFor={`distance-${option}`} className="ml-2 text-sm">
                        {option.includes("-")
                          ? option.endsWith("-")
                            ? `${option.split("-")[0]}+ km`
                            : `${option.split("-")[0]}-${option.split("-")[1]} km`
                          : `${option} km`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Facilities</h3>
                <div className="space-y-2">
                  {[
                    "AC",
                    "Parking",
                    "Personal Trainer",
                    "Locker",
                    "Shower",
                    "Women's Hours",
                    "24/7",
                    "Pool",
                    "Spa",
                    "Group Classes",
                  ].map((facility) => (
                    <div key={facility} className="flex items-center">
                      <Checkbox
                        id={`facility-${facility}`}
                        checked={selectedFacilities.includes(facility)}
                        onCheckedChange={() => toggleFacility(facility)}
                      />
                      <label htmlFor={`facility-${facility}`} className="ml-2 text-sm">
                        {facility}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Ratings</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={selectedRatings.includes(rating)}
                        onCheckedChange={() => toggleRating(rating)}
                      />
                      <label htmlFor={`rating-${rating}`} className="ml-2 text-sm flex items-center">
                        {rating}+ <Star className="h-3 w-3 fill-orange-500 text-orange-500 ml-1" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-blue-900 hover:bg-blue-800" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                className="flex-1 justify-between"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </div>
                {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-between">
                    <div className="flex items-center">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Sort
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0">
                  <div className="flex flex-col">
                    {[
                      { id: "recommended", label: "Recommended" },
                      { id: "price-low", label: "Price: Low to High" },
                      { id: "price-high", label: "Price: High to Low" },
                      { id: "rating", label: "Highest Rated" },
                      { id: "distance", label: "Nearest" },
                    ].map((option) => (
                      <Button
                        key={option.id}
                        variant="ghost"
                        className={`justify-start ${sortBy === option.id ? "bg-blue-50 text-blue-900" : ""}`}
                        onClick={() => {
                          setSortBy(option.id)
                          applyFilters()
                        }}
                      >
                        {option.label}
                        {sortBy === option.id && <CheckCircle className="ml-auto h-4 w-4" />}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {isFilterOpen && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <Button variant="ghost" size="sm" className="text-blue-900 h-auto p-1" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>

                {/* Mobile Price Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Price Range</h3>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    step={50}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}+</span>
                  </div>
                </div>

                {/* Mobile Distance */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Distance</h3>
                  <div className="flex flex-wrap gap-2">
                    {["0-2", "2-5", "5-10", "10-"].map((option) => (
                      <Badge
                        key={option}
                        variant={selectedDistance.includes(option) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedDistance.includes(option) ? "bg-blue-900" : "hover:bg-blue-100 hover:text-blue-900"
                        }`}
                        onClick={() => toggleDistance(option)}
                      >
                        {option.includes("-")
                          ? option.endsWith("-")
                            ? `${option.split("-")[0]}+ km`
                            : `${option.split("-")[0]}-${option.split("-")[1]} km`
                          : `${option} km`}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mobile Facilities */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "AC",
                      "Parking",
                      "Personal Trainer",
                      "Locker",
                      "Shower",
                      "Women's Hours",
                      "24/7",
                      "Pool",
                      "Spa",
                      "Group Classes",
                    ].map((facility) => (
                      <Badge
                        key={facility}
                        variant={selectedFacilities.includes(facility) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedFacilities.includes(facility)
                            ? "bg-blue-900"
                            : "hover:bg-blue-100 hover:text-blue-900"
                        }`}
                        onClick={() => toggleFacility(facility)}
                      >
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mobile Ratings */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Ratings</h3>
                  <div className="flex flex-wrap gap-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <Badge
                        key={rating}
                        variant={selectedRatings.includes(rating) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedRatings.includes(rating) ? "bg-blue-900" : "hover:bg-blue-100 hover:text-blue-900"
                        }`}
                        onClick={() => toggleRating(rating)}
                      >
                        {rating}+ <Star className="h-3 w-3 fill-orange-500 text-orange-500 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-blue-900 hover:bg-blue-800" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            )}
          </div>

          {/* Gym Listings */}
          <div className="lg:w-3/4">
            <TabsContent value="list" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{filteredGyms.length} Gyms Found</h2>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden lg:flex items-center">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Sort by: {sortBy === "recommended" ? "Recommended" : sortBy.replace("-", " to ")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0">
                    <div className="flex flex-col">
                      {[
                        { id: "recommended", label: "Recommended" },
                        { id: "price-low", label: "Price: Low to High" },
                        { id: "price-high", label: "Price: High to Low" },
                        { id: "rating", label: "Highest Rated" },
                        { id: "distance", label: "Nearest" },
                      ].map((option) => (
                        <Button
                          key={option.id}
                          variant="ghost"
                          className={`justify-start ${sortBy === option.id ? "bg-blue-50 text-blue-900" : ""}`}
                          onClick={() => {
                            setSortBy(option.id)
                            applyFilters()
                          }}
                        >
                          {option.label}
                          {sortBy === option.id && <CheckCircle className="ml-auto h-4 w-4" />}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Active Filters */}
              {(selectedDistance.length > 0 ||
                selectedFacilities.length > 0 ||
                selectedRatings.length > 0 ||
                priceRange[0] > 0 ||
                priceRange[1] < 1000) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {priceRange[0] > 0 || priceRange[1] < 1000 ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          setPriceRange([0, 1000])
                          applyFilters()
                        }}
                      />
                    </Badge>
                  ) : null}

                  {selectedDistance.map((distance) => (
                    <Badge key={distance} variant="secondary" className="flex items-center gap-1">
                      {distance.includes("-")
                        ? distance.endsWith("-")
                          ? `${distance.split("-")[0]}+ km`
                          : `${distance.split("-")[0]}-${distance.split("-")[1]} km`
                        : `${distance} km`}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          toggleDistance(distance)
                          applyFilters()
                        }}
                      />
                    </Badge>
                  ))}

                  {selectedFacilities.map((facility) => (
                    <Badge key={facility} variant="secondary" className="flex items-center gap-1">
                      {facility}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          toggleFacility(facility)
                          applyFilters()
                        }}
                      />
                    </Badge>
                  ))}

                  {selectedRatings.map((rating) => (
                    <Badge key={rating} variant="secondary" className="flex items-center gap-1">
                      {rating}+ <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          toggleRating(rating)
                          applyFilters()
                        }}
                      />
                    </Badge>
                  ))}

                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={resetFilters}>
                    Clear All
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGyms.length > 0 ? (
                  filteredGyms.map((gym) => (
                    <Card key={gym.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={gym.image || "/placeholder.svg"}
                          alt={gym.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white text-blue-900 flex items-center gap-1">
                            <Star className="fill-orange-500 text-orange-500" size={14} />
                            {gym.rating}
                          </Badge>
                        </div>
                        {gym.verified && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-green-500 text-white flex items-center gap-1">
                              <CheckCircle size={14} />
                              Verified
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle>{gym.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {gym.location}
                          <Badge variant="outline" className="ml-2 bg-blue-50">
                            {gym.distance}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {gym.features.slice(0, 3).map((feature, i) => (
                            <Badge key={i} variant="outline" className="bg-blue-50">
                              {feature}
                            </Badge>
                          ))}
                          {gym.features.length > 3 && (
                            <Badge variant="outline" className="bg-blue-50">
                              +{gym.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <p className="font-bold text-blue-900">
                          Starting from <span className="text-lg">{gym.price}</span>/day
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/gyms/${gym.id}`} className="w-full">
                          <Button className="w-full bg-orange-500 hover:bg-orange-600">View Gym</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No gyms found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search for a different location</p>
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>

              {filteredGyms.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" className="mx-1">
                    1
                  </Button>
                  <Button variant="outline" className="mx-1">
                    2
                  </Button>
                  <Button variant="outline" className="mx-1">
                    3
                  </Button>
                  <Button variant="ghost" className="mx-1">
                    ...
                  </Button>
                  <Button variant="outline" className="mx-1">
                    8
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="h-[600px]">
                  <MapView gyms={filteredGyms} userLocation={userLocation} />
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
