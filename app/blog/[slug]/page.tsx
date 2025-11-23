import { Header } from "@/components/header"
import { posts } from "#site/content"
import { notFound } from "next/navigation"
import { BlogDetail } from "@/components/blog-detail"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Next.js 15+: params 是一个 Promise，需要 await
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  // 按日期排序所有文章（最新在前）
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  // 找到当前文章的索引
  const currentIndex = sortedPosts.findIndex((p) => p.slug === slug)
  
  // 获取上一篇（更早的文章，索引+1）和下一篇（更新的文章，索引-1）
  const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null

  return (
    <div className="min-h-screen">
      <Header />
      <BlogDetail 
        post={post} 
        prevPost={prevPost}
        nextPost={nextPost}
      />
    </div>
  )
}
