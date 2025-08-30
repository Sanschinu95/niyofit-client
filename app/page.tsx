import Link from "next/link"
import { ArrowRight, Star, Clock, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import HeroParticles from "@/components/hero-particles"
import StatsCounter from "@/components/stats-counter"
import CountdownTimer from "@/components/countdown-timer"


import AnimatedNavbar from "@/components/animated-navbar"
import HowItWorksSection from "@/components/how-it-works-section"
import GymSearchWidget from "@/components/gym-search-widget"

export default function Home() {
  // Set target date for countdown (24 hours from now)
  const targetDate = new Date()
  targetDate.setHours(targetDate.getHours() + 24)

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedNavbar />



      {/* Hero Section with FOMO elements */}
      <section className="relative text-white pt-28 pb-24 md:pt-36 md:pb-28">
        <div className="absolute inset-0 overflow-hidden">
          {/* Using the provided image as background */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src="/images/hero-background.jpeg"
            alt="Fitness training with battle ropes"
            className="w-full h-full object-cover"
          />
          {/* Dynamic particles overlay */}
          <div className="absolute inset-0 z-10 opacity-30">
            <HeroParticles />
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl mx-auto text-center mb-12">


            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your <span className="text-orange-500">Fitness Journey</span> Today
            </h1>

            <p className="text-xl md:text-2xl mb-4">
              India's largest pay-per-day gym network with <span className="font-bold">2000+</span> verified fitness
              centers
            </p>



            {/* Dynamic Stats Counter */}
            <div className="flex justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
                  <StatsCounter value={500000} suffix="+" />
                </div>
                <div className="text-sm text-blue-100">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
                  <StatsCounter value={20} suffix="+" />
                </div>
                <div className="text-sm text-blue-100">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
                  <StatsCounter value={2000} suffix="+" />
                </div>
                <div className="text-sm text-blue-100">Gym Partners</div>
              </div>
            </div>

            {/* Search Widget */}
            <GymSearchWidget />


          </div>
        </div>

        {/* Dynamic Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* How It Works - New Dynamic Section */}
      <HowItWorksSection />

      {/* Popular Gyms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">Popular Gyms Nearby</h2>
            <Link href="/search" className="text-blue-900 font-medium flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "fitzone-premium",
                name: "FitZone Premium",
                location: "Bandra West, Mumbai",
                rating: 4.8,
                image: "/placeholder.svg?height=300&width=500",
                price: "₹499",
                features: ["AC", "Personal Trainer", "24/7"],
                verified: true,
              },
              {
                id: "powerhouse-gym",
                name: "PowerHouse Gym",
                location: "Koramangala, Bangalore",
                rating: 4.7,
                image: "/placeholder.svg?height=300&width=500",
                price: "₹399",
                features: ["AC", "Parking", "Women's Hours"],
                verified: true,
              },
              {
                id: "iron-fitness",
                name: "Iron Fitness Club",
                location: "Connaught Place, Delhi",
                rating: 4.6,
                image: "/placeholder.svg?height=300&width=500",
                price: "₹449",
                features: ["AC", "Locker", "Cardio Zone"],
                verified: true,
              },
            ].map((gym) => (
              <Card key={gym.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img src={gym.image || "/placeholder.svg"} alt={gym.name} className="w-full h-full object-cover" />
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
                    <span className="mr-1">📍</span>
                    {gym.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {gym.features.map((feature, i) => (
                      <Badge key={i} variant="outline" className="bg-blue-50">
                        {feature}
                      </Badge>
                    ))}
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
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/search">
              <Button className="bg-blue-900 hover:bg-blue-800">
                Explore All Gyms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  )
}
