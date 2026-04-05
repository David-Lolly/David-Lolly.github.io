"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Github, Star, GitFork, Calendar, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { projects } from "#site/content"
import { useState, useMemo, useEffect, useRef } from "react"

export default function ProjectsPage() {
  const [selectedTag, setSelectedTag] = useState<string>("全部")
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

  // 获取所有技术栈标签
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projects.forEach((project) => {
      project.tags?.forEach((tag) => tagSet.add(tag))
    })
    return ["全部", ...Array.from(tagSet).sort()]
  }, [])

  // 过滤和排序项目
  const filteredProjects = useMemo(() => {
    let filtered = selectedTag === "全部"
      ? projects
      : projects.filter((project) => project.tags?.includes(selectedTag))

    if (searchQuery) {
      filtered = filtered.filter(project => project.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // 智能排序：
    // 1. 按 status 排序（已完成 > 进行中 > 其他）
    // 2. 按日期降序排序（最新的在前）
    // 3. 按 stars 降序排序
    // 4. 按 forks 降序排序
    return filtered.sort((a, b) => {
      // 1. 按状态排序
      const statusOrder: Record<string, number> = {
        '已完成': 1,
        '进行中': 2,
      }
      const statusA = statusOrder[a.status] || 999
      const statusB = statusOrder[b.status] || 999
      if (statusA !== statusB) {
        return statusA - statusB
      }

      // 2. 按日期排序（最新的在前）
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      if (dateA !== dateB) {
        return dateB - dateA
      }

      // 3. 按 stars 排序
      if (a.stars !== b.stars) {
        return b.stars - a.stars
      }

      // 4. 按 forks 排序
      return b.forks - a.forks
    })
  }, [selectedTag, searchQuery])

  // 分页逻辑
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProjects, currentPage, itemsPerPage])

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
          <h1 className="text-4xl font-serif font-bold mb-4">开源项目</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            这里是我参与开发和维护的开源项目，涵盖 AI、云原生、微服务等技术领域
          </p>

          <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索项目名称..."
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
                  <span className="text-sm font-semibold text-foreground pr-2">{itemsPerPage} 项</span>
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
                          {num} 项
                          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={tag === selectedTag ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${tag === selectedTag
                  ? "bg-[rgb(220,200,100)] text-[rgb(92,64,32)]"
                  : ""
                  }`}
                onClick={() => {
                  setSelectedTag(tag)
                  setCurrentPage(1)
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {currentProjects.map((project) => (
            <Card key={project.slug} className="overflow-hidden hover:shadow-lg transition-shadow group bg-[rgba(250,250,227,1)] dark:bg-[rgb(24,24,27)]">
              <div className="h-48 overflow-hidden bg-muted">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <Badge variant={project.status === "已完成" ? "default" : "secondary"} className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  {(project.stars > 0 || project.forks > 0) && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {project.stars > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>{project.stars}</span>
                        </div>
                      )}
                      {project.forks > 0 && (
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          <span>{project.forks}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed mb-4 text-sm">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs text-[rgba(133,78,15,1)] dark:text-[rgb(251,191,36)]">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(project.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {project.github_url && (
                    <Button variant="outline" size="sm" className="gap-2 flex-1 bg-transparent" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        源码
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-2 flex-1" asChild>
                    <a href={`/projects/${project.slug}`}>
                      <BookOpen className="h-4 w-4 bg-background" />
                      详情
                    </a>
                  </Button>
                </div>
              </div>
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

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">没有找到符合条件的项目</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="p-8">
            <h2 className="text-2xl font-serif font-bold mb-4">更多项目</h2>
            <p className="text-muted-foreground mb-6">访问我的 GitHub 查看更多开源项目和贡献</p>
            <Button size="lg" className="gap-2" asChild>
              <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                访问 GitHub
              </a>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
