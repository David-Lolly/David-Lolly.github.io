import { Sparkles } from "lucide-react"

const featuredArticles = [
  {
    id: 1,
    title: "我的第一篇 Hextra 博客",
    date: "2025年11月08日",
    category: "技术教程",
  },
  {
    id: 2,
    title: "深入理解 Hugo Shortcodes",
    date: "2025年11月07日",
    category: "技术",
  },
  {
    id: 3,
    title: "Hextra 主题 SEO 优化指南",
    date: "2025年11月06日",
    category: "教程",
  },
  {
    id: 4,
    title: "Python 异步编程实践",
    date: "2025年11月05日",
    category: "Python",
  },
  {
    id: 5,
    title: "Go 语言并发模式详解",
    date: "2025年11月03日",
    category: "Go",
  },
  {
    id: 6,
    title: "FastAPI 性能优化技巧",
    date: "2025年11月01日",
    category: "FastAPI",
  },
  {
    id: 7,
    title: "Docker 容器化最佳实践",
    date: "2025年10月28日",
    category: "Docker",
  },
  {
    id: 8,
    title: "Kubernetes 入门指南",
    date: "2025年10月25日",
    category: "Kubernetes",
  },
]

export function FeaturedArticles() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-serif font-bold">精选博客</h2>
      </div>

      <ul className="space-y-3 list-none">
        {featuredArticles.map((article) => (
          <li key={article.id} className="group">
            <a
              href={`/blog/${article.id}`}
              className="block hover:bg-card/50 -mx-2 px-2 py-2.5 rounded-md transition-colors font-sans font-semibold text-base tracking-wider"
            >
              <div className="flex items-baseline gap-3">
                <time className="text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 font-medium font-serif">
                  {article.date}
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
