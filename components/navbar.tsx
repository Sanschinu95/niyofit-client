"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-22%20124256-6GRJbNN78hXw4Hjx4QGE5ZsXIoSBfp.png"
              alt="NiyoFit Logo"
              className="h-10 rounded-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-900 font-medium">
              Home
            </Link>
            <Link href="/gyms" className="text-gray-700 hover:text-blue-900 font-medium">
              Find Gyms
            </Link>
            <Link href="/passes" className="text-gray-700 hover:text-blue-900 font-medium">
              Passes
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-900 font-medium">
              About Us
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white">
              Log In
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Sign Up</Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-900 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/gyms"
              className="text-gray-700 hover:text-blue-900 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Gyms
            </Link>
            <Link
              href="/passes"
              className="text-gray-700 hover:text-blue-900 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Passes
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-900 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>

            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
              <Button
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white w-full"
              >
                Log In
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
