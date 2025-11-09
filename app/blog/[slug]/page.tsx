import { Header } from "@/components/header"
import { posts } from "#site/content"
import { notFound } from "next/navigation"
import { BlogDetailClient } from "@/components/blog-detail-client"

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

  // 获取相关文章（同分类的其他文章）
  const relatedPosts = posts
    .filter((p) => 
      p.slug !== post.slug && 
      p.categories?.some((cat) => post.categories?.includes(cat))
    )
    .slice(0, 2)

  return (
    <div className="min-h-screen">
      <Header />
      <BlogDetailClient 
        post={post} 
        relatedPosts={relatedPosts}
      />
    </div>
  )
}
