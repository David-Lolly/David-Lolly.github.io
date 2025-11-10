import { Header } from "@/components/header"
import { basic } from "#site/content"
import { notFound } from "next/navigation"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  // 从配置文件中获取 about 信息
  const about = basic.find((item) => item.type === 'about')
  
  if (!about) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Button variant="ghost" className="mb-6 -ml-2" asChild>
          <a href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回首页
          </a>
        </Button>

        <article>
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-4 leading-tight">
              {about.title || "关于"}
            </h1>
          </div>

          <div className="article-content leading-relaxed">
            <MarkdownRenderer content={about.content || ""} />
          </div>
        </article>
      </main>
    </div>
  )
}
