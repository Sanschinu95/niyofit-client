import { CreditCard, Calendar, User, Check, ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="flex items-center text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gym
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="space-y-6">
              {/* Pass Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-blue-900" />
                    Select Pass
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="monthly">
                    {[
                      { id: "day", title: "Day Pass", price: "₹499", description: "Single day access" },
                      {
                        id: "weekly",
                        title: "Weekly Pass",
                        price: "₹1,999",
                        description: "7 days of unlimited access",
                      },
                      {
                        id: "monthly",
                        title: "Monthly Pass",
                        price: "₹4,999",
                        description: "30 days of unlimited access",
                        popular: true,
                      },
                    ].map((pass) => (
                      <div
                        key={pass.id}
                        className={`flex items-center space-x-2 border rounded-lg p-4 mb-3 ${
                          pass.popular ? "border-orange-500 bg-orange-50" : "border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value={pass.id} id={pass.id} />
                        <Label htmlFor={pass.id} className="flex-1 flex justify-between cursor-pointer">
                          <div>
                            <p className="font-medium">{pass.title}</p>
                            <p className="text-sm text-gray-600">{pass.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{pass.price}</p>
                            {pass.popular && <p className="text-xs text-orange-600 font-medium">Most Popular</p>}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-blue-900" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="card">
                    {[
                      { id: "card", title: "Credit/Debit Card", icon: CreditCard },
                      { id: "upi", title: "UPI Payment", icon: Shield },
                      { id: "wallet", title: "Mobile Wallet", icon: User },
                    ].map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 border rounded-lg p-4 mb-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex items-center cursor-pointer">
                          <method.icon className="mr-2 h-5 w-5 text-gray-600" />
                          <span>{method.title}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Name on Card</Label>
                        <Input id="card-name" placeholder="John Doe" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coupon Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Have a Coupon?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter coupon code" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start mb-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-3">
                      <img
                        src="/placeholder.svg?height=64&width=64"
                        alt="Gym thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">FitZone Premium</h3>
                      <p className="text-sm text-gray-600">Bandra West, Mumbai</p>
                      <p className="text-sm font-medium text-blue-900 mt-1">Monthly Pass</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      30 days unlimited access
                    </div>
                    <div className="flex items-center mb-1">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      All facilities included
                    </div>
                    <div className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Free fitness assessment
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pass Price</span>
                    <span>₹4,999</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span>₹900</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Convenience Fee</span>
                    <span>₹99</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹500</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹5,498</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Pay ₹5,498</Button>
                <p className="text-xs text-gray-500 text-center">
                  By completing this purchase, you agree to our{" "}
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
