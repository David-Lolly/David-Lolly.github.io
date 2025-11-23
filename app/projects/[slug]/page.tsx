import { Header } from "@/components/header"
import { projects } from "#site/content"
import { notFound } from "next/navigation"
import { ProjectDetail } from "@/components/project-detail"

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
  const filteredProjects = projects
    .filter((p) => 
      p.slug !== project.slug && 
      p.tags?.some((tag) => project.tags?.includes(tag))
    )
  
  // 随机打乱数组并取前 2 个
  const relatedProjects = filteredProjects
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)

  return (
    <div className="min-h-screen">
      <Header />
      <ProjectDetail 
        project={project} 
        relatedProjects={relatedProjects}
      />
    </div>
  )
}
