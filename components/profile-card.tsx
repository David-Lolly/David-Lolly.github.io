import { Github, Mail, Twitter } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ProfileCard() {
  const techStack = ["Python", "FastAPI", "LangChain", "Docker",  "Vue", "AI/ML"]

  return (
    <Card className="p-6 sticky top-24 bg-[rgb(250,250,228)]">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-primary/10">
          <img src="/static/images/basic_info/avatar.jpg" alt="熊乐乐" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-center mb-2">熊乐乐</h2>
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          一只开发工程狮🦁，目前主要做AI应用开发。在这里记录我的学习旅程，分享技术见解与项目经验。
        </p>
      </div>

      {/* Tech Stack */}
      {/* <div className="mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <span className="text-lg">💻</span>
          技术栈
        </h3>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs border border-solid border-border shadow-md">
              {tech}
            </Badge>
          ))}
        </div>
      </div> */}

      {/* Social Links */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
          <a href="https://github.com/David-Lolly/TinyAISearch" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </a>
        </Button>
        {/* <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="h-4 w-4" />
          </a>
        </Button> */}
        <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
          <a href="mailto:3419552864@qq.com" aria-label="Email">
            <Mail className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </Card>
  )
}
