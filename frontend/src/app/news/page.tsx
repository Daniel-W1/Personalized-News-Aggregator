'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '@/components/header'
import CategorySelector from '@/components/category-select'
import NewsFeed from '@/app/news/components/feed'

const categories = [
  "general",
  "business", 
  "entertainment",
  "health",
  "science",
  "technology",
  "sports"
]

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [news, setNews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
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
