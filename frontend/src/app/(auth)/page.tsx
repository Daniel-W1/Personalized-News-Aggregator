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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-primary">FutureNews</h1>
          <p className="text-xl text-muted-foreground">Stay ahead with AI-powered summaries</p>
        </div>
        {isLogin ? <LoginForm /> : <SignupForm />}
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
          </Button>
        </div>
      </div>
    </div>
  )
}
