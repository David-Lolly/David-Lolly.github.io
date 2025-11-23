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
import Image from "next/image"

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
      <DialogContent className="max-w-3xl p-0 gap-0 bg-[rgb(240,240,215)] border-[rgb(229,229,209)] shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>搜索博客和项目</DialogTitle>
          <DialogDescription>输入关键词搜索博客文章和项目</DialogDescription>
        </DialogHeader>

        {/* 搜索输入框 */}
        <div className="px-8 pt-6 pb-4 border-b border-[rgb(229,229,209)]">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60">
              <Search className="w-5 h-5" />
            </span>
            <Input
              type="text"
              placeholder="搜索博客和项目..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 pl-10 pr-24 rounded-full bg-[rgb(235,235,210)] border border-[rgb(229,229,209)] shadow-sm text-lg text-black placeholder:text-black/50 font-sans focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none" // <-- 修改点：移除了 focus 效果
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 hover:text-black hover:bg-black/5 rounded-full h-8 w-8"
              >
                <Image 
                  src="/static/images/icon/叉.svg" 
                  alt="清空" 
                  width={20} 
                  height={20}
                  className="opacity-70 hover:opacity-100"
                />
              </Button>
            )}
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-[65vh] overflow-y-auto">
          {isLoading ? (
            <div className="px-6 py-16 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black/30"></div>
              <p className="mt-3 text-sm text-black/60">加载中...</p>
            </div>
          ) : query && searchResults.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-black/20" />
              <p className="text-base text-black/70 font-medium">未找到相关结果</p>
              <p className="text-sm text-black/50 mt-2">试试其他关键词</p>
            </div>
          ) : query && searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((item, index) => (
                <button
                  key={`${item.type}-${item.slug}-${index}`}
                  onClick={() => handleItemClick(item)}
                  className="w-full px-6 py-4 text-left border-b border-[rgb(229,229,209)] last:border-0 transition-all duration-200 hover:bg-[rgb(252,252,228)] hover:border-[rgb(210,180,120)] hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(210,180,120)] focus-visible:bg-[rgb(252,252,228)]"
                >
                  <div className="flex items-start gap-4">
                    {/* 图标 */}
                    <div className="flex-shrink-0 mt-0.5">
                      {item.type === "blog" ? (
                        <BookOpen className="w-5 h-5 text-black" />
                      ) : (
                        <Github className="w-5 h-5 text-black" />
                      )}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-black text-lg mb-2 line-clamp-1">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-black/60 leading-relaxed mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-black/50">{formatDate(item.date)}</span>

                        {item.categories && item.categories.length > 0 && (
                          <div className="flex gap-1.5">
                            {item.categories.slice(0, 2).map((category) => (
                              <span
                                key={category}
                                className="inline-block px-2.5 py-1 text-xs font-semibold bg-accent-yellow/30 text-[rgb(133,77,14)] rounded border border-accent-yellow/40"
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
                                className="inline-block px-2.5 py-1 text-xs font-semibold bg-accent-yellow/30 text-[rgb(133,77,14)] rounded border border-accent-yellow/40"
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
            <div className="px-6 py-20 text-center space-y-3">
              <p className="text-base text-black/80 font-medium">点击对话框外部空白关闭搜索</p>
              <div className="flex items-center justify-center gap-2 text-sm text-black/70">
                <kbd className="px-2 py-1 rounded border border-[rgb(229,229,209)] bg-[rgb(235,235,210)]">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 rounded border border-[rgb(229,229,209)] bg-[rgb(235,235,210)]">K</kbd>
                <span>快速打开搜索</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}