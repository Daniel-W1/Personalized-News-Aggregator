'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '@/components/header'
import CategorySelector from '@/components/category-select'
import NewsFeed from '@/app/news/components/feed'
import { useRouter } from 'next/navigation'

export default function NewsPage() {
    const [selectedCategory, setSelectedCategory] = useState('')
    const [categories, setCategories] = useState<string[]>([])
    const [news, setNews] = useState([])
    const [bookmarks, setBookmarks] = useState<Set<number>>(new Set())
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const token = localStorage.getItem('token')

                const response = await axios.get('http://localhost:8081/bookmarks', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.success) {
                    setBookmarks(new Set(response.data.data.map((item: { id: number }) => item.id)))
                }
            } catch (error) {
                console.error('Error fetching bookmarks:', error)
            }
        }

        fetchBookmarks()
    }, [])

    useEffect(() => {
        const fetchUserInterests = async () => {
            try {
                const token = localStorage.getItem('token')

                if (!token) {
                    router.push("/")
                    return
                }
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
                } else {
                    setError(response.data.message || 'Failed to fetch interests')
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    router.push('/')
                    return
                }
                setError('Failed to load interests')
                console.error('Error fetching interests:', error)
            }
        }

        fetchUserInterests()
    }, [router])

    useEffect(() => {
        const fetchNews = async () => {
            if (!selectedCategory) return

            setError('')
            setLoading(true)

            try {
                const token = localStorage.getItem('token')

                if (!token) {
                    router.push('/')
                    return
                }

                const response = await axios.get(
                    selectedCategory === "bookmarks" 
                        ? 'http://localhost:8081/bookmarks'
                        : `http://localhost:8081/news?category=${selectedCategory}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (response.data.success) {
                    setNews(response.data.data)
                    if (selectedCategory === "bookmarks") {
                        setBookmarks(new Set(response.data.data.map((item: { id: number }) => item.id)))
                    }
                } else {
                    setError(response.data.message || `Failed to fetch ${selectedCategory === "bookmarks" ? "bookmarks" : "news"}`)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || 'An error occurred while fetching news')
                } else {
                    setError('An unexpected error occurred')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchNews()
    }, [selectedCategory, router])

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
                    <NewsFeed category={selectedCategory} news={news} bookmarks={bookmarks} setBookmarks={setBookmarks} />
                )}
            </main>
        </div>
    )
}
