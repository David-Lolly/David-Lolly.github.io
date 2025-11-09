import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import readingTime from 'reading-time'

// 计算阅读时间的辅助函数
const computedFields = <T extends { body: string }>(data: T) => ({
  readingTime: readingTime(data.body).text,
})

// 定义 Post (博客) 集合
const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug('post'),
      date: s.isodate(),
      image: s.string().optional(),
      description: s.string().max(999).optional(),
      categories: s.array(s.string()).default([]),
      body: s.mdx(),
      content: s.raw(), // 使用 s.raw() 获取原始 Markdown 内容（不包括 frontmatter）
    })
    .transform((data) => ({ ...data, ...computedFields(data) })),
})

// 定义 Project (项目) 集合
const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug('project'),
      status: s.string().default('进行中'),
      image: s.string().optional(),
      description: s.string().max(999).optional(),
      tags: s.array(s.string()).default([]),
      github_url: s.string().optional(),
      demo_url: s.string().optional(),
      stars: s.number().default(0),
      forks: s.number().default(0),
      body: s.mdx(),
    })
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts, projects },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: 'github-dark' }],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
    remarkPlugins: [],
  },
})
