'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '@/components/header'
import CategorySelector from '@/components/category-select'
import NewsFeed from '@/app/news/components/feed'

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [news, setNews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8081/users/me/interests', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.success) {
          const userInterests = response.data.data.map((interest: { name: string }) => interest.name)
          setCategories(userInterests)
          // Set first category as default selected
          if (userInterests.length > 0) {
            setSelectedCategory(userInterests[0])
          }
        }
      } catch (err) {
        setError('Failed to load interests')
        console.error('Error fetching interests:', err)
      }
    }

    fetchUserInterests()
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      if (!selectedCategory) return

      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:8081/news?category=${selectedCategory}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.success) {
          setNews(response.data.data)
        } else {
          setError(response.data.message || 'Failed to fetch news')
        }
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while fetching news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CategorySelector 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory}
        />
        {error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <NewsFeed category={selectedCategory} news={news} />
        )}
      </main>
    </div>
  )
}
