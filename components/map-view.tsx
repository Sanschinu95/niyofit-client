"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"
import Link from "next/link"

interface Gym {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  rating: number
  image: string
  price: string
  features: string[]
  verified: boolean
}

interface MapViewProps {
  gyms: Gym[]
  userLocation: { lat: number; lng: number } | null
}

export default function MapView({ gyms, userLocation }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])

  // Initialize map
  useEffect(() => {
    // This is a placeholder for Google Maps integration
    // In a real app, you would use the Google Maps API
    if (!mapRef.current) return

    // Create a simple map placeholder
    const mapElement = document.createElement("div")
    mapElement.className = "w-full h-full bg-blue-50 relative"
    mapElement.innerHTML = `
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-900 mb-2">Map View</div>
          <p class="text-gray-600">In a real app, this would be an interactive Google Map showing gym locations</p>
        </div>
      </div>
    `
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(mapElement)

    // Add gym markers to the map
    const markersContainer = document.createElement("div")
    markersContainer.className = "absolute inset-0"
    mapElement.appendChild(markersContainer)

    // Add user location marker if available
    if (userLocation) {
      const userMarker = document.createElement("div")
      userMarker.className =
        "absolute w-6 h-6 bg-blue-600 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20"
      userMarker.style.left = "50%"
      userMarker.style.top = "50%"
      markersContainer.appendChild(userMarker)

      // Add pulse effect
      const pulse = document.createElement("div")
      pulse.className =
        "absolute w-12 h-12 bg-blue-400 rounded-full opacity-70 animate-ping transform -translate-x-1/2 -translate-y-1/2"
      pulse.style.left = "50%"
      pulse.style.top = "50%"
      markersContainer.appendChild(pulse)
    }

    // Add gym markers
    const newMarkers = gyms.map((gym, index) => {
      const marker = document.createElement("div")
      marker.className = `absolute w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center 
        font-bold border-2 border-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:bg-orange-600 transition-colors
        ${selectedGym?.id === gym.id ? "ring-4 ring-orange-300" : ""}`

      // Position markers in a grid for the demo
      const col = index % 3
      const row = Math.floor(index / 3)
      marker.style.left = `${25 + col * 25}%`
      marker.style.top = `${25 + row * 25}%`

      marker.textContent = (index + 1).toString()
      marker.addEventListener("click", () => setSelectedGym(gym))
      markersContainer.appendChild(marker)
      return marker
    })

    setMarkers(newMarkers)

    return () => {
      newMarkers.forEach((marker) => marker.remove())
    }
  }, [gyms, userLocation, selectedGym])

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full"></div>

      {/* Selected Gym Info */}
      {selectedGym && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80">
          <Card className="shadow-lg">
            <div className="relative h-32">
              <img
                src={selectedGym.image || "/placeholder.svg"}
                alt={selectedGym.name}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                onClick={() => setSelectedGym(null)}
              >
                ✕
              </Button>
              <div className="absolute top-2 left-2">
                <Badge className="bg-white text-blue-900 flex items-center gap-1">
                  <Star className="fill-orange-500 text-orange-500" size={14} />
                  {selectedGym.rating}
                </Badge>
              </div>
            </div>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-lg">{selectedGym.name}</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {selectedGym.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedGym.features.slice(0, 2).map((feature, i) => (
                  <Badge key={i} variant="outline" className="bg-blue-50 text-xs">
                    {feature}
                  </Badge>
                ))}
                {selectedGym.features.length > 2 && (
                  <Badge variant="outline" className="bg-blue-50 text-xs">
                    +{selectedGym.features.length - 2}
                  </Badge>
                )}
              </div>
              <p className="font-bold text-blue-900 text-sm">
                From <span>{selectedGym.price}</span>/day
              </p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Link href={`/gyms/${selectedGym.id}`} className="w-full">
                <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                  View Gym
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
