"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { User, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  type: "signup" | "booking" | "review"
  user: string
  location: string
  timeAgo: string
  gym?: string
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [visibleActivity, setVisibleActivity] = useState<ActivityItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Mock data for activities
  const mockActivities: ActivityItem[] = [
    {
      type: "signup",
      user: "Rahul S.",
      location: "Mumbai",
      timeAgo: "Just now",
    },
    {
      type: "booking",
      user: "Priya M.",
      location: "Delhi",
      timeAgo: "2 minutes ago",
      gym: "FitZone Premium",
    },
    {
      type: "review",
      user: "Amit K.",
      location: "Bangalore",
      timeAgo: "5 minutes ago",
      gym: "PowerHouse Gym",
    },
    {
      type: "booking",
      user: "Neha T.",
      location: "Hyderabad",
      timeAgo: "7 minutes ago",
      gym: "Elite Fitness",
    },
    {
      type: "signup",
      user: "Vikram P.",
      location: "Chennai",
      timeAgo: "10 minutes ago",
    },
  ]

  useEffect(() => {
    setActivities(mockActivities)

    // Show a new notification every few seconds
    const interval = setInterval(() => {
      const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)]
      setVisibleActivity(randomActivity)
      setIsVisible(true)

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 4000)
    }, 6000)

    // Show first notification after a short delay
    setTimeout(() => {
      const firstActivity = mockActivities[0]
      setVisibleActivity(firstActivity)
      setIsVisible(true)

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 4000)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!visibleActivity) return null

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 max-w-[250px] sm:max-w-xs transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-100 scale-75 transform origin-bottom-left">
        <div className="flex items-start gap-2">
          <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
            {visibleActivity.type === "signup" ? (
              <User className="h-3 w-3 text-blue-900" />
            ) : visibleActivity.type === "booking" ? (
              <Clock className="h-3 w-3 text-blue-900" />
            ) : (
              <Star className="h-3 w-3 text-blue-900" />
            )}
          </div>
          <div className="min-w-0">
            {" "}
            {/* Prevent text overflow */}
            <div className="flex items-center gap-1 flex-wrap">
              <p className="text-xs font-medium truncate">
                {visibleActivity.user} from {visibleActivity.location}
              </p>
              <Badge
                variant="outline"
                className="text-[10px] bg-green-50 text-green-700 border-green-200 px-1 py-0 whitespace-nowrap"
              >
                {visibleActivity.timeAgo}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1 truncate">
              {visibleActivity.type === "signup"
                ? "just joined NiyoFit"
                : visibleActivity.type === "booking"
                  ? `just booked a session at ${visibleActivity.gym}`
                  : `left a review for ${visibleActivity.gym}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
