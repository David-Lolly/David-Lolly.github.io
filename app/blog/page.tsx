import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search } from "lucide-react"

const allArticles = [
  {
    id: 1,
    title: "我的第一篇 Hextra 博客",
    excerpt: "开始使用 Hextra 主题搭建个人博客，了解基础配置和图片处理方式。",
    coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dR4B4BGrCHvX80gFrjPX4RG5jxcYBN.png",
    date: "2025年11月08日",
    category: "技术教程",
    readTime: "5 分钟",
  },
  {
    id: 2,
    title: "深入理解 Hugo Shortcodes",
    excerpt: "了解 Hugo Shortcodes 的使用方法，包括内置 shortcodes 和自定义 shortcodes。",
    coverImage: "/misty-forest-road-with-pine-trees.jpg",
    date: "2025年11月07日",
    category: "技术",
    readTime: "8 分钟",
  },
  {
    id: 3,
    title: "Hextra 主题 SEO 优化指南",
    excerpt: "全面介绍如何优化 Hugo 博客的 SEO，提升搜索引擎排名和流量。",
    coverImage: "/clear-blue-sky-with-clouds.jpg",
    date: "2025年11月06日",
    category: "教程",
    readTime: "10 分钟",
  },
  {
    id: 4,
    title: "Python 异步编程实践",
    excerpt: "深入探讨 Python 中的异步编程，包括 asyncio、协程和并发模式。",
    coverImage: "/python-async-programming-code.jpg",
    date: "2025年11月05日",
    category: "Python",
    readTime: "12 分钟",
  },
  {
    id: 5,
    title: "Go 语言并发模式详解",
    excerpt: "学习 Go 语言中的并发编程模式，包括 goroutines、channels 和 select。",
    coverImage: "/golang-concurrency-patterns.jpg",
    date: "2025年11月03日",
    category: "Go",
    readTime: "15 分钟",
  },
  {
    id: 6,
    title: "FastAPI 性能优化技巧",
    excerpt: "分享 FastAPI 应用的性能优化策略，包括数据库查询、缓存和异步处理。",
    coverImage: "/fastapi-performance-optimization.jpg",
    date: "2025年11月01日",
    category: "FastAPI",
    readTime: "10 分钟",
  },
  {
    id: 7,
    title: "Docker 容器化最佳实践",
    excerpt: "容器化应用的最佳实践，包括镜像优化、多阶段构建和安全配置。",
    coverImage: "/docker-containers-best-practices.jpg",
    date: "2025年10月28日",
    category: "Docker",
    readTime: "11 分钟",
  },
  {
    id: 8,
    title: "Kubernetes 入门指南",
    excerpt: "从零开始学习 Kubernetes，理解容器编排、服务发现和负载均衡。",
    coverImage: "/kubernetes-guide-tutorial.jpg",
    date: "2025年10月25日",
    category: "Kubernetes",
    readTime: "20 分钟",
  },
  {
    id: 9,
    title: "LangChain 应用开发",
    excerpt: "使用 LangChain 构建 AI 应用，集成大语言模型和向量数据库。",
    coverImage: "/langchain-ai-development.jpg",
    date: "2025年10月22日",
    category: "AI/ML",
    readTime: "18 分钟",
  },
]

const categories = ["全部", "技术教程", "技术", "教程", "Python", "Go", "FastAPI", "Docker", "Kubernetes", "AI/ML"]

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">博客文章</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">分享技术见解、学习笔记和开发经验</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="搜索文章标题..." className="pl-10 bg-card" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "全部" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allArticles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden bg-[rgb(250,250,228)] shadow-lg hover:shadow-xl transition-all duration-300 group border-border/60"
            >
              <a href={`/blog/${article.id}`} className="block">
                <div className="h-48 overflow-hidden bg-muted">
                  <img
                    src={article.coverImage || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1.5 text-xs font-semibold bg-accent-yellow/30 text-[rgb(133,77,14)] rounded-md border border-accent-yellow/40">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </a>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
