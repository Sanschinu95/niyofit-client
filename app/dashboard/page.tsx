import { User, Calendar, CreditCard, Clock, Dumbbell, MapPin, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-20">
              <div className="bg-blue-900 text-white p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
                  <User size={40} className="text-white" />
                </div>
                <h2 className="text-xl font-bold">Rahul Sharma</h2>
                <p className="text-blue-100">Member since Oct 2023</p>
              </div>

              <div className="p-4">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 mb-4">
                    <TabsTrigger value="account" className="justify-start">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </TabsTrigger>
                    <TabsTrigger value="passes" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      My Passes
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="justify-start">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payments
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button variant="outline" className="w-full">
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

            {/* Active Passes */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Active Passes</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Monthly Pass - FitZone Premium</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    Bandra West, Mumbai
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-blue-900" />
                      <span className="text-sm text-gray-600">Valid till: 15 Nov 2023</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Days Remaining</span>
                      <span className="font-medium">18 of 30 days</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">Renew Pass</Button>
                </CardFooter>
              </Card>
            </section>

            {/* Recent Visits */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Recent Visits</h2>

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Dumbbell className="h-6 w-6 text-blue-900" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">FitZone Premium</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(Date.now() - index * 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        • 1 hour 30 minutes
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Gyms */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Recommended For You</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-40">
                      <img
                        src={`/placeholder.svg?height=200&width=400&text=Gym ${index + 1}`}
                        alt={`Gym ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white text-blue-900 flex items-center gap-1">
                          <Star className="fill-orange-500 text-orange-500" size={14} />
                          {(4.5 + index * 0.2).toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{`PowerFit Gym ${index + 1}`}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {index === 0 ? "Andheri East, Mumbai" : "Juhu, Mumbai"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {["AC", "Parking", "Trainer"].map((feature, i) => (
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
                      <Button className="w-full bg-blue-900 hover:bg-blue-800">View Gym</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
