import { Sparkles } from "lucide-react"
import { posts } from "#site/content"

export function FeaturedArticles() {
  // 仅展示 frontmatter 中标记为 featured 的文章，默认最多 8 篇
  const featuredArticles = posts
    .filter((post) => post.featured)
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
      <div className="mb-4 flex items-center gap-2 sm:mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-serif font-semibold sm:text-2xl">精选文章</h2>
      </div>

      <ul className="space-y-1.5 list-none">
        {featuredArticles.map((article) => (
          <li key={article.slug} className="group">
            <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-2 py-2 sm:flex sm:gap-3 sm:py-1.5">
              <span className="row-span-2 text-muted-foreground flex-shrink-0 font-bold text-base">•</span>
              <time className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 font-normal font-serif sm:text-sm">
                {formatDate(article.date)}
              </time>
              <span className="hidden text-muted-foreground flex-shrink-0 font-extrabold text-xl sm:inline">»</span>
              <a
                href={`/blog/${article.slug}`}
                className="col-start-2 text-base font-serif font-normal hover:text-primary transition-colors leading-relaxed underline sm:col-auto"
              >
                {article.title}
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-1.5 pt-1.5">
        <div className="flex items-baseline gap-3 py-1.5">
          <span className="text-muted-foreground flex-shrink-0 font-bold text-base">•</span>
          <a 
            href="/blog" 
            className="text-base font-serif font-medium text-primary hover:text-primary/70 transition-colors"
          >
            更多文章......
          </a>
        </div>
      </div>
    </div>
  )
}
