import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const articleData = {
  id: 1,
  title: "我的第一篇 Hextra 博客",
  excerpt: "开始使用 Hextra 主题搭建个人博客，了解基础配置和图片处理方式。",
  coverImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dR4B4BGrCHvX80gFrjPX4RG5jxcYBN.png",
  date: "2025年11月08日",
  category: "技术教程",
  readTime: "5 分钟",
  content: `
## 引言

在这篇文章中，我将分享如何使用 Hextra 主题搭建一个现代化的个人博客。Hextra 是一个功能强大、设计优雅的 Hugo 主题，特别适合技术博客和文档网站。

## 为什么选择 Hextra

Hextra 主题具有以下优势：

- **快速响应**：基于 Hugo 构建，页面加载速度极快
- **移动优先**：完美适配各种屏幕尺寸
- **暗黑模式**：内置暗黑模式支持
- **SEO 友好**：优化的 HTML 结构和元数据
- **现代化设计**：简洁优雅的界面设计

## 安装步骤

### 1. 安装 Hugo

首先需要在你的系统上安装 Hugo。你可以通过以下方式安装：

\`\`\`bash
# macOS
brew install hugo

# Windows (使用 Chocolatey)
choco install hugo-extended

# Linux
sudo apt-get install hugo
\`\`\`

### 2. 创建新站点

使用 Hugo 命令创建一个新的站点：

\`\`\`bash
hugo new site my-blog
cd my-blog
\`\`\`

### 3. 添加 Hextra 主题

将 Hextra 主题添加为 Git 子模块：

\`\`\`bash
git init
git submodule add https://github.com/imfing/hextra.git themes/hextra
\`\`\`

### 4. 配置站点

编辑 \`config.yaml\` 文件，配置你的博客：

\`\`\`yaml
baseURL: "https://example.com/"
languageCode: "zh-cn"
title: "我的技术博客"
theme: "hextra"

params:
  description: "分享技术见解和学习笔记"
  author: "乐乐博文"
\`\`\`

## 图片处理

在 Hextra 中处理图片非常简单。你可以将图片放在 \`static/images\` 目录下，然后在文章中引用：

\`\`\`markdown
![图片描述](/images/example.png)
\`\`\`

对于封面图片，可以在文章的 Front Matter 中指定：

\`\`\`yaml
---
title: "文章标题"
date: 2025-11-08
coverImage: "/images/cover.jpg"
---
\`\`\`

## 启动开发服务器

配置完成后，启动开发服务器预览你的博客：

\`\`\`bash
hugo server -D
\`\`\`

访问 \`http://localhost:1313\` 即可看到你的博客。

## 总结

通过以上步骤，我们成功搭建了一个基于 Hextra 主题的 Hugo 博客。Hextra 提供了丰富的功能和优雅的设计，让我们可以专注于内容创作，而不用过多担心技术细节。

在后续的文章中，我将继续分享更多关于 Hugo 和 Hextra 的使用技巧，包括：

- 自定义主题样式
- 添加评论系统
- SEO 优化技巧
- 部署到生产环境

敬请期待！
  `,
  tags: ["Hugo", "Hextra", "建站", "技术教程"],
}

const relatedArticles = [
  {
    id: 2,
    title: "深入理解 Hugo Shortcodes",
    date: "2025年11月07日",
  },
  {
    id: 3,
    title: "Hextra 主题 SEO 优化指南",
    date: "2025年11月06日",
  },
]

export default function BlogDetailPage() {
  return (
    <div className="min-h-screen">
      <Header />

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
              <Badge variant="secondary">{articleData.category}</Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{articleData.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{articleData.readTime}</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-serif font-bold mb-4 leading-tight">{articleData.title}</h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">{articleData.excerpt}</p>

            <div className="flex items-center gap-3 mb-8">
              {articleData.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              分享文章
            </Button>
          </div>

          <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden bg-muted">
            <img
              src={articleData.coverImage || "/placeholder.svg"}
              alt={articleData.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <div
              className="article-content leading-relaxed"
              dangerouslySetInnerHTML={{ __html: articleData.content }}
            />
          </div>
        </article>

        <Separator className="my-12" />

        <div>
          <h2 className="text-2xl font-serif font-bold mb-6">相关文章</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedArticles.map((article) => (
              <Card key={article.id} className="p-5 hover:shadow-md transition-shadow">
                <a href={`/blog/${article.id}`} className="block group">
                  <h3 className="font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{article.date}</p>
                </a>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        <div>
          <h2 className="text-2xl font-serif font-bold mb-6">评论区</h2>
          <Card className="p-8">
            <p className="text-center text-muted-foreground">评论系统即将上线，敬请期待...</p>
          </Card>
        </div>
      </main>
    </div>
  )
}
