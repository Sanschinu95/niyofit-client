"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, ArrowRight, User, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"

interface LoginFormData {
  email: string
  password: string
}

interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  agreeToTerms: boolean
}

interface ApiResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      userType: string
      name: string
      email: string
      phone: string
    }
    token: string
  }
  error?: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("login")
  
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    agreeToTerms: false
  })

  // Handle URL parameter to switch tabs
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'signup') {
      setActiveTab('signup')
    }
  }, [searchParams])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('http://localhost:4170/api/v1/auth/login-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      })

      const data: ApiResponse = await response.json()

      if (data.success && data.data) {
        // Use auth context to handle login
        login(data.data.token, {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name
        })
        
        setSuccess('Login successful! Redirecting...')
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!signupForm.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:4170/api/v1/auth/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${signupForm.firstName} ${signupForm.lastName}`,
          email: signupForm.email,
          phone: signupForm.phone,
          password: signupForm.password,
          userType: 'customer'
        })
      })

      const data: ApiResponse = await response.json()

      if (data.success && data.data) {
        // Use auth context to handle login
        login(data.data.token, {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name
        })
        
        setSuccess('Account created successfully! Redirecting...')
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="w-full max-w-md">
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleLoginSubmit}>
                  <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="w-full">
                        <img src="/placeholder.svg?height=24&width=24" alt="Google" className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                      <Button variant="outline" className="w-full">
                        <img src="/placeholder.svg?height=24&width=24" alt="Phone" className="mr-2 h-4 w-4" />
                        Phone
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                  </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="login-email" className="text-sm font-medium">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="login-email" 
                            type="email"
                            placeholder="name@example.com" 
                            className="pl-10" 
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="login-password" className="text-sm font-medium">
                            Password
                          </label>
                          <Link href="/forgot-password" className="text-sm text-blue-900 hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="login-password" 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10" 
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                  <CardDescription>Enter your details to create your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignupSubmit}>
                  <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="w-full">
                        <img src="/placeholder.svg?height=24&width=24" alt="Google" className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                      <Button variant="outline" className="w-full">
                        <img src="/placeholder.svg?height=24&width=24" alt="Phone" className="mr-2 h-4 w-4" />
                        Phone
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                  </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="first-name" className="text-sm font-medium">
                          First name
                        </label>
                        <Input 
                          id="first-name" 
                          placeholder="John" 
                          value={signupForm.firstName}
                          onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="last-name" className="text-sm font-medium">
                          Last name
                        </label>
                        <Input 
                          id="last-name" 
                          placeholder="Doe" 
                          value={signupForm.lastName}
                          onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="signup-email" className="text-sm font-medium">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="signup-email" 
                          type="email"
                          placeholder="name@example.com" 
                          className="pl-10" 
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="+91 98765 43210" 
                          className="pl-10" 
                          value={signupForm.phone}
                          onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="signup-password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10" 
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                        checked={signupForm.agreeToTerms}
                        onChange={(e) => setSignupForm({...signupForm, agreeToTerms: e.target.checked})}
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-900 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-900 hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
