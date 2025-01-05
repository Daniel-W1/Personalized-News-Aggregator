'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('http://localhost:8081/login', {
        email: formData.email,
        password: formData.password
      })

      if (response.data.success) {
        localStorage.setItem('token', response.data.access_token)
        router.push('/news')
      } else {
        setError(response.data.message || 'Login failed')
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-100 rounded">
          {error}
        </div>
      )}
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Log In
      </Button>
    </form>
  )
}
