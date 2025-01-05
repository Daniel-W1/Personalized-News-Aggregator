import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Maximize2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

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
  }[]
}

export default function NewsFeed({ news }: NewsFeedProps) {
  const [selectedArticle, setSelectedArticle] = useState<typeof news[0] | null>(null)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <Card 
            key={item.id}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden group flex flex-col"
          >
            <div className="flex-none">
              {item.image_url ? (
                <div className="relative w-full h-48 overflow-hidden">
                  <Image 
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-gray-900/80 text-xs text-gray-300 backdrop-blur-sm">
                    {item.source}
                  </span>
                </div>
              ) : (
                <div className="px-6 pt-6">
                  <span className="px-2 py-1 rounded bg-gray-900/80 text-xs text-gray-300">
                    {item.source}
                  </span>
                </div>
              )}
            </div>
            <CardHeader className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <time dateTime={item.published_at}>
                  {new Date(item.published_at).toLocaleDateString()}
                </time>
                <span className={`ml-auto px-2 py-1 rounded text-xs ${
                  item.sentiment === 'positive' ? 'bg-green-900/50 text-green-300' :
                  item.sentiment === 'negative' ? 'bg-red-900/50 text-red-300' :
                  'bg-blue-900/50 text-blue-300'
                }`}>
                  {item.sentiment}
                </span>
              </div>
              <CardTitle className="text-blue-400 hover:text-blue-300 transition-colors mb-4">
                {item.title}
              </CardTitle>
              <CardDescription className="text-gray-300 line-clamp-4 mb-4 flex-1">
                {item.summary}
              </CardDescription>
              <div className="flex items-center justify-between mt-auto">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  Read full article <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => setSelectedArticle(item)}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  View all <Maximize2 size={16} />
                </button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-blue-400 mb-4">{selectedArticle.title}</DialogTitle>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{selectedArticle.source}</span>
                  <time dateTime={selectedArticle.published_at}>
                    {new Date(selectedArticle.published_at).toLocaleDateString()}
                  </time>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedArticle.sentiment === 'positive' ? 'bg-green-900/50 text-green-300' :
                    selectedArticle.sentiment === 'negative' ? 'bg-red-900/50 text-red-300' :
                    'bg-blue-900/50 text-blue-300'
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
                    style={{objectFit: "contain"}}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="text-gray-300 whitespace-pre-wrap">
                {selectedArticle.summary}
              </div>

              <div className="mt-6">
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
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
