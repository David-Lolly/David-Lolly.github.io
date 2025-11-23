import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { posts } from "#site/content"

export function LatestArticles() {
  // 获取最新的8篇文章
  const latestArticles = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "年").replace(/年(\d+)年/, "年$1月") + "日"
  }

  return (
    <Card className="p-6 sticky top-24 bg-[rgb(250,250,228)]">
      <div className="flex items-center gap-2">
        <Clock className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-base font-serif font-bold">最新文章</h3>
      </div>

      <div className="space-y-2">
        {latestArticles.map((article) => (
          <a key={article.slug} href={`/blog/${article.slug}`} className="block group">
            <div className="border-l-2 border-border hover:border-primary pl-3 py-1 transition-colors">
              <h4 className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {article.title}
              </h4>
              <p className="text-xs text-muted-foreground">{formatDate(article.date)}</p>
            </div>
          </a>
        ))}
      </div>
    </Card>
  )
}
