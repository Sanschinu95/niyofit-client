"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Dumbbell, 
  Users,
  Building,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { apiService, Location, Gym } from "@/lib/api"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  
  const [activeTab, setActiveTab] = useState("gyms")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [gyms, setGyms] = useState<Gym[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  
  // Form states
  const [gymForm, setGymForm] = useState({
    name: "",
    description: "",
    locationId: "",
    phone: "",
    email: "",
    website: "",
    priceRange: "mid-range",
    rating: "",
    isActive: true
  })
  
  const [locationForm, setLocationForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    latitude: "",
    longitude: ""
  })
  
  // Dialog states
  const [gymDialogOpen, setGymDialogOpen] = useState(false)
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const [editingGym, setEditingGym] = useState<Gym | null>(null)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated && user?.userType !== 'superadmin' && user?.userType !== 'admin') {
      router.push('/dashboard')
      return
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, authLoading, router, user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [gymsResponse, locationsResponse] = await Promise.all([
        apiService.getGyms({ limit: 100 }),
        apiService.getLocations({ limit: 100 })
      ])

      if (gymsResponse.success && gymsResponse.data) {
        setGyms(gymsResponse.data.gyms)
      }

      if (locationsResponse.success && locationsResponse.data) {
        setLocations(locationsResponse.data.locations)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleGymSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const gymData = {
        name: gymForm.name,
        description: gymForm.description,
        locationId: gymForm.locationId,
        contact: {
          phone: gymForm.phone,
          email: gymForm.email,
          website: gymForm.website
        },
        priceRange: gymForm.priceRange,
        rating: gymForm.rating ? parseFloat(gymForm.rating) : undefined,
        isActive: gymForm.isActive
      }

      let response
      if (editingGym) {
        response = await apiService.updateGym(editingGym._id, gymData)
      } else {
        response = await apiService.createGym(gymData)
      }
      
      if (response.success) {
        setSuccess(editingGym ? "Gym updated successfully!" : "Gym added successfully!")
        resetGymForm()
        fetchData()
      } else {
        setError(response.error || "Failed to save gym")
      }
    } catch (error) {
      console.error("Error saving gym:", error)
      setError("Failed to save gym")
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const locationData = {
        name: locationForm.name,
        address: {
          street: locationForm.street,
          city: locationForm.city,
          state: locationForm.state,
          pinCode: locationForm.pinCode,
          country: locationForm.country
        },
        latitude: parseFloat(locationForm.latitude),
        longitude: parseFloat(locationForm.longitude)
      }

      let response
      if (editingLocation) {
        response = await apiService.updateLocation(editingLocation._id, locationData)
      } else {
        response = await apiService.createLocation(locationData)
      }
      
      if (response.success) {
        setSuccess(editingLocation ? "Location updated successfully!" : "Location added successfully!")
        resetLocationForm()
        fetchData()
      } else {
        setError(response.error || "Failed to save location")
      }
    } catch (error) {
      console.error("Error saving location:", error)
      setError("Failed to save location")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGym = async (gym: Gym) => {
    if (!confirm(`Are you sure you want to delete "${gym.name}"?`)) return

    try {
      setLoading(true)
      const response = await apiService.deleteGym(gym._id)
      
      if (response.success) {
        setSuccess("Gym deleted successfully!")
        fetchData()
      } else {
        setError(response.error || "Failed to delete gym")
      }
    } catch (error) {
      console.error("Error deleting gym:", error)
      setError("Failed to delete gym")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLocation = async (location: Location) => {
    if (!confirm(`Are you sure you want to delete "${location.name}"?`)) return

    try {
      setLoading(true)
      const response = await apiService.deleteLocation(location._id)
      
      if (response.success) {
        setSuccess("Location deleted successfully!")
        fetchData()
      } else {
        setError(response.error || "Failed to delete location")
      }
    } catch (error) {
      console.error("Error deleting location:", error)
      setError("Failed to delete location")
    } finally {
      setLoading(false)
    }
  }

  const resetGymForm = () => {
    setGymForm({
      name: "",
      description: "",
      locationId: "",
      phone: "",
      email: "",
      website: "",
      priceRange: "mid-range",
      rating: "",
      isActive: true
    })
    setEditingGym(null)
    setGymDialogOpen(false)
  }

  const resetLocationForm = () => {
    setLocationForm({
      name: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      latitude: "",
      longitude: ""
    })
    setEditingLocation(null)
    setLocationDialogOpen(false)
  }

  const openEditGym = (gym: Gym) => {
    setEditingGym(gym)
    setGymForm({
      name: gym.name,
      description: gym.description || "",
      locationId: gym.locationId,
      phone: gym.contact?.phone || "",
      email: gym.contact?.email || "",
      website: gym.contact?.website || "",
      priceRange: gym.priceRange || "mid-range",
      rating: gym.rating?.toString() || "",
      isActive: gym.isActive
    })
    setGymDialogOpen(true)
  }

  const openEditLocation = (location: Location) => {
    setEditingLocation(location)
    setLocationForm({
      name: location.name,
      street: location.address.street,
      city: location.address.city,
      state: location.address.state,
      pinCode: location.address.pinCode,
      country: location.address.country,
      latitude: location.coordinates.coordinates[1].toString(),
      longitude: location.coordinates.coordinates[0].toString()
    })
    setLocationDialogOpen(true)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated || (user?.userType !== 'superadmin' && user?.userType !== 'admin')) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage gyms and locations</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gyms">Gyms ({gyms.length})</TabsTrigger>
            <TabsTrigger value="locations">Locations ({locations.length})</TabsTrigger>
          </TabsList>

          {/* Gyms Tab */}
          <TabsContent value="gyms" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5" />
                    Gyms
                  </CardTitle>
                  <CardDescription>Manage gym listings</CardDescription>
                </div>
                <Dialog open={gymDialogOpen} onOpenChange={setGymDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetGymForm}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Gym
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingGym ? "Edit Gym" : "Add New Gym"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingGym ? "Update gym information" : "Add a new gym to the platform"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleGymSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gym-name">Gym Name *</Label>
                          <Input
                            id="gym-name"
                            value={gymForm.name}
                            onChange={(e) => setGymForm({ ...gymForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location-select">Location *</Label>
                          <Select value={gymForm.locationId} onValueChange={(value) => setGymForm({ ...gymForm, locationId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location._id} value={location._id}>
                                  {location.name} - {location.address.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={gymForm.description}
                          onChange={(e) => setGymForm({ ...gymForm, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={gymForm.phone}
                            onChange={(e) => setGymForm({ ...gymForm, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={gymForm.email}
                            onChange={(e) => setGymForm({ ...gymForm, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={gymForm.website}
                            onChange={(e) => setGymForm({ ...gymForm, website: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price-range">Price Range</Label>
                          <Select value={gymForm.priceRange} onValueChange={(value) => setGymForm({ ...gymForm, priceRange: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="budget">Budget</SelectItem>
                              <SelectItem value="mid-range">Mid-Range</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rating">Rating (1-5)</Label>
                          <Input
                            id="rating"
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={gymForm.rating}
                            onChange={(e) => setGymForm({ ...gymForm, rating: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={resetGymForm}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !gymForm.locationId}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              {editingGym ? "Update" : "Add"} Gym
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gyms.map((gym) => (
                    <div key={gym._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{gym.name}</h3>
                        <p className="text-sm text-gray-600">{gym.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{gym.priceRange}</Badge>
                          {gym.rating && <Badge variant="outline">{gym.rating} ⭐</Badge>}
                          <Badge variant={gym.isActive ? "default" : "secondary"}>
                            {gym.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditGym(gym)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGym(gym)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {gyms.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No gyms found. Add your first gym to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Locations
                  </CardTitle>
                  <CardDescription>Manage gym locations</CardDescription>
                </div>
                <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetLocationForm}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Location
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingLocation ? "Edit Location" : "Add New Location"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingLocation ? "Update location information" : "Add a new location for gyms"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLocationSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="location-name">Location Name *</Label>
                        <Input
                          id="location-name"
                          value={locationForm.name}
                          onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address *</Label>
                          <Input
                            id="street"
                            value={locationForm.street}
                            onChange={(e) => setLocationForm({ ...locationForm, street: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={locationForm.city}
                            onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={locationForm.state}
                            onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pinCode">PIN Code *</Label>
                          <Input
                            id="pinCode"
                            value={locationForm.pinCode}
                            onChange={(e) => setLocationForm({ ...locationForm, pinCode: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            value={locationForm.country}
                            onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">Latitude *</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            value={locationForm.latitude}
                            onChange={(e) => setLocationForm({ ...locationForm, latitude: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longitude">Longitude *</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            value={locationForm.longitude}
                            onChange={(e) => setLocationForm({ ...locationForm, longitude: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={resetLocationForm}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              {editingLocation ? "Update" : "Add"} Location
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div key={location._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{location.name}</h3>
                        <p className="text-sm text-gray-600">
                          {location.address.street}, {location.address.city}, {location.address.state}
                        </p>
                        <p className="text-xs text-gray-500">
                          {location.address.pinCode} • {location.coordinates.coordinates[1]}, {location.coordinates.coordinates[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditLocation(location)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLocation(location)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {locations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No locations found. Add your first location to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}