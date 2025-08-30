import { Search, MapPin, Star, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function GymsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Search Header */}
      <section className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Find Gyms Near You</h1>

          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center bg-gray-100 rounded-md px-3">
              <MapPin className="text-blue-900 mr-2" size={20} />
              <Input
                type="text"
                placeholder="Enter your location or pincode"
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Search className="mr-2" size={18} />
              Search
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Filters</h2>
                <Button variant="ghost" size="sm" className="text-blue-900 h-auto p-1">
                  Reset
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Price Range</h3>
                <Slider defaultValue={[500]} max={2000} step={100} className="mb-2" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹0</span>
                  <span>₹2000+</span>
                </div>
              </div>

              {/* Distance */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Distance</h3>
                <div className="space-y-2">
                  {["0-2 km", "2-5 km", "5-10 km", "10+ km"].map((option) => (
                    <div key={option} className="flex items-center">
                      <Checkbox id={`distance-${option}`} />
                      <label htmlFor={`distance-${option}`} className="ml-2 text-sm">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Facilities</h3>
                <div className="space-y-2">
                  {["AC", "Parking", "Personal Trainer", "Locker", "Shower", "Women's Hours", "24/7 Access"].map(
                    (facility) => (
                      <div key={facility} className="flex items-center">
                        <Checkbox id={`facility-${facility}`} />
                        <label htmlFor={`facility-${facility}`} className="ml-2 text-sm">
                          {facility}
                        </label>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Ratings</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <Checkbox id={`rating-${rating}`} />
                      <label htmlFor={`rating-${rating}`} className="ml-2 text-sm flex items-center">
                        {rating}+ <Star className="h-3 w-3 fill-orange-500 text-orange-500 ml-1" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-blue-900 hover:bg-blue-800">Apply Filters</Button>
            </div>
          </div>

          {/* Gym Listings */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">24 Gyms Found</h2>
              <Button variant="outline" size="sm" className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort by: Recommended
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={`/placeholder.svg?height=300&width=500&text=Gym ${index + 1}`}
                      alt={`Gym ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white text-blue-900 flex items-center gap-1">
                        <Star className="fill-orange-500 text-orange-500" size={14} />
                        {(4 + Math.random()).toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{`FitZone Premium ${index + 1}`}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"][index % 6]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {["AC", "Parking", "Trainer", "Locker", "24/7"].slice(0, 3 + (index % 3)).map((feature, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-50">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <p className="font-bold text-blue-900">
                      Starting from <span className="text-lg">₹{399 + index * 50}</span>/day
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">View Gym</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
