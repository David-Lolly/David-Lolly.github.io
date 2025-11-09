import { Sparkles } from "lucide-react"
import { posts } from "#site/content"

export function FeaturedArticles() {
  // 获取最新的8篇文章
  const featuredArticles = posts
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
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-serif font-bold">精选博客</h2>
      </div>

      <ul className="space-y-3 list-none">
        {featuredArticles.map((article) => (
          <li key={article.slug} className="group">
            <a
              href={`/blog/${article.slug}`}
              className="block hover:bg-card/50 -mx-2 px-2 py-2.5 rounded-md transition-colors font-sans font-semibold text-base tracking-wider"
            >
              <div className="flex items-baseline gap-3">
                <time className="text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 font-medium font-serif">
                  {formatDate(article.date)}
                </time>
                <span className="text-muted-foreground flex-shrink-0 font-extrabold text-xl">»</span>
                <h3 className="text-base font-serif font-medium group-hover:text-primary transition-colors leading-relaxed underline text-justify">
                  {article.title}
                </h3>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <ul className="mt-3 list-none">
        <li>
          <a href="/blog" className="block hover:bg-card/50 -mx-2 px-2 py-2.5 rounded-md transition-colors group text-left font-serif">
            <div className="flex items-baseline gap-3 text-left">
              <span className="text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 font-sans invisible">
                2025年00月00日
              </span>
              
              <span className="text-base font-serif font-bold text-primary group-hover:text-primary/70 transition-colors text-right shadow-none">
                更多文章......
              </span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  )
}
