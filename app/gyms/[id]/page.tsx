"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  Share2,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Mock gym data
const mockGyms = {
  "fitzone-premium": {
    id: "fitzone-premium",
    name: "FitZone Premium Gym",
    location: "Bandra West, Mumbai",
    address: "24, Hill Road, Bandra West, Mumbai, Maharashtra 400050",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    rating: 4.8,
    reviewCount: 124,
    description:
      "FitZone Premium is a state-of-the-art fitness center located in the heart of Bandra West. Our gym offers a comprehensive range of equipment and services to help you achieve your fitness goals. With experienced trainers, spacious workout areas, and a welcoming atmosphere, we provide everything you need for a successful fitness journey.",
    images: [
      "/placeholder.svg?height=500&width=600&text=Main+View",
      "/placeholder.svg?height=240&width=300&text=Equipment",
      "/placeholder.svg?height=240&width=300&text=Cardio+Area",
      "/placeholder.svg?height=240&width=300&text=Weight+Area",
      "/placeholder.svg?height=240&width=300&text=Locker+Room",
    ],
    hours: {
      weekdays: "5:00 AM - 11:00 PM",
      saturday: "6:00 AM - 10:00 PM",
      sunday: "7:00 AM - 9:00 PM",
      women: "Tue & Thu: 2:00 PM - 4:00 PM",
    },
    facilities: [
      "Air Conditioning",
      "Cardio Equipment",
      "Free Weights",
      "Strength Machines",
      "Personal Trainers",
      "Locker Rooms",
      "Showers",
      "Towel Service",
      "Parking",
      "Wifi",
      "Water Dispenser",
      "Protein Shop",
    ],
    trainers: [
      {
        name: "Rahul Sharma",
        specialty: "Strength Training",
        image: "/placeholder.svg?height=300&width=300&text=Trainer+1",
        experience: "5+ years",
      },
      {
        name: "Priya Patel",
        specialty: "Weight Loss",
        image: "/placeholder.svg?height=300&width=300&text=Trainer+2",
        experience: "7+ years",
      },
      {
        name: "Amit Kumar",
        specialty: "Functional Training",
        image: "/placeholder.svg?height=300&width=300&text=Trainer+3",
        experience: "4+ years",
      },
    ],
    reviews: [
      {
        user: "Vikram S.",
        avatar: "/placeholder.svg?height=40&width=40&text=VS",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Great gym with excellent equipment and friendly staff. The trainers are very knowledgeable and helpful. Highly recommend!",
      },
      {
        user: "Neha T.",
        avatar: "/placeholder.svg?height=40&width=40&text=NT",
        rating: 4,
        date: "1 month ago",
        comment:
          "Clean facilities and a good variety of equipment. The location is convenient and the atmosphere is motivating. Would recommend to friends.",
      },
      {
        user: "Rajesh K.",
        avatar: "/placeholder.svg?height=40&width=40&text=RK",
        rating: 5,
        date: "2 months ago",
        comment:
          "I've been a member for 3 months and I'm very satisfied with the facilities. The staff is friendly and the equipment is well-maintained.",
      },
    ],
    passes: [
      {
        title: "Day Pass",
        price: "₹499",
        description: "Single day access to all facilities",
        popular: false,
      },
      {
        title: "Weekly Pass",
        price: "₹1,999",
        description: "7 days of unlimited access",
        popular: true,
      },
      {
        title: "Monthly Pass",
        price: "₹4,999",
        description: "30 days of unlimited access",
        popular: false,
      },
    ],
    contact: {
      phone: "+91 98765 43210",
      email: "info@fitzonepremium.com",
      website: "www.fitzonepremium.com",
    },
  },
  "powerhouse-gym": {
    id: "powerhouse-gym",
    name: "PowerHouse Gym",
    location: "Andheri East, Mumbai",
    address: "42, MIDC, Andheri East, Mumbai, Maharashtra 400093",
    coordinates: { lat: 19.1136, lng: 72.8697 },
    rating: 4.6,
    reviewCount: 98,
    description:
      "PowerHouse Gym is a premier fitness facility in Andheri East, offering state-of-the-art equipment and expert training. Our mission is to provide a motivating environment where members of all fitness levels can achieve their goals.",
    images: [
      "/placeholder.svg?height=500&width=600&text=PowerHouse+Main",
      "/placeholder.svg?height=240&width=300&text=Free+Weights",
      "/placeholder.svg?height=240&width=300&text=Cardio+Zone",
      "/placeholder.svg?height=240&width=300&text=Functional+Area",
      "/placeholder.svg?height=240&width=300&text=Changing+Room",
    ],
    hours: {
      weekdays: "6:00 AM - 10:00 PM",
      saturday: "7:00 AM - 9:00 PM",
      sunday: "8:00 AM - 8:00 PM",
      women: "Mon & Wed: 1:00 PM - 3:00 PM",
    },
    facilities: [
      "Air Conditioning",
      "Cardio Zone",
      "Free Weights",
      "Strength Machines",
      "CrossFit Area",
      "Locker Rooms",
      "Showers",
      "Parking",
      "Wifi",
      "Protein Bar",
    ],
    trainers: [
      {
        name: "Vikram Singh",
        specialty: "CrossFit",
        image: "/placeholder.svg?height=300&width=300&text=Trainer+1",
        experience: "8+ years",
      },
      {
        name: "Ananya Desai",
        specialty: "HIIT",
        image: "/placeholder.svg?height=300&width=300&text=Trainer+2",
        experience: "6+ years",
      },
    ],
    reviews: [
      {
        user: "Arjun M.",
        avatar: "/placeholder.svg?height=40&width=40&text=AM",
        rating: 5,
        date: "1 week ago",
        comment:
          "Excellent gym with great equipment. The trainers are very professional and the atmosphere is energetic.",
      },
      {
        user: "Sneha R.",
        avatar: "/placeholder.svg?height=40&width=40&text=SR",
        rating: 4,
        date: "3 weeks ago",
        comment:
          "Good variety of equipment and classes. The gym is always clean and well-maintained. Highly recommended.",
      },
    ],
    passes: [
      {
        title: "Day Pass",
        price: "₹399",
        description: "Single day access to all facilities",
        popular: false,
      },
      {
        title: "Weekly Pass",
        price: "₹1,799",
        description: "7 days of unlimited access",
        popular: true,
      },
      {
        title: "Monthly Pass",
        price: "₹4,499",
        description: "30 days of unlimited access",
        popular: false,
      },
    ],
    contact: {
      phone: "+91 98765 12345",
      email: "info@powerhousegym.com",
      website: "www.powerhousegym.com",
    },
  },
  "iron-fitness": {
    id: "iron-fitness",
    name: "Iron Fitness Club",
    location: "Juhu, Mumbai",
    address: "10, Juhu Tara Road, Juhu, Mumbai, Maharashtra 400049",
    coordinates: { lat: 19.0883, lng: 72.8264 },
    rating: 4.7,
    reviewCount: 112,
    description:
      "Iron Fitness Club is a premium fitness destination in Juhu, offering a comprehensive range of equipment and services. Our expert trainers and modern facilities create the perfect environment for achieving your fitness goals.",
    images: [
      "/placeholder.svg?height=500&width=600&text=Iron+Fitness+Main",
      "/placeholder.svg?height=240&width=300&text=Strength+Area",
      "/placeholder.svg?height=240&width=300&text=Cardio+Machines",
      "/placeholder.svg?height=240&width=300&text=Studio",
      "/placeholder.svg?height=240&width=300&text=Spa",
    ],
    hours: {
      weekdays: "5:30 AM - 11:30 PM",
      saturday: "6:00 AM - 10:00 PM",
      sunday: "7:00 AM - 9:00 PM",
      women: "Tue & Thu: 3:00 PM - 5:00 PM",
    },
    facilities: [
      "Air Conditioning",
      "Cardio Zone",
      "Free Weights",
      "Strength Machines",
      "Yoga Studio",
      "Locker Rooms",
      "Showers",
      "Sauna",
      "Parking",
      "Wifi",
      "Juice Bar",
    ],
    trainers: [
      {
        name: "Karan Malhotra",
        specialty: "Bodybuilding",
        image: "/placeholder.svg?height=300&width=300&text=Trainer+1",
        experience: "10+ years",
      },
      {
        name: "Meera Kapoor",
        specialty: "Yoga & Pilates",
        image: "/placeholder.svg?height=300&width=300&text=Trainer+2",
        experience: "7+ years",
      },
      {
        name: "Rohan Verma",
        specialty: "Sports Conditioning",
        image: "/placeholder.svg?height=300&width=300&text=Trainer+3",
        experience: "5+ years",
      },
    ],
    reviews: [
      {
        user: "Aditya S.",
        avatar: "/placeholder.svg?height=40&width=40&text=AS",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Top-notch facilities and excellent trainers. The environment is very motivating and the equipment is always well-maintained.",
      },
      {
        user: "Pooja M.",
        avatar: "/placeholder.svg?height=40&width=40&text=PM",
        rating: 4,
        date: "1 month ago",
        comment:
          "Great gym with a wide variety of equipment. The staff is friendly and helpful. The location is convenient too.",
      },
    ],
    passes: [
      {
        title: "Day Pass",
        price: "₹449",
        description: "Single day access to all facilities",
        popular: false,
      },
      {
        title: "Weekly Pass",
        price: "₹1,899",
        description: "7 days of unlimited access",
        popular: true,
      },
      {
        title: "Monthly Pass",
        price: "₹4,799",
        description: "30 days of unlimited access",
        popular: false,
      },
    ],
    contact: {
      phone: "+91 98765 67890",
      email: "info@ironfitness.com",
      website: "www.ironfitness.com",
    },
  },
}

