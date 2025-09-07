"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Share2, 
  Heart,
  Loader2,
  Calendar,
  Users,
  Dumbbell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { apiService, Gym, SubscriptionListing, GymReview } from "@/lib/api"

export default function GymDetailPage() {
  const params = useParams()
  const router = useRouter()
  const gymId = params.id as string

  const [gym, setGym] = useState<Gym | null>(null)
  const [subscriptions, setSubscriptions] = useState<SubscriptionListing[]>([])
  const [reviews, setReviews] = useState<GymReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionListing | null>(null)

  useEffect(() => {
    if (gymId) {
      fetchGymDetails()
    }
  }, [gymId])

  const fetchGymDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch gym details
      const gymResponse = await apiService.getGymById(gymId)
      if (gymResponse.success && gymResponse.data) {
        setGym(gymResponse.data)
      } else {
        setError("Gym not found")
        return
      }

      // Fetch subscription listings
      const subscriptionsResponse = await apiService.getGymSubscriptionListings(gymId)
      if (subscriptionsResponse.success && subscriptionsResponse.data) {
        setSubscriptions(subscriptionsResponse.data)
      }

      // Fetch reviews
      const reviewsResponse = await apiService.getGymReviews(gymId)
      if (reviewsResponse.success && reviewsResponse.data) {
        setReviews(reviewsResponse.data)
      }

    } catch (error) {
      console.error("Error fetching gym details:", error)
      setError("Failed to load gym details")
    } finally {
      setLoading(false)
    }
  }

  const formatOpeningHours = (gym: Gym) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    return days.map(day => {
      const hours = gym.openingHours[day as keyof typeof gym.openingHours]
      const dayName = day.charAt(0).toUpperCase() + day.slice(1)
      
      if (hours?.closed) {
        return { day: dayName, hours: "Closed" }
      }
      
      return { 
        day: dayName, 
        hours: hours ? `${hours.open} - ${hours.close}` : "Not specified" 
      }
    })
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading gym details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !gym) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Gym not found</h1>
            <p className="mb-6">{error || "The gym you are looking for does not exist or has been removed."}</p>
            <Link href="/gyms">
              <Button>Back to Gyms</Button>
            </Link>
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
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/gyms">
            <Button variant="ghost" className="flex items-center text-gray-600">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Gyms
            </Button>
          </Link>
        </div>

        {/* Gym Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{gym.name}</h1>
            {gym.location && (
              <div className="flex items-center mb-2">
                <MapPin size={16} className="text-gray-500 mr-1" />
                <span className="text-gray-600">
                  {gym.location.address.street}, {gym.location.address.city}, {gym.location.address.state}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              {gym.rating && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-orange-500 text-orange-500" />
                  <span className="ml-1 font-bold">{gym.rating}</span>
                  <span className="ml-1 text-gray-500">({reviews.length} reviews)</span>
                </div>
              )}
              <Badge className={getPriceRangeColor(gym.priceRange)}>
                {getPriceRangeText(gym.priceRange)}
              </Badge>
              <Badge className="bg-green-500 text-white">Verified</Badge>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Details */}
          <div className="lg:w-2/3">
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-3">About {gym.name}</h2>
                    <p className="text-gray-700">{gym.description || "No description available."}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3">Hours of Operation</h3>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                      {formatOpeningHours(gym).map(({ day, hours }) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{day}:</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      {gym.contact?.phone && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-blue-900 mr-2" />
                          <a href={`tel:${gym.contact.phone}`} className="text-blue-900 hover:underline">
                            {gym.contact.phone}
                          </a>
                        </div>
                      )}
                      {gym.contact?.email && (
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-blue-900 mr-2" />
                          <a href={`mailto:${gym.contact.email}`} className="text-blue-900 hover:underline">
                            {gym.contact.email}
                          </a>
                        </div>
                      )}
                      {gym.contact?.website && (
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 text-blue-900 mr-2" />
                          <a
                            href={gym.contact.website.startsWith('http') ? gym.contact.website : `https://${gym.contact.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-900 hover:underline"
                          >
                            {gym.contact.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Facilities Tab */}
              <TabsContent value="facilities" className="mt-6">
                <h2 className="text-xl font-bold mb-4">Facilities & Amenities</h2>
                {gym.facilities && gym.facilities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gym.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center bg-blue-50 p-3 rounded-lg">
                        <Check className="h-5 w-5 text-green-600 mr-2" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No facilities information available.</p>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Customer Reviews</h2>
                  {gym.rating && (
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-orange-500 text-orange-500" />
                      <span className="ml-1 font-bold">{gym.rating}</span>
                      <span className="ml-1 text-gray-500">({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {review.userId.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">User {review.userId.slice(-4)}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="ml-auto flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment || "No comment provided."}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No reviews yet. Be the first to review this gym!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Subscription Plans */}
          <div className="lg:w-1/3">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Available Plans</CardTitle>
                <CardDescription>Choose a plan that suits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptions.length > 0 ? (
                  subscriptions.map((subscription) => (
                    <div
                      key={subscription._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedSubscription?._id === subscription._id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                      onClick={() => setSelectedSubscription(subscription)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{subscription.name}</h3>
                        <span className="text-xl font-bold text-blue-900">
                          {formatCurrency(subscription.cost, subscription.currency)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {subscription.description || `${subscription.durationInDays} days access`}
                      </p>
                      {subscription.features && subscription.features.length > 0 && (
                        <div className="space-y-1">
                          {subscription.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center text-xs text-gray-600">
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No subscription plans available</p>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <Check className="h-5 w-5 text-blue-900 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    All plans include access to all facilities and amenities. Personal training sessions are available
                    at an additional cost.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Link 
                  href={`/checkout?gym=${gymId}&subscription=${selectedSubscription?._id}`} 
                  className="w-full"
                >
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600" 
                    disabled={!selectedSubscription}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  By booking, you agree to our{" "}
                  <a href="/terms" className="text-blue-900 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-900 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}