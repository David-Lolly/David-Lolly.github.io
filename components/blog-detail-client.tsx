"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowLeft, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MDXContent } from "@/components/mdx-components"
import { useState } from "react"
import { toast } from "sonner"

interface Post {
  title: string
  slug: string
  date: string
  image?: string
  description?: string
  categories?: string[]
  body: string
  raw: string // 添加原始内容字段
  readingTime: string
}

interface BlogDetailClientProps {
  post: Post
  relatedPosts: Post[]
}

export function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const [copied, setCopied] = useState(false)

  // 在客户端组件内部定义格式化日期函数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "年").replace(/年(\d+)年/, "年$1月") + "日"
  }

  // 复制全文功能
  const handleCopyContent = async () => {
    try {
      // 构建完整的文章内容
      const contentToCopy = `# ${post.title}

${post.description || ''}

**日期**: ${formatDate(post.date)}  
**分类**: ${post.categories?.join(', ') || '无'}

---

${post.raw || ''}
`
      await navigator.clipboard.writeText(contentToCopy)
      setCopied(true)
      toast.success("已复制全文")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("复制失败，请重试")
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Button variant="ghost" className="mb-6 -ml-2" asChild>
        <a href="/blog">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回博客列表
        </a>
      </Button>

      <article>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {post.categories && post.categories.length > 0 && (
              <Badge variant="secondary">{post.categories[0]}</Badge>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold mb-4 leading-tight">{post.title}</h1>

          {post.description && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">{post.description}</p>
          )}

          {post.categories && post.categories.length > 0 && (
            <div className="flex items-center gap-3 mb-8">
              {post.categories.map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
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

        {post.image && (
          <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden bg-muted">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="article-content leading-relaxed">
          <MDXContent code={post.body} />
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <>
          <Separator className="my-12" />
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">相关文章</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPosts.map((article) => (
                <Card key={article.slug} className="p-5 hover:shadow-md transition-shadow">
                  <a href={`/blog/${article.slug}`} className="block group">
                    <h3 className="font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{formatDate(article.date)}</p>
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
