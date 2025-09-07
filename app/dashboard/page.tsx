"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  User, 
  Calendar, 
  CreditCard, 
  Clock, 
  Dumbbell, 
  MapPin, 
  Star, 
  ChevronRight,
  Settings,
  LogOut,
  Loader2,
  Activity,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { apiService, Gym, SubscriptionListing } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth()
  
  const [gyms, setGyms] = useState<Gym[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscriptionListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated, authLoading, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch user's gyms and subscriptions
      const [gymsResponse, subscriptionsResponse] = await Promise.all([
        apiService.getGyms({ limit: 5 }),
        apiService.getSubscriptionListings({ limit: 10 })
      ])

      if (gymsResponse.success && gymsResponse.data) {
        setGyms(gymsResponse.data.gyms)
      }

      if (subscriptionsResponse.success && subscriptionsResponse.data) {
        setSubscriptions(subscriptionsResponse.data.subscriptions)
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Here's your fitness journey overview</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-20">
              <div className="bg-blue-900 text-white p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <p className="text-blue-200 text-sm">{user?.email}</p>
                <Badge className="mt-2 bg-blue-700 text-white">
                  {user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1)}
                </Badge>
              </div>
              
              <div className="p-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  Activity
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Bookings
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payments
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gyms">My Gyms</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Gyms</CardTitle>
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{gyms.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Gyms in your area
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{subscriptions.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Current memberships
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">This Month</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">
                        Workout sessions
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest fitness activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Workout completed</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">New subscription activated</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Gym booking confirmed</p>
                          <p className="text-xs text-gray-500">3 days ago</p>
                        </div>
                        <Badge variant="outline">Confirmed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gyms Tab */}
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Gyms</CardTitle>
                    <CardDescription>Gyms in your area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading gyms...</span>
                      </div>
                    ) : gyms.length > 0 ? (
                      <div className="space-y-4">
                        {gyms.map((gym) => (
                          <div key={gym._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Dumbbell className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium">{gym.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {gym.location?.address.city}, {gym.location?.address.state}
                                </p>
                                {gym.rating && (
                                  <div className="flex items-center mt-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs ml-1">{gym.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No gyms available at the moment</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Subscriptions Tab */}
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Subscriptions</CardTitle>
                    <CardDescription>Your current gym memberships</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading subscriptions...</span>
                      </div>
                    ) : subscriptions.length > 0 ? (
                      <div className="space-y-4">
                        {subscriptions.map((subscription) => (
                          <div key={subscription._id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{subscription.name}</h3>
                              <Badge variant="outline">
                                {subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {subscription.description || `${subscription.durationInDays} days access`}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">
                                ₹{subscription.cost}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Progress value={75} className="w-20" />
                                <span className="text-xs text-gray-500">75% used</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No active subscriptions</p>
                        <Button className="mt-4" onClick={() => router.push('/gyms')}>
                          Browse Gyms
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}