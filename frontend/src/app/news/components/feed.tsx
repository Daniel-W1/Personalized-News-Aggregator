import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Maximize2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import axios from "axios"
import { API_URL } from "@/lib/utils"

interface NewsFeedProps {
    category: string
    news: {
        id: number,
        title: string,
        summary: string,
        image_url: string,
        url: string,
        published_at: string,
        sentiment: string,
        source: string,
        category: string,
    }[],
    bookmarks: Set<number>,
    setBookmarks: (bookmarks: Set<number>) => void
}

export default function NewsFeed({ news, bookmarks, setBookmarks }: NewsFeedProps) {
    const [selectedArticle, setSelectedArticle] = useState<typeof news[0] | null>(null)

    const toggleBookmark = async (newsId: number) => {
        try {
            const token = localStorage.getItem('token')
            const isCurrentlyBookmarked = bookmarks.has(newsId)

            const response = await axios({
                url: `${API_URL}/bookmarks/${newsId}`,
                method: isCurrentlyBookmarked ? 'DELETE' : 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                const newBookmarks = new Set(bookmarks)
                if (isCurrentlyBookmarked) {
                    newBookmarks.delete(newsId)
                } else {
                    newBookmarks.add(newsId)
                }
                setBookmarks(newBookmarks)
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error)
        }
    }

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {news.map((item) => (
                    <Card
                        key={item.id}
                        className="bg-card border-border hover:bg-accent/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden group flex flex-col relative"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(item.id);
                            }}
                            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-accent transition-colors"
                        >
                            {bookmarks.has(item.id) ? (
                                <BookmarkCheck className="w-5 h-5 text-primary" />
                            ) : (
                                <Bookmark className="w-5 h-5 text-muted-foreground hover:text-primary" />
                            )}
                        </button>
                        <div className="flex-none">
                            {item.image_url ? (
                                <div className="relative w-full h-48 overflow-hidden">
                                    <Image
                                        src={item.image_url}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-background/80 text-xs text-foreground backdrop-blur-sm">
                                        {item.source}
                                    </span>
                                </div>
                            ) : (
                                <div className="px-6 pt-6">
                                    <span className="px-2 py-1 rounded bg-background/80 text-xs text-foreground">
                                        {item.source}
                                    </span>
                                </div>
                            )}
                        </div>
                        <CardHeader className="flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <time dateTime={item.published_at}>
                                    {new Date(item.published_at).toLocaleDateString()}
                                </time>
                                <span className={`ml-auto px-2 py-1 rounded text-xs ${
                                    item.sentiment === 'positive' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                                    item.sentiment === 'negative' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                                    'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                }`}>
                                    {item.sentiment}
                                </span>
                            </div>
                            <CardTitle className="text-primary hover:text-primary/80 transition-colors mb-4">
                                {item.title}
                            </CardTitle>
                            <CardDescription className="text-foreground line-clamp-4 mb-4 flex-1">
                                {item.summary}
                            </CardDescription>
                            <div className="flex items-center justify-between mt-auto">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                                >
                                    Read full article <ExternalLink size={16} />
                                </a>
                                <button
                                    onClick={() => setSelectedArticle(item)}
                                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                                >
                                    View all <Maximize2 size={16} />
                                </button>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
                <DialogContent className="bg-background text-foreground border-border max-w-3xl max-h-[80vh] overflow-y-auto">
                    {selectedArticle && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl text-primary mb-4">{selectedArticle.title}</DialogTitle>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{selectedArticle.source}</span>
                                    <time dateTime={selectedArticle.published_at}>
                                        {new Date(selectedArticle.published_at).toLocaleDateString()}
                                    </time>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        selectedArticle.sentiment === 'positive' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                                        selectedArticle.sentiment === 'negative' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                                        'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                    }`}>
                                        {selectedArticle.sentiment}
                                    </span>
                                </div>
                            </DialogHeader>

                            {selectedArticle.image_url && (
                                <div className="relative w-full h-64 my-4">
                                    <Image
                                        src={selectedArticle.image_url}
                                        alt={selectedArticle.title}
                                        style={{ objectFit: "contain" }}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="text-foreground whitespace-pre-wrap">
                                {selectedArticle.summary}
                            </div>

                            <div className="mt-6">
                                <a
                                    href={selectedArticle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                                >
                                    Read full article <ExternalLink size={16} />
                                </a>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
