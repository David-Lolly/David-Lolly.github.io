"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Github, ExternalLink, Star, GitFork, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { useState } from "react"
import { toast } from "sonner"

interface Project {
  title: string
  slug: string
  status: string
  image?: string
  description?: string
  tags?: string[]
  github_url?: string
  demo_url?: string
  stars: number
  forks: number
  body: string
  content: string // 原始 Markdown 内容（不含 frontmatter）
}

interface ProjectDetailClientProps {
  project: Project
  relatedProjects: Project[]
}

export function ProjectDetailClient({ project, relatedProjects }: ProjectDetailClientProps) {
  const [copied, setCopied] = useState(false)

  // 复制全文功能
  const handleCopyContent = async () => {
    try {
      // 构建完整的 Markdown 项目内容
      const frontmatter = `---
title: ${project.title}
slug: ${project.slug}
status: ${project.status}${project.description ? `\ndescription: ${project.description}` : ''}${project.tags && project.tags.length > 0 ? `\ntags: [${project.tags.join(', ')}]` : ''}${project.image ? `\nimage: ${project.image}` : ''}${project.github_url ? `\ngithub_url: ${project.github_url}` : ''}${project.demo_url ? `\ndemo_url: ${project.demo_url}` : ''}${project.stars > 0 ? `\nstars: ${project.stars}` : ''}${project.forks > 0 ? `\nforks: ${project.forks}` : ''}
---
`
      const contentToCopy = frontmatter + '\n' + (project.content || '')
      
      await navigator.clipboard.writeText(contentToCopy)
      setCopied(true)
      toast.success("已复制 Markdown 原文")
      setTimeout(() => setCopied(false), 1000)
    } catch (err) {
      toast.error("复制失败，请重试")
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Button variant="ghost" className="mb-6 -ml-2" asChild>
        <a href="/projects">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回项目列表
        </a>
      </Button>

      <article>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge variant={project.status === "已完成" ? "default" : "secondary"}>
                {project.status}
              </Badge>
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
            <div className="flex items-center gap-2">
              {project.github_url && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    源码
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    demo
                  </a>
                </Button>
              )}
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold mb-4 leading-tight">{project.title}</h1>

          {project.description && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">{project.description}</p>
          )}

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-transparent"
            onClick={handleCopyContent}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                复制全文
              </>
            )}
          </Button>
        </div>

        {project.image && (
          <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden bg-muted">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="article-content leading-relaxed">
          <MarkdownRenderer content={project.content} />
        </div>
      </article>

      {relatedProjects.length > 0 && (
        <>
          <Separator className="my-12" />
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">相关项目</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedProjects.map((proj) => (
                <Card key={proj.slug} className="p-5 hover:shadow-md transition-shadow">
                  <a href={`/projects/${proj.slug}`} className="block group">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif font-bold group-hover:text-primary transition-colors">
                        {proj.title}
                      </h3>
                      <Badge variant={proj.status === "已完成" ? "default" : "secondary"} className="text-xs">
                        {proj.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{proj.description}</p>
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {proj.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator className="my-12" />

      <div>
        <h2 className="text-2xl font-serif font-bold mb-6">评论区</h2>
        <Card className="p-8">
          <p className="text-center text-muted-foreground">评论系统即将上线，敬请期待...</p>
        </Card>
      </div>
    </main>
  )
}
