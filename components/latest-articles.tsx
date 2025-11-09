import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

const latestArticles = [
  {
    id: 4,
    title: "Python 异步编程实践",
    date: "2025年11月05日",
  },
  {
    id: 5,
    title: "Go 语言并发模式详解",
    date: "2025年11月03日",
  },
  {
    id: 6,
    title: "FastAPI 性能优化技巧",
    date: "2025年11月01日",
  },
  {
    id: 7,
    title: "Docker 容器化最佳实践",
    date: "2025年10月28日",
  },
  {
    id: 8,
    title: "Kubernetes 入门指南",
    date: "2025年10月25日",
  },
  {
    id: 9,
    title: "LangChain 应用开发",
    date: "2025年10月22日",
  },
]

export function LatestArticles() {
  return (
    <Card className="p-6 sticky top-24 bg-[rgb(250,250,228)]">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-serif font-bold">最新文章</h3>
      </div>

      <div className="space-y-4">
        {latestArticles.map((article) => (
          <a key={article.id} href={`/blog/${article.id}`} className="block group">
            <div className="border-l-2 border-border hover:border-primary pl-3 py-1 transition-colors">
              <h4 className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {article.title}
              </h4>
              <p className="text-xs text-muted-foreground">{article.date}</p>
            </div>
          </a>
        ))}
      </div>
    </Card>
  )
}
