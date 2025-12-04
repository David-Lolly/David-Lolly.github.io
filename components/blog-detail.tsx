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

          <h1 className="text-4xl font-serif font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {post.description}
            </p>
          )}

          <CopyMarkdownButton
            content={markdownPayload}
            className="mt-2"
          />
        </div>

        {post.image && (
          <div className="w-full h-[420px] mb-8 rounded-lg bg-muted flex items-center justify-center p-2">
            <img
              src={post.image}
              alt={post.title}
              className="max-h-full max-w-full w-auto object-contain"
            />
          </div>
        )}

        <div className="article-content leading-relaxed">
          <MDXContent code={post.body} />
        </div>
      </article>

      {(prevPost || nextPost) && (
        <>
          <div className="mt-16 mb-12">
            <Separator className="h-[1px] bg-border/100" />
          </div>
          <div>
            <h2 className="text-xl font-sans font-semibold mb-6">推荐阅读</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-5 hover:shadow-md transition-shadow">
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

              <Card className="p-5 hover:shadow-md transition-shadow">
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
        <Separator className="h-[2px] bg-[rgb(200,200,180)]" />
      </div>

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


