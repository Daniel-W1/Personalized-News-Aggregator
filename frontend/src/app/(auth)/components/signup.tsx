'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Mail, Lock, User, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/utils'

export default function SignupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [interests, setInterests] = useState<Array<{id: number, name: string}>>([])
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    interests: [] as number[]
  })

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(`${API_URL}/interests`)
        if (response.data.success) {    
          setInterests(response.data.data)
        }
      } catch (err) {
        console.error('Error fetching interests:', err)
        setError('Failed to load interests')
      }
    }

    fetchInterests()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleInterestChange = (interest: {id: number, name: string}) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest.id)
        ? prev.interests.filter(i => i !== interest.id)
        : [...prev.interests, interest.id]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.interests.length === 0) {
      setError('Please select at least one interest category')
      return
    }

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        interests: formData.interests
      })

      if (response.data.success) {
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
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
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">
          {error}
        </div>
      )}
      
      {step === 1 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstname}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastname}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button type="button" onClick={() => setStep(2)} className="w-full">
            Next <ChevronRight className="ml-2" size={16} />
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="space-y-4">
            <Label>Select your interests</Label>
            <div className="flex flex-wrap gap-2">
              {interests
                .filter(interest => formData.interests.includes(interest.id))
                .map((interest) => (
                  <Badge 
                    key={interest.id}
                    variant="secondary"
                    className="cursor-pointer flex items-center gap-1"
                    onClick={() => handleInterestChange(interest)}
                  >
                    {interest.name.charAt(0).toUpperCase() + interest.name.slice(1)}
                    <X size={14} />
                  </Badge>
                ))}
            </div>
            <Card className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {interests
                  .filter(interest => !formData.interests.includes(interest.id))
                  .map((interest) => (
                    <Button
                      key={interest.id}
                      variant="ghost"
                      className="justify-center"
                      onClick={() => handleInterestChange(interest)}
                    >
                      <Plus size={16} className="mr-1" />
                      {interest.name.charAt(0).toUpperCase() + interest.name.slice(1)}
                    </Button>
                  ))}
              </div>
            </Card>
          </div>
          <div className="flex space-x-4">
            <Button type="button" onClick={() => setStep(1)} variant="outline" className="w-1/2">
              <ChevronLeft className="mr-2" size={16} /> Back
            </Button>
            <Button type="submit" className="w-1/2">
              Sign Up
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
