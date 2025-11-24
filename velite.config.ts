import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import readingTime from 'reading-time'

const BLOG_ROOT = 'content/blog'
const STATIC_ROOT = 'public/static'
const STATIC_BLOG_DIR = 'public/static/blog'
const STATIC_BLOG_BASE = '/static/blog'
const STATIC_BASE = '/static/'
const ASSET_CACHE_DIR = '.velite/assets-cache'
const ASSET_CACHE_BASE = '/_velite_cache_/'
const ASSET_PATH_SUFFIX_PATTERN = /[^\s"'`)]+/
const HASHED_FILENAME_REGEX_SEGMENT = '[a-zA-Z0-9]{6}'

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const extractRelativeImagePaths = (content?: string): string[] => {
  if (!content) return []

  const markdownRegex = /!\[[^\]]*]\((\.{1,2}\/[^)\s]+)\)/g
  const htmlRegex = /<img[^>]+src=["'](\.{1,2}\/[^"' >]+)["'][^>]*>/gi

  const matches = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = markdownRegex.exec(content)) !== null) {
    matches.add(match[1])
  }

  while ((match = htmlRegex.exec(content)) !== null) {
    matches.add(match[1])
  }

  return Array.from(matches)
}

const isRelativePath = (value?: string): value is string =>
  typeof value === 'string' && (value.startsWith('./') || value.startsWith('../'))

// 计算阅读时间的辅助函数
const computedFields = <T extends { body: string }>(data: T) => ({
  readingTime: readingTime(data.body, { wordsPerMinute: 300 }).text,
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
      featured: s.boolean().default(false),
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
      content: s.raw(), // 使用 s.raw() 获取原始 Markdown 内容（不包括 frontmatter）
    })
})

