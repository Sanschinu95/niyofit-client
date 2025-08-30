"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MapPin, Calendar, Dumbbell, ArrowRight, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import StatsCounter from "@/components/stats-counter"
import { motion } from "framer-motion"
import MobileBookingShowcase from "@/components/mobile-booking-showcase"
import PayWhenShowUpBadge from "@/components/pay-when-show-up-badge"

// Fitness Journey Stats Component
const FitnessJourneyStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          icon: Dumbbell,
          value: 18742,
          label: "Workouts Booked",
          color: "bg-blue-100 text-blue-600",
        },
        {
          icon: Calendar,
          value: 370,
          label: "Gyms Partnered",
          suffix: "+",
          color: "bg-orange-100 text-orange-600",
        },
        {
          icon: MapPin,
          value: 12,
          label: "Active Cities",
          color: "bg-green-100 text-green-600",
        },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="border-none shadow-lg hover:shadow-xl transition-all">
            <div className="p-6 flex flex-col items-center text-center">
              <div className={`${stat.color} p-3 rounded-full mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold mb-1">
                <StatsCounter value={stat.value} suffix={stat.suffix || ""} duration={2500} />
              </div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// Quick Pick For Today Component
const QuickPickForToday = () => {
  const [location, setLocation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getLocation = () => {
    setLoading(true)
    // Simulate geolocation and API call
    setTimeout(() => {
      setLocation("Mumbai")
      setLoading(false)
    }, 1500)
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="p-8 text-white">
        <h3 className="text-2xl font-bold mb-3 flex items-center">
          <Zap className="mr-2 h-5 w-5 text-orange-400" />
          Quick Pick for Today
        </h3>
        <p className="mb-6 text-blue-100">Find and book the closest gym with just one click</p>

        {!location ? (
          <Button
            onClick={getLocation}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Finding nearby gyms...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Find Gyms Near Me
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg">FitZone Premium</h4>
                  <p className="text-sm text-blue-100 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    Bandra West, {location} (1.2 km)
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">Open Now</Badge>
              </div>
              <div className="flex items-center text-sm mb-4">
                <Clock className="h-3 w-3 mr-1" />
                <span>Closes at 11:00 PM</span>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all">
                Get Me In Today!
              </Button>
            </div>
            <Link href="/gyms" className="text-blue-100 hover:text-white text-sm flex justify-center items-center">
              See more gyms in {location}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// FAQs Component
const FAQsSection = () => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
      <Accordion type="single" collapsible className="w-full">
        {[
          {
            question: "Do I have to pay online?",
            answer:
              "No, there's no online payment required. You can book your gym session instantly and pay directly at the gym when you arrive. This ensures complete transparency and flexibility.",
          },
          {
            question: "Can I cancel my booking?",
            answer:
              "Yes, you can cancel your booking anytime without any cancellation fees. We understand plans can change, and we want to provide maximum flexibility for our users.",
          },
          {
            question: "Do all gyms accept walk-ins?",
            answer:
              "Most of our partner gyms accept walk-ins, but we recommend booking in advance to ensure availability, especially during peak hours. Booking through our platform also guarantees you the special rates we've negotiated.",
          },
          {
            question: "What if the gym is closed when I arrive?",
            answer:
              "All gym timings are verified and updated regularly on our platform. In the rare event that you find a gym closed during its listed operating hours, please contact our support team, and we'll assist you immediately.",
          },
          {
            question: "Are there any hidden charges?",
            answer:
              "Absolutely not. The price you see is the price you pay at the gym. There are no booking fees, convenience charges, or any other hidden costs. We believe in 100% transparency.",
          },
        ].map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-3">Still have questions?</p>
        <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white">
          Contact Support
        </Button>
      </div>
    </motion.div>
  )
}

// Main How It Works Section Component
export default function HowItWorksSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-100 rounded-full opacity-30 transform translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block bg-blue-900 text-white px-4 py-1 rounded-full text-sm font-medium mb-4"
          >
            Simple Process
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
            How NiyoFit Works
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find, book, and enjoy the best gyms in your city with our simple process
          </motion.p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {[
            {
              step: 1,
              title: "Find Your Perfect Gym",
              description: "Search by location, facilities, or ratings to find gyms that match your preferences",
              icon: Search,
              color: "bg-blue-100 text-blue-900",
              bgColor: "bg-blue-50",
              borderColor: "border-blue-200",
            },
            {
              step: 2,
              title: "Book Instantly",
              description: "Reserve your spot with just a few taps - no payment required",
              icon: Calendar,
              color: "bg-orange-100 text-orange-600",
              bgColor: "bg-orange-50",
              borderColor: "border-orange-200",
            },
            {
              step: 3,
              title: "Work Out & Pay at Gym",
              description: "Visit the gym, enjoy your workout, and pay only for what you use",
              icon: Dumbbell,
              color: "bg-green-100 text-green-700",
              bgColor: "bg-green-50",
              borderColor: "border-green-200",
            },
          ].map((item, index) => (
            <motion.div key={index} variants={itemVariants} className="relative">
              <div
                className={`${item.bgColor} rounded-2xl shadow-lg p-8 h-full border ${item.borderColor} hover:shadow-xl transition-all`}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`${item.color} w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md`}
                  >
                    {item.step}
                  </div>
                </div>
                <div
                  className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 mt-4`}
                >
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="text-orange-500" size={30} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <PayWhenShowUpBadge />
          <QuickPickForToday />
        </div>

        {/* Stats Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-900 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              Our Impact
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">Our Fitness Journey So Far</h3>
          </div>
          <FitnessJourneyStats />
        </motion.div>

        {/* Mobile Booking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <MobileBookingShowcase />
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <FAQsSection />
        </motion.div>
      </div>
    </section>
  )
}
