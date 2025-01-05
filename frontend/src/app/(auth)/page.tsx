'use client'

import { useEffect, useState } from 'react'
import LoginForm from './components/login'
import SignupForm from './components/signup'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/news')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-500">FutureNews</h1>
          <p className="text-xl text-gray-400">Stay ahead with AI-powered summaries</p>
        </div>
        {isLogin ? <LoginForm /> : <SignupForm />}
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
          </Button>
        </div>
      </div>
    </div>
  )
}
