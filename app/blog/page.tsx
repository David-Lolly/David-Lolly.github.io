"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search } from "lucide-react"
import { posts } from "#site/content"
import { useState, useMemo } from "react"

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // 获取所有分类
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>()
    posts.forEach((post) => {
      post.categories?.forEach((cat) => categorySet.add(cat))
    })
    return ["全部", ...Array.from(categorySet).sort()]
  }, [])

  // 过滤文章
  const filteredArticles = useMemo(() => {
    return posts
      .filter((post) => {
        // 分类过滤
        if (selectedCategory !== "全部" && !post.categories?.includes(selectedCategory)) {
          return false
        }
        // 搜索过滤
        if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [selectedCategory, searchQuery])

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
            <Input 
              type="search" 
              placeholder="搜索文章标题..." 
              className="pl-10 bg-card" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((category) => (
            <Badge
              key={category}
              variant={category === selectedCategory ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.slug}
              className="overflow-hidden bg-[rgb(250,250,228)] shadow-lg hover:shadow-xl transition-all duration-300 group border-border/60"
            >
              <a href={`/blog/${article.slug}`} className="block">
                <div className="h-48 overflow-hidden bg-muted">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    {article.categories && article.categories.length > 0 && (
                      <span className="inline-block px-3 py-1.5 text-xs font-semibold bg-accent-yellow/30 text-[rgb(133,77,14)] rounded-md border border-accent-yellow/40">
                        {article.categories[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{article.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readingTime}</span>
                    </div>
                  </div>
                </div>
              </a>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">没有找到符合条件的文章</p>
          </div>
        )}
      </main>
    </div>
  )
}
