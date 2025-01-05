import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NewsFeedProps {
  category: string
  news: {
    title: string,
    summary: string,
    category: string
  }[]
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <Card key={item.title} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
          <CardHeader>
            <CardTitle className="text-blue-400">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-300">{item.summary}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
