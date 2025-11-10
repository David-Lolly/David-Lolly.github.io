import { Header } from "@/components/header"
import { projects } from "#site/content"
import { notFound } from "next/navigation"
import { ProjectDetailClient } from "@/components/project-detail-client"

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

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Next.js 15+: params 是一个 Promise，需要 await
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

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
      <ProjectDetailClient 
        project={project} 
        relatedProjects={relatedProjects}
      />
    </div>
  )
}
