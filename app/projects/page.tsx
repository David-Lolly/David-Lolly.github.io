import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpenIcon, Github, Star, GitFork } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "AI 聊天机器人",
    description: "基于大语言模型的智能对话系统，支持多轮对话、上下文理解和知识检索。使用 LangChain 和 FastAPI 构建。",
    image: "/ai-chatbot-interface.png",
    tags: ["Python", "LangChain", "FastAPI", "AI"],
    github: "https://github.com/username/ai-chatbot",
    demo: "https://demo.example.com",
    stars: 156,
    forks: 32,
    status: "进行中",
  },
  {
    id: 2,
    name: "微服务监控平台",
    description: "分布式系统监控解决方案，提供实时性能指标、日志聚合和告警功能。基于 Go 和 Kubernetes 开发。",
    image: "/monitoring-dashboard-metrics.jpg",
    tags: ["Go", "Kubernetes", "Docker", "监控"],
    github: "https://github.com/username/monitor-platform",
    demo: "https://monitor.example.com",
    stars: 89,
    forks: 15,
    status: "已完成",
  },
  {
    id: 3,
    name: "云原生 DevOps 工具",
    description: "自动化 CI/CD 流水线工具，支持多云部署、容器编排和自动化测试。简化开发到生产的全流程。",
    image: "/devops-pipeline-automation.png",
    tags: ["Python", "Docker", "CI/CD", "自动化"],
    github: "https://github.com/username/devops-tool",
    stars: 234,
    forks: 67,
    status: "已完成",
  },
  {
    id: 4,
    name: "实时数据分析引擎",
    description: "高性能的流式数据处理系统，支持实时数据采集、处理和可视化。适用于日志分析和业务指标监控。",
    image: "/data-analytics-dashboard.png",
    tags: ["Go", "Kafka", "Redis", "数据分析"],
    github: "https://github.com/username/data-engine",
    demo: "https://analytics.example.com",
    stars: 178,
    forks: 45,
    status: "已完成",
  },
  {
    id: 5,
    name: "个人博客系统",
    description: "基于 Hugo 和 Hextra 主题的现代化博客系统，支持 Markdown 写作、SEO 优化和评论功能。",
    image: "/modern-blog-website.jpg",
    tags: ["Hugo", "Hextra", "前端", "建站"],
    github: "https://github.com/username/blog",
    demo: "https://blog.example.com",
    stars: 67,
    forks: 12,
    status: "进行中",
  },
  {
    id: 6,
    name: "API 网关服务",
    description: "轻量级的 API 网关，提供路由转发、认证鉴权、限流熔断等功能。支持插件扩展和动态配置。",
    image: "/api-gateway-architecture.jpg",
    tags: ["Go", "微服务", "网关", "后端"],
    github: "https://github.com/username/api-gateway",
    stars: 312,
    forks: 89,
    status: "已完成",
  },
]

const techStacks = [
  "Python",
  "Go",
  "FastAPI",
  "Docker",
  "Kubernetes",
  "LangChain",
  "Vue.js",
  "AI/ML",
  "微服务",
  "CI/CD",
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">项目展示</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            这里是我参与开发和维护的开源项目，涵盖 AI、云原生、微服务等技术领域
          </p>

          <div className="flex flex-wrap gap-2">
            {techStacks.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow group bg-[rgba(250,250,227,1)]">
              <div className="h-48 overflow-hidden bg-muted">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <Badge variant={project.status === "已完成" ? "default" : "secondary"} className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span>{project.forks}</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-4 text-sm">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs text-[rgba(133,78,15,1)]">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 flex-1 bg-transparent" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      源码
                    </a>
                  </Button>
                  {project.demo && (
                    <Button variant="outline" size="sm" className="gap-2 flex-1" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <BookOpenIcon className="h-4 w-4 bg-background" />
                        简介
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

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
