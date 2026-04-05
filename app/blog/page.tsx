"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { posts } from "#site/content"
import { useState, useMemo, useEffect, useRef } from "react"

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(12)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("pointerdown", handleClickOutside)
    window.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside)
      window.removeEventListener("keydown", handleEscape)
    }
  }, [])

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

  // 分页逻辑
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredArticles.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredArticles, currentPage, itemsPerPage])

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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

        <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索文章标题..."
              className="pl-10 bg-card"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="flex items-center gap-3 relative z-30">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">每页显示:</span>
            <div ref={dropdownRef} className="relative flex items-center">
              <button
                type="button"
                className="flex items-center cursor-pointer min-w-[72px] justify-between bg-card/60 backdrop-blur-md px-4 py-2 rounded-md border border-border shadow-sm transition-colors hover:bg-card/80"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-label="选择每页显示数量"
              >
                <span className="text-sm font-semibold text-foreground pr-2">{itemsPerPage} 篇</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+0.5rem)] right-0 w-28 rounded-md border border-border bg-card/60 backdrop-blur-md shadow-xl z-[70] py-1 overflow-hidden">
                  {[12, 24, 36, 48, 60, 120].map((num) => (
                    <div
                      key={num}
                      className={`px-4 py-2 text-sm cursor-pointer transition-colors group relative ${itemsPerPage === num
                        ? 'font-bold text-foreground bg-black/5 dark:bg-white/10'
                        : 'font-medium text-foreground/85 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      onClick={() => {
                        setItemsPerPage(num)
                        setCurrentPage(1)
                        setIsDropdownOpen(false)
                      }}
                    >
                      <span className="relative inline-block">
                        {num} 篇
                        <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((category) => (
            <Badge
              key={category}
              variant={category === selectedCategory ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${category === selectedCategory
                ? "bg-[rgb(220,200,100)] text-[rgb(92,64,32)]"
                : ""
                }`}
              onClick={() => {
                setSelectedCategory(category)
                setCurrentPage(1)
              }}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentArticles.map((article) => (
            <Card
              key={article.slug}
              className="overflow-hidden bg-[rgb(250,250,228)] dark:bg-[rgb(24,24,27)] shadow-lg hover:shadow-xl transition-all duration-300 group border-border/60"
            >
              <a href={`/blog/${article.slug}`} className="block">
                <div className="h-48 overflow-hidden bg-muted">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5 flex flex-col h-[200px]">
                  <div className="mb-3">
                    {article.categories && article.categories.length > 0 && (
                      <span className="inline-block px-3 py-1.5 text-xs font-semibold bg-accent-yellow/30 text-[rgb(133,77,14)] dark:text-[rgb(251,191,36)] rounded-md border border-accent-yellow/40">
                        {article.categories[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-grow">{article.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
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

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`h-8 w-8 p-0 ${currentPage === page ? "bg-primary text-primary-foreground font-bold" : "font-medium"}`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">没有找到符合条件的文章</p>
          </div>
        )}
      </main>
    </div>
  )
}
