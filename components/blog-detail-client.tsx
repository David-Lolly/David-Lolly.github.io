"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowLeft, Copy, Check, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MDXContent } from "@/components/mdx-components"
import { GiscusComments } from "@/components/giscus-comments"
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
  content: string // 原始 Markdown 内容（不含 frontmatter）
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
      // 构建完整的 Markdown 文章内容
      const frontmatter = `---
title: ${post.title}
date: ${post.date}${post.description ? `\ndescription: ${post.description}` : ''}${post.categories && post.categories.length > 0 ? `\ncategories: [${post.categories.join(', ')}]` : ''}${post.image ? `\nimage: ${post.image}` : ''}
---
`
      const contentToCopy = frontmatter + '\n' + (post.content || '')
      
      await navigator.clipboard.writeText(contentToCopy)
      setCopied(true)
      toast.success("已复制 Markdown 原文")
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
            {/* {post.categories && post.categories.length > 0 && (
              <Badge variant="secondary">{post.categories[0]}</Badge>
            )} */}
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

          {/* {post.categories && post.categories.length > 0 && (
            <div className="flex items-center gap-3 mb-8">
              {post.categories.map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )} */}

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

      {/* 增强的分隔线区域 */}
      <div className="mt-16 mb-12">
        <Separator className="h-[2px] bg-[rgb(200,200,180)]" />
      </div>

      {/* 评论功能区 */}
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
