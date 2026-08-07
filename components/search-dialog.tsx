"use client"

import { useEffect, useState, useCallback } from "react"
import { Search, BookOpen, Github } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Fuse from "fuse.js"
import { useRouter } from "next/navigation"

interface SearchItem {
  title: string
  description: string
  date: string
  slug: string
  type: "blog" | "project"
  categories?: string[]
  tags?: string[]
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [searchData, setSearchData] = useState<SearchItem[]>([])
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null)

  // 加载搜索数据
  useEffect(() => {
    if (open && searchData.length === 0) {
      setIsLoading(true)
      fetch("/search.json")
        .then((res) => res.json())
        .then((data: SearchItem[]) => {
          setSearchData(data)
          // 初始化 Fuse.js
          const fuseInstance = new Fuse(data, {
            keys: [
              { name: "title", weight: 0.7 },
              { name: "description", weight: 0.2 },
              { name: "categories", weight: 0.05 },
              { name: "tags", weight: 0.05 },
            ],
            threshold: 0.3,
            includeScore: true,
            minMatchCharLength: 1,
          })
          setFuse(fuseInstance)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("加载搜索索引失败:", error)
          setIsLoading(false)
        })
    }
  }, [open, searchData.length])

  // 执行搜索
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setSearchResults([])
      return
    }

    const results = fuse.search(query)
    setSearchResults(results.map((result) => result.item).slice(0, 10))
  }, [query, fuse])

  // 处理文章/项目点击
  const handleItemClick = useCallback(
    (item: SearchItem) => {
      const path = item.type === "blog" ? `/blog/${item.slug}` : `/projects/${item.slug}`
      onOpenChange(false)
      setQuery("")
      router.push(path)
    },
    [router, onOpenChange]
  )

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "年").replace(/年(\d+)年/, "年$1月") + "日"
  }

  // 键盘导航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
        setQuery("")
      }
    },
    [onOpenChange]
  )

  // 关闭对话框并清空搜索
  const handleClose = useCallback(() => {
    onOpenChange(false)
    setQuery("")
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-3xl gap-0 overflow-hidden p-0 bg-[rgb(240,240,215)] dark:bg-[rgb(40,40,40)] border-[rgb(229,229,209)] dark:border-[rgb(60,60,60)] shadow-2xl transition-colors sm:w-full">
        <DialogHeader className="sr-only">
          <DialogTitle>搜索博客和项目</DialogTitle>
          <DialogDescription>输入关键词搜索博客文章和项目</DialogDescription>
        </DialogHeader>

        {/* 搜索输入框 */}
        <div className="border-b border-[rgb(229,229,209)] px-4 pb-4 pt-5 transition-colors dark:border-[rgb(60,60,60)] sm:px-8 sm:pt-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 dark:text-white/60 transition-colors">
              <Search className="w-5 h-5" />
            </span>
            <Input
              type="text"
              placeholder="搜索博客和项目..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11 rounded-full border border-[rgb(229,229,209)] bg-[rgb(235,235,210)] pl-10 pr-12 font-sans text-base text-black shadow-sm transition-colors placeholder:text-black/50 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-[rgb(60,60,60)] dark:bg-[rgb(50,50,50)] dark:text-white dark:placeholder:text-white/50 sm:h-12 sm:pr-24 sm:text-lg"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuery("")}
                aria-label="清空搜索"
                className="absolute right-1 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white sm:right-3 sm:h-8 sm:w-8"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  width={20}
                  height={20}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                >
                  <path
                    d="M557.3 512l329.3-329.4a32 32 0 1 0-45.2-45.2L512 466.7 182.6 137.4a32 32 0 1 0-45.2 45.2L466.7 512 137.4 841.4a31.9 31.9 0 0 0 0 45.2 31.9 31.9 0 0 0 45.2 0L512 557.3l329.4 329.3a31.9 31.9 0 0 0 45.2 0 31.9 31.9 0 0 0 0-45.2z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-[65vh] overflow-y-auto">
          {isLoading ? (
            <div className="px-6 py-16 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black/30 dark:border-white/30"></div>
              <p className="mt-3 text-sm text-black/60 dark:text-white/60 transition-colors">加载中...</p>
            </div>
          ) : query && searchResults.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-black/20 dark:text-white/20 transition-colors" />
              <p className="text-base text-black/70 dark:text-white/70 font-medium transition-colors">未找到相关结果</p>
              <p className="text-sm text-black/50 dark:text-white/50 mt-2 transition-colors">试试其他关键词</p>
            </div>
          ) : query && searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((item, index) => (
                <button
                  key={`${item.type}-${item.slug}-${index}`}
                  onClick={() => handleItemClick(item)}
                  className="group w-full cursor-pointer border-b border-[rgb(229,229,209)] px-4 py-4 text-left transition-all duration-200 last:border-0 hover:border-[rgb(210,180,120)] hover:bg-[rgb(252,252,228)] hover:shadow-md focus-visible:bg-[rgb(252,252,228)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(210,180,120)] dark:border-[rgb(60,60,60)] dark:hover:border-[rgb(180,150,90)] dark:hover:bg-[rgb(55,55,55)] dark:focus-visible:bg-[rgb(55,55,55)] dark:focus-visible:ring-[rgb(180,150,90)] sm:px-6"
                >
                  <div className="flex items-start gap-4">
                    {/* 图标 */}
                    <div className="flex-shrink-0 mt-0.5">
                      {item.type === "blog" ? (
                        <BookOpen className="w-5 h-5 text-black dark:text-white transition-colors group-hover:text-primary dark:group-hover:text-primary" />
                      ) : (
                        <Github className="w-5 h-5 text-black dark:text-white transition-colors group-hover:text-primary dark:group-hover:text-primary" />
                      )}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-black dark:text-white text-lg mb-2 line-clamp-1 transition-colors group-hover:text-primary dark:group-hover:text-primary">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed mb-3 line-clamp-2 transition-colors">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <span className="text-black/50 dark:text-white/50 transition-colors">{formatDate(item.date)}</span>

                        {item.categories && item.categories.length > 0 && (
                          <div className="flex gap-1.5">
                            {item.categories.slice(0, 2).map((category) => (
                              <span
                                key={category}
                                className="inline-block px-2.5 py-1 text-xs font-semibold bg-accent-yellow/30 dark:bg-accent-yellow/20 text-[rgb(133,77,14)] dark:text-[rgb(230,180,100)] rounded border border-accent-yellow/40 dark:border-accent-yellow/30 transition-colors"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.tags && item.tags.length > 0 && !item.categories && (
                          <div className="flex gap-1.5">
                            {item.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block px-2.5 py-1 text-xs font-semibold bg-accent-yellow/30 dark:bg-accent-yellow/20 text-[rgb(133,77,14)] dark:text-[rgb(230,180,100)] rounded border border-accent-yellow/40 dark:border-accent-yellow/30 transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3 px-4 py-14 text-center sm:px-6 sm:py-20">
              <p className="text-base text-black/80 dark:text-white/80 font-medium transition-colors">输入关键词搜索博客和项目</p>
              <div className="hidden items-center justify-center gap-2 text-sm text-black/70 dark:text-white/70 transition-colors sm:flex">
                <kbd className="px-2 py-1 rounded border border-[rgb(229,229,209)] dark:border-[rgb(60,60,60)] bg-[rgb(235,235,210)] dark:bg-[rgb(50,50,50)] transition-colors">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 rounded border border-[rgb(229,229,209)] dark:border-[rgb(60,60,60)] bg-[rgb(235,235,210)] dark:bg-[rgb(50,50,50)] transition-colors">K</kbd>
                <span>快速打开搜索</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
