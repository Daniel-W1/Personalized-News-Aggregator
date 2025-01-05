'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Mail, Lock, User, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const interests = [
  "general",
  "business", 
  "entertainment",
  "health",
  "science",
  "technology",
  "sports"
]

export default function SignupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    interests: [] as string[]
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('http://localhost:8081/signup', {
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        interests: formData.interests.map(interest => interests.indexOf(interest) + 1)
      })

      console.log("response", response)

      if (response.data.success) {
        localStorage.setItem('token', response.data.access_token)
        router.push('/news')
      } else {
        setError(response.data.message || 'Signup failed')
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during signup')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-100 rounded">
          {error}
        </div>
      )}
      
      {step === 1 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstname" className="text-gray-300">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstname}
                onChange={handleChange}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname" className="text-gray-300">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastname}
                onChange={handleChange}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>
          <Button type="button" onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700">
            Next <ChevronRight className="ml-2" size={16} />
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="space-y-4">
            <Label className="text-gray-300">Select your interests</Label>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <Badge 
                  key={interest}
                  variant="secondary"
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer flex items-center gap-1"
                  onClick={() => handleInterestChange(interest)}
                >
                  {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  <X size={14} />
                </Badge>
              ))}
            </div>
            <Card className="p-4 bg-gray-800 border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {interests
                  .filter(interest => !formData.interests.includes(interest))
                  .map((interest) => (
                    <Button
                      key={interest}
                      variant="ghost"
                      className="justify-center text-gray-300 hover:text-white hover:bg-gray-700"
                      onClick={() => handleInterestChange(interest)}
                    >
                      <Plus size={16} className="mr-1" />
                      {interest.charAt(0).toUpperCase() + interest.slice(1)}
                    </Button>
                  ))}
              </div>
            </Card>
          </div>
          <div className="flex space-x-4">
            <Button type="button" onClick={() => setStep(1)} className="w-1/2 bg-gray-700 hover:bg-gray-600">
              <ChevronLeft className="mr-2" size={16} /> Back
            </Button>
            <Button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-700">
              Sign Up
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
