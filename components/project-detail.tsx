import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Star,
  GitFork,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { GiscusComments } from "@/components/giscus-comments"
import { CopyMarkdownButton } from "@/components/copy-markdown-button"
import { MDXContent } from "@/components/mdx-components"

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
  content: string
}

interface ProjectDetailProps {
  project: Project
  relatedProjects: Project[]
}

const buildMarkdownPayload = (project: Project) => {
  const metadata = [
    `title: ${project.title}`,
    `slug: ${project.slug}`,
    `status: ${project.status}`,
    project.description ? `description: ${project.description}` : null,
    project.tags && project.tags.length > 0
      ? `tags: [${project.tags.join(", ")}]`
      : null,
    project.image ? `image: ${project.image}` : null,
    project.github_url ? `github_url: ${project.github_url}` : null,
    project.demo_url ? `demo_url: ${project.demo_url}` : null,
    project.stars > 0 ? `stars: ${project.stars}` : null,
    project.forks > 0 ? `forks: ${project.forks}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  return `---\n${metadata}\n---\n\n${project.content || ""}`
}

export function ProjectDetail({ project, relatedProjects }: ProjectDetailProps) {
  const markdownPayload = buildMarkdownPayload(project)

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

          <h1 className="text-4xl font-serif font-bold mb-4 leading-tight">
            {project.title}
          </h1>

          {project.description && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {project.description}
            </p>
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

          <CopyMarkdownButton content={markdownPayload} className="gap-2 bg-transparent" />
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
          <MDXContent code={project.body} />
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
                      <Badge
                        variant={proj.status === "已完成" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {proj.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {proj.description}
                    </p>
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

      <div className="mt-16 mb-12">
        <Separator className="h-[2px] bg-[rgb(200,200,180)]" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-sans font-semibold text-foreground">
            发表评论
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          欢迎留下你的想法和见解，使用 GitHub 账号登录即可参与讨论
        </p>
        <div className="bg-card rounded-lg border border-border/60 p-6">
          <GiscusComments />
        </div>
      </div>
    </main>
  )
}