// 定义 Basic (基本信息) 集合
const basic = defineCollection({
  name: 'Basic',
  pattern: 'basic/**/*.mdx',
  schema: s
    .object({
      type: s.string(), // 'profile' 或 'about'
      // Profile 字段
      name: s.string().optional(),
      avatar: s.string().optional(),
      position: s.string().optional(),
      bio: s.string().optional(),
      location: s.string().optional(),
      email: s.string().optional(),
      github: s.string().optional(),
      twitter: s.string().optional(),
      linkedin: s.string().optional(),
      website: s.string().optional(),
      tech_stack: s.array(s.string()).optional(),
      // About 字段
      title: s.string().optional(),
      slug: s.string().optional(),
      body: s.mdx(),
      content: s.raw(), // 原始 Markdown 内容
    })
    .transform((data) => {
      // 清理空字符串和 null 值
      const cleaned: any = { ...data }
      Object.keys(cleaned).forEach(key => {
        if (cleaned[key] === null || cleaned[key] === '') {
          delete cleaned[key]
        }
      })
      return cleaned
    })
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: ASSET_CACHE_DIR,
    base: ASSET_CACHE_BASE,
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts, projects, basic },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: false, // 不保留主题背景，使用自定义样式
          defaultLang: 'plaintext',
        }
      ],
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
      rehypeKatex, // 添加 KaTeX 支持
    ],
    remarkPlugins: [
      remarkMath, // 添加数学公式解析支持
    ],
  },
  // 统一处理 frontmatter 中的本地封面路径
  prepare: async (data) => {
    const fs = await import('fs/promises')
    const path = await import('path')
    const { createHash } = await import('crypto')

    const posts = data.posts || []

    const copyRelativeAsset = async (
      slug: string,
      postDir: string,
      relativePath: string,
      cache: Map<string, { publicPath: string; baseName: string; ext: string }>
    ) => {
      const normalized = relativePath.replace(/\\/g, '/')
      if (cache.has(normalized)) {
        return cache.get(normalized)!
      }

      const absolutePath = path.resolve(postDir, normalized)
      const fileBuffer = await fs.readFile(absolutePath)
      const hash = createHash('sha1').update(fileBuffer).digest('hex').slice(0, 8)
      const ext = path.extname(absolutePath)
      const baseName = path.basename(absolutePath, ext)
      const destDir = path.join(process.cwd(), STATIC_BLOG_DIR, slug)
      await fs.mkdir(destDir, { recursive: true })
      const fileName = `${baseName}-${hash}${ext}`
      const destPath = path.join(destDir, fileName)
      await fs.writeFile(destPath, fileBuffer)
      const publicPath = `${STATIC_BLOG_BASE}/${slug}/${fileName}`.replace(/\\/g, '/')

      const assetInfo = { publicPath, baseName, ext }
      cache.set(normalized, assetInfo)
      return assetInfo
    }

    await Promise.all(
      posts.map(async (post: any) => {
        if (!post?.slug) return

        const postDir = path.join(process.cwd(), BLOG_ROOT, post.slug)
        const cache = new Map<string, { publicPath: string; baseName: string; ext: string }>()

        // 处理封面
        if (isRelativePath(post.image)) {
          try {
            const asset = await copyRelativeAsset(post.slug, postDir, post.image, cache)
            post.image = asset.publicPath
          } catch (error) {
            console.warn(`⚠️  无法解析文章 ${post.slug} 的封面 ${post.image}:`, (error as Error).message)
          }
        }

        // 处理正文图片
        const inlineAssets = extractRelativeImagePaths(post.content)

        for (const relativePath of inlineAssets) {
          try {
            const asset = await copyRelativeAsset(post.slug, postDir, relativePath, cache)

            if (typeof post.body === 'string') {
              const baseNamePattern = escapeRegExp(asset.baseName)
              const extPattern = escapeRegExp(asset.ext)
              const hashedAssetRegex = new RegExp(
                `${escapeRegExp(ASSET_CACHE_BASE)}${baseNamePattern}-${HASHED_FILENAME_REGEX_SEGMENT}${extPattern}`,
                'g'
              )
              post.body = post.body.replace(hashedAssetRegex, asset.publicPath)
            }
          } catch (error) {
            console.warn(`⚠️  无法解析文章 ${post.slug} 的正文图片 ${relativePath}:`, (error as Error).message)
          }
        }

        // 如果正文仍包含 Velite 输出或 /static/ 根路径图片（例如非相对路径），额外复制并重写到 slug 目录
        if (typeof post.body === 'string') {
          const assetSources = [
            { base: ASSET_CACHE_BASE, root: ASSET_CACHE_DIR },
            { base: STATIC_BASE, root: STATIC_ROOT },
          ]

          const collected = new Set<string>()

          for (const { base } of assetSources) {
            const regex = new RegExp(
              `${escapeRegExp(base)}${ASSET_PATH_SUFFIX_PATTERN.source}`,
              'g'
            )
            const matches = post.body.match(regex) || []
            matches.forEach((match: string) => collected.add(match))
          }

          for (const assetPath of collected) {
            if (assetPath.startsWith(`${STATIC_BLOG_BASE}/${post.slug}/`)) continue

            const sourceConfig = assetSources.find(({ base }) => assetPath.startsWith(base))
            if (!sourceConfig) continue

            const relativeAsset = assetPath.slice(sourceConfig.base.length)
            const sourcePath = path.join(process.cwd(), sourceConfig.root, relativeAsset)
            const fileName = path.basename(relativeAsset)

            try {
              const buffer = await fs.readFile(sourcePath)
              const destDir = path.join(process.cwd(), STATIC_BLOG_DIR, post.slug)
              await fs.mkdir(destDir, { recursive: true })
              const destPath = path.join(destDir, fileName)
              await fs.writeFile(destPath, buffer)

              const publicPath = `${STATIC_BLOG_BASE}/${post.slug}/${fileName}`.replace(/\\/g, '/')
              post.body = post.body.split(assetPath).join(publicPath)
            } catch (error) {
              console.warn(`⚠️  无法复制文章 ${post.slug} 的资源 ${assetPath}:`, (error as Error).message)
            }
          }
        }
      })
    )
  },
  // 构建完成后生成搜索索引
  complete: async (data) => {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    // 构建搜索索引数据
    const searchIndex = [
      // 博客文章
      ...(data.posts || []).map((post: any) => ({
        title: post.title,
        description: post.description || '',
        date: post.date,
        slug: post.slug,
        type: 'blog' as const,
        categories: post.categories || [],
      })),
      // 项目
      ...(data.projects || []).map((project: any) => ({
        title: project.title,
        description: project.description || '',
        date: new Date().toISOString(), // 项目没有日期，使用当前日期
        slug: project.slug,
        type: 'project' as const,
        tags: project.tags || [],
      })),
    ]
    
    // 写入搜索索引文件到 public 目录
    const publicDir = path.join(process.cwd(), 'public')
    await fs.mkdir(publicDir, { recursive: true })
    await fs.writeFile(
      path.join(publicDir, 'search.json'),
      JSON.stringify(searchIndex, null, 2)
    )
    
    console.log(`✅ 已生成搜索索引，包含 ${searchIndex.length} 个条目`)
    console.log('ℹ️ 资源缓存位于 .velite/assets-cache，可在构建后按需删除')
  },
})