export default function GymDetailPage() {
  const params = useParams()
  const gymId = params.id as string
  const gym = mockGyms[gymId as keyof typeof mockGyms]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedPass, setSelectedPass] = useState<string | null>(null)

  if (!gym) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Gym not found</h1>
        <p className="mb-6">The gym you are looking for does not exist or has been removed.</p>
        <Link href="/gyms">
          <Button>Back to Gyms</Button>
        </Link>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % gym.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + gym.images.length) % gym.images.length)
  }

  const handlePassSelect = (title: string) => {
    setSelectedPass(title === selectedPass ? null : title)
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
            <div className="flex items-center mb-2">
              <MapPin size={16} className="text-gray-500 mr-1" />
              <span className="text-gray-600">{gym.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-orange-500 text-orange-500" />
                <span className="ml-1 font-bold">{gym.rating}</span>
                <span className="ml-1 text-gray-500">({gym.reviewCount} reviews)</span>
              </div>
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

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={gym.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${gym.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-[400px] object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {gym.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  } transition-all`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {gym.images.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${gym.name} - Thumbnail ${index + 1}`}
                className={`h-20 w-full object-cover rounded cursor-pointer ${
                  index === currentImageIndex ? "ring-2 ring-orange-500" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
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
                <TabsTrigger value="trainers">Trainers</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-3">About {gym.name}</h2>
                    <p className="text-gray-700">{gym.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3">Hours of Operation</h3>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Weekdays:</span>
                        <span>{gym.hours.weekdays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saturday:</span>
                        <span>{gym.hours.saturday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sunday:</span>
                        <span>{gym.hours.sunday}</span>
                      </div>
                      {gym.hours.women && (
                        <div className="flex justify-between text-blue-900">
                          <span className="font-medium">Women's Hours:</span>
                          <span>{gym.hours.women}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-blue-900 mr-2" />
                        <a href={`tel:${gym.contact.phone}`} className="text-blue-900 hover:underline">
                          {gym.contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-900 mr-2" />
                        <a href={`mailto:${gym.contact.email}`} className="text-blue-900 hover:underline">
                          {gym.contact.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-blue-900 mr-2" />
                        <a
                          href={`https://${gym.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-900 hover:underline"
                        >
                          {gym.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Facilities Tab */}
              <TabsContent value="facilities" className="mt-6">
                <h2 className="text-xl font-bold mb-4">Facilities & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gym.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center bg-blue-50 p-3 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Trainers Tab */}
              <TabsContent value="trainers" className="mt-6">
                <h2 className="text-xl font-bold mb-4">Our Expert Trainers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {gym.trainers.map((trainer, index) => (
                    <Card key={index}>
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={trainer.image || "/placeholder.svg"}
                          alt={trainer.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle>{trainer.name}</CardTitle>
                        <CardDescription>{trainer.specialty}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="bg-blue-50">
                          {trainer.experience} experience
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Customer Reviews</h2>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-orange-500 text-orange-500" />
                    <span className="ml-1 font-bold">{gym.rating}</span>
                    <span className="ml-1 text-gray-500">({gym.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {gym.reviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.user}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium">{review.user}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
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
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline">View All Reviews</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:w-1/3">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Book Your Pass</CardTitle>
                <CardDescription>Choose a pass that suits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gym.passes.map((pass, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPass === pass.title
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    } ${pass.popular ? "relative" : ""}`}
                    onClick={() => handlePassSelect(pass.title)}
                  >
                    {pass.popular && <Badge className="absolute -top-2 -right-2 bg-orange-500">Most Popular</Badge>}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{pass.title}</h3>
                      <span className="text-xl font-bold text-blue-900">{pass.price}</span>
                    </div>
                    <p className="text-sm text-gray-600">{pass.description}</p>
                  </div>
                ))}

                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <Info className="h-5 w-5 text-blue-900 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    All passes include access to all facilities and amenities. Personal training sessions are available
                    at an additional cost.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Link href={`/checkout?gym=${gymId}&pass=${selectedPass}`} className="w-full">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" disabled={!selectedPass}>
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

        {/* Similar Gyms */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Gyms Nearby</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(mockGyms)
              .filter((g) => g.id !== gymId)
              .slice(0, 3)
              .map((similarGym) => (
                <Card key={similarGym.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={similarGym.images[0] || "/placeholder.svg"}
                      alt={similarGym.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white text-blue-900 flex items-center gap-1">
                        <Star className="fill-orange-500 text-orange-500" size={14} />
                        {similarGym.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{similarGym.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {similarGym.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {similarGym.facilities.slice(0, 3).map((feature, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-50">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <p className="font-bold text-blue-900">
                      Starting from <span className="text-lg">{similarGym.passes[0].price}</span>/day
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/gyms/${similarGym.id}`} className="w-full">
                      <Button className="w-full bg-blue-900 hover:bg-blue-800">View Gym</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
