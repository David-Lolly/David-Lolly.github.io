import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Github, ExternalLink, Star, GitFork } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "#site/content"
import { notFound } from "next/navigation"
import { MDXContent } from "@/components/mdx-components"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  // 获取相关项目（同技术栈的其他项目）
  const relatedProjects = projects
    .filter((p) => 
      p.slug !== project.slug && 
      p.tags?.some((tag) => project.tags?.includes(tag))
    )
    .slice(0, 2)

  return (
    <div className="min-h-screen">
      <Header />

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
                      演示
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

          <div className="prose prose-lg max-w-none dark:prose-invert">
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
      </main>
    </div>
  )
}
