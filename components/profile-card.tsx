import { Github, Mail, Twitter, Linkedin, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { basic } from "#site/content"

export function ProfileCard() {
  // 从配置文件中获取 profile 信息
  const profile = basic.find((item) => item.type === 'profile')

  // 如果没有配置文件，使用默认值
  if (!profile) {
    return null
  }

  const {
    name,
    avatar,
    position,
    bio,
    email,
    github,
    twitter,
    linkedin,
    website,
    tech_stack
  } = profile

  return (
    <Card className="p-4 sm:p-6 lg:sticky lg:top-24 bg-[rgb(250,250,228)] dark:bg-[rgb(24,24,27)]">
      {/* Avatar */}
      <div className="mb-5 flex items-center gap-4 lg:mb-6 lg:flex-col lg:gap-0">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-primary/10 lg:mb-4 lg:h-32 lg:w-32">
          <img
            src={avatar || "/static/images/basic_info/avatar.jpg"}
            alt={name || "用户"}
            width={128}
            height={128}
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 text-left lg:text-center">
          <h2 className="mb-1 text-xl font-heading font-bold sm:text-2xl lg:mb-2">{name || "未设置姓名"}</h2>
          {position && (
            <p className="mb-1 text-xs text-muted-foreground lg:mb-2">{position}</p>
          )}
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground lg:line-clamp-none">
            {bio || "暂无个人简介"}
          </p>
        </div>
      </div>

      {/* Tech Stack - 可选显示 */}
      {tech_stack && tech_stack.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <span className="text-lg">💻</span>
            技术栈
          </h3>
          <div className="flex flex-wrap gap-2">
            {tech_stack.map((tech: string) => (
              <Badge key={tech} variant="secondary" className="text-xs border border-solid border-border shadow-md">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="flex items-center justify-center gap-2">
        {github && (
          <Button variant="ghost" size="icon" className="h-11 w-11 lg:h-9 lg:w-9" asChild>
            <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        )}
        {/* {twitter && (
          <Button variant="ghost" size="icon" className="h-11 w-11 lg:h-9 lg:w-9" asChild>
            <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
        )}
        {linkedin && (
          <Button variant="ghost" size="icon" className="h-11 w-11 lg:h-9 lg:w-9" asChild>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </Button>
        )} */}
        {email && (
          <Button variant="ghost" size="icon" className="h-11 w-11 lg:h-9 lg:w-9" asChild>
            <a href={`mailto:${email}`} aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </Button>
        )}
        {website && (
          <Button variant="ghost" size="icon" className="h-11 w-11 lg:h-9 lg:w-9" asChild>
            <a href={website} target="_blank" rel="noopener noreferrer" aria-label="Website">
              <Globe className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </Card>
  )
}
