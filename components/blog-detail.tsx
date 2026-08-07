import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowLeft, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MDXContent } from "@/components/mdx-components"
import { GiscusComments } from "@/components/giscus-comments"
import { CopyMarkdownButton } from "@/components/copy-markdown-button"

interface Post {
  title: string
  slug: string
  date: string
  image?: string
  description?: string
  categories?: string[]
  body: string
  content: string
  readingTime: string
}

interface BlogDetailProps {
  post: Post
  prevPost: Post | null
  nextPost: Post | null
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return (
    date
      .toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "年")
      .replace(/年(\d+)年/, "年$1月") + "日"
  )
}

const buildMarkdownPayload = (post: Post) => {
  const metadata = [
    `title: ${post.title}`,
    `date: ${post.date}`,
    post.description ? `description: ${post.description}` : null,
    post.categories && post.categories.length > 0
      ? `categories: [${post.categories.join(", ")}]`
      : null,
    post.image ? `image: ${post.image}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  return `---\n${metadata}\n---\n\n${post.content || ""}`
}

export function BlogDetail({ post, prevPost, nextPost }: BlogDetailProps) {
  const markdownPayload = buildMarkdownPayload(post)

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-12">
      <Button variant="ghost" className="mb-5 min-h-11 -ml-2 sm:mb-6" asChild>
        <a href="/blog">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回博客列表
        </a>
      </Button>

      <article>
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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

          <h1 className="mb-4 text-3xl font-heading font-bold leading-tight sm:text-4xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="mb-6 text-base text-muted-foreground leading-relaxed sm:text-lg">
              {post.description}
            </p>
          )}

          <CopyMarkdownButton
            content={markdownPayload}
            className="mt-2"
          />
        </div>

        <div className="article-content leading-relaxed">
          <MDXContent code={post.body} enableImageLightbox />
        </div>
      </article>

      {(prevPost || nextPost) && (
        <>
          <div className="mt-16 mb-12">
            <Separator className="h-[1px] bg-border/100" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold mb-6">推荐阅读</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card className="p-4 hover:shadow-md transition-shadow sm:p-5">
                {prevPost ? (
                  <a
                    href={`/blog/${prevPost.slug}`}
                    className="block group"
                    title={prevPost.title}
                  >
                    <div className="text-sm font-sans text-muted-foreground mb-2">
                      ← 上一篇
                    </div>
                    <div className="font-sans font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {prevPost.title}
                    </div>
                  </a>
                ) : (
                  <div>
                    <div className="text-sm font-sans text-muted-foreground/50 mb-2">
                      ← 上一篇
                    </div>
                    <div className="font-sans text-muted-foreground/50">
                      没有更早的文章了
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-4 hover:shadow-md transition-shadow sm:p-5">
                <div className="text-right">
                  {nextPost ? (
                    <a
                      href={`/blog/${nextPost.slug}`}
                      className="block group"
                      title={nextPost.title}
                    >
                      <div className="text-sm font-sans text-muted-foreground mb-2">
                        下一篇 →
                      </div>
                      <div className="font-sans font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {nextPost.title}
                      </div>
                    </a>
                  ) : (
                    <div>
                      <div className="text-sm font-sans text-muted-foreground/50 mb-2">
                        下一篇 →
                      </div>
                      <div className="font-sans text-muted-foreground/50">
                        没有更新的文章了
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      <div className="mt-16 mb-12">
        <Separator className="h-[2px] bg-[rgb(200,200,180)] dark:bg-[rgb(63,63,70)]" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-heading font-semibold text-foreground">
            发表评论
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          欢迎留下你的想法和见解，使用 GitHub 账号登录即可参与讨论
        </p>
        <div className="bg-card rounded-lg border border-border/60 p-3 sm:p-6">
          <GiscusComments />
        </div>
      </div>
    </main>
  )
}


