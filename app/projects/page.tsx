"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Github, Star, GitFork, Calendar } from "lucide-react"
import { projects } from "#site/content"
import { useState, useMemo } from "react"

export default function ProjectsPage() {
  const [selectedTag, setSelectedTag] = useState<string>("全部")

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
    const filtered = selectedTag === "全部" 
      ? projects 
      : projects.filter((project) => project.tags?.includes(selectedTag))
    
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
  }, [selectedTag])

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

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={tag === selectedTag ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  tag === selectedTag 
                    ? "bg-[rgb(220,200,100)] text-[rgb(92,64,32)]" 
                    : ""
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.slug} className="overflow-hidden hover:shadow-lg transition-shadow group bg-[rgba(250,250,227,1)]">
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
                    <Badge key={tag} variant="outline" className="text-xs text-[rgba(133,78,15,1)]">
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
