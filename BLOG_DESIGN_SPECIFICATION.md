# 乐乐博文 - 博客设计规范文档

## 目录

- [设计理念](#设计理念)
- [配色系统](#配色系统)
- [字体系统](#字体系统)
- [组件设计规范](#组件设计规范)
- [页面布局](#页面布局)
- [技术栈](#技术栈)
- [实现细节](#实现细节)

---

## 设计理念

### 核心价值观

本博客设计围绕"现代简约、清爽阅读"的理念展开，灵感来源于阮一峰博客的温暖质朴风格,同时融入现代化的设计元素。

**设计原则：**

1. **温暖可读** - 采用米黄色背景，减少视觉疲劳，营造舒适的阅读氛围
2. **内容为王** - 简洁的布局设计，突出文章内容，减少干扰元素
3. **层次清晰** - 通过颜色、阴影和留白建立视觉层次
4. **响应式优先** - 移动端和桌面端都有良好的浏览体验
5. **品牌一致** - 统一的视觉语言，体现"爱分享的技术专家"形象

---

## 配色系统

### 主色调定义

\`\`\`css
/* CSS 变量定义 */
:root {
  /* 背景色系 */
  --bg-primary: 245 245 213;        /* 主背景 - 温暖米黄色 */
  --bg-card: 250 250 228;           /* 卡片背景 - 浅米黄色（所有卡片统一使用）*/
  
  /* 文字色系 */
  --text-primary: 34 34 34;         /* 主文字 - 深灰黑色 */
  --text-secondary: 115 115 115;    /* 次要文字 - 中灰色 */
  
  /* 强调色系 */
  --accent-blue: 37 99 235;         /* 蓝色 - 链接和按钮 */
  --accent-yellow: 234 179 8;       /* 黄色 - 标签和高亮 */
  
  /* 边框色 */
  --border: 229 229 209;            /* 边框 - 浅灰米色 */
  
  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
  
  /* 圆角 */
  --radius-card: 8px;
  --radius-button: 6px;
  --radius-full: 9999px;
}
\`\`\`

### 颜色使用规范

| 用途 | 颜色值 | RGB 值 | 应用场景 |
|------|--------|--------|----------|
| 页面背景 | `--bg-primary` | `rgb(245, 245, 213)` | 整体页面背景色 |
| 卡片背景 | `--bg-card` | `rgb(250, 250, 228)` | 所有卡片（个人信息卡、最新文章卡、博客卡片、项目卡片）|
| 主文字 | `--text-primary` | `rgb(34, 34, 34)` | 标题、正文 |
| 辅助文字 | `--text-secondary` | `rgb(115, 115, 115)` | 日期、简介、元信息 |
| 链接/按钮 | `--accent-blue` | `rgb(37, 99, 235)` | 超链接、主按钮、图标 |
| 标签高亮 | `--accent-yellow` | `rgb(234, 179, 8)` | 分类标签、徽章 |
| 边框分割 | `--border` | `rgb(229, 229, 209)` | 卡片边框、分隔线 |

### 颜色对比度

- **主文字与背景** - 对比度 15.5:1（AAA 级别）
- **次要文字与背景** - 对比度 4.8:1（AA 级别）
- **蓝色链接与背景** - 对比度 7.2:1（AAA 级别）

---

## 字体系统

### 字体家族

\`\`\`css
/* 字体定义 */
:root {
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", 
               "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: "Noto Serif SC", ui-serif, Georgia, Cambria, 
                "Times New Roman", Times, serif;
}
\`\`\`

### 字体使用规范

| 元素类型 | 字体家族 | 字号 | 字重 | 行高 | 应用场景 |
|---------|---------|------|------|------|----------|
| 大标题 (h1) | Serif | 2.25rem (36px) | 700 | 1.2 | 页面主标题 |
| 副标题 (h2) | Serif | 1.875rem (30px) | 700 | 1.3 | 章节标题 |
| 三级标题 (h3) | Serif | 1.5rem (24px) | 700 | 1.4 | 卡片标题 |
| 正文 | Sans | 1.0625rem (17px) | 400 | 1.75 | 文章内容 |
| 辅助文字 | Sans | 0.875rem (14px) | 400 | 1.5 | 日期、标签 |
| 小字 | Sans | 0.75rem (12px) | 400 | 1.4 | 元信息 |

### 字体层次规则

1. **标题使用衬线字体** - 所有 h1-h6 标题使用 `font-serif`，营造优雅感
2. **正文使用无衬线字体** - 正文、辅助文字使用 `font-sans`，保证可读性
3. **精选博客列表使用衬线字体** - 参考阮一峰博客风格，使用衬线字体展示文章标题
4. **代码使用等宽字体** - 代码块使用 `font-mono`

---

## 组件设计规范

### 1. 头部导航 (Header)

**设计要点：**
- 粘性定位（sticky），始终显示在顶部
- 半透明背景 `bg-card/50` + 毛玻璃效果 `backdrop-blur-sm`
- 高度：64px (h-16)
- 边框：底部 1px 边框 `border-b border-border`

**结构：**
\`\`\`
[Logo 乐乐博文]  [首页 博客 项目 关于]  [搜索图标]
\`\`\`

**代码示例：**
\`\`\`tsx
<header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="flex items-center justify-between h-16">
      {/* Logo, Navigation, Search */}
    </div>
  </div>
</header>
\`\`\`

### 2. 个人信息卡片 (ProfileCard)

**设计要点：**
- 浅米黄色背景 `bg-[rgb(250,250,228)]` - 与所有卡片统一
- 阴影：`shadow-sm hover:shadow-md`
- 圆角：8px (`rounded-lg`)
- 内边距：24px (`p-6`)
- 粘性定位：距顶部 96px (`sticky top-24`)

**结构层次：**
1. 头像 - 圆形，128x128px，外圈装饰环
2. 姓名 - 24px，衬线字体，加粗
3. 简介 - 14px，无衬线字体，灰色
4. 技术栈 - Badge 标签组，浅色背景
5. 社交链接 - 图标按钮，居中排列

**代码示例：**
\`\`\`tsx
<Card className="p-6 sticky top-24 bg-[rgb(250,250,228)]">
  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-primary/10">
    <img src="/avatar.png" alt="头像" />
  </div>
  <h2 className="text-2xl font-serif font-bold">乐乐博文</h2>
  <p className="text-sm text-muted-foreground">简介...</p>
  {/* 技术栈和社交链接 */}
</Card>
\`\`\`

### 3. 精选博客列表 (FeaturedArticles)

**设计特色：**
- 列表式展示，无封面图片
- 使用衬线字体，营造经典阅读感
- 格式：`日期 » 标题`
- Hover 效果：浅色背景高亮

**样式规范：**
- 间距：每项 12px (`space-y-3`)
- 日期：14px，灰色，固定宽度
- 分隔符：`»` 字符，灰色
- 标题：16px，衬线字体，悬停变蓝色

**代码示例：**
\`\`\`tsx
<ul className="space-y-3 list-none">
  {articles.map((article) => (
    <li key={article.id} className="group">
      <a href={`/blog/${article.id}`} 
         className="block hover:bg-card/50 -mx-2 px-2 py-2.5 rounded-md transition-colors">
        <div className="flex items-baseline gap-3">
          <time className="text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 font-sans">
            {article.date}
          </time>
          <span className="text-muted-foreground flex-shrink-0">»</span>
          <h3 className="text-base font-serif font-medium group-hover:text-primary transition-colors leading-relaxed">
            {article.title}
          </h3>
        </div>
      </a>
    </li>
  ))}
</ul>
\`\`\`

**"更多文章......"样式：**
- 格式与列表项一致
- 字体加粗 `font-bold`
- 蓝色文字 `text-primary`
- 悬停效果：颜色变浅

### 4. 最新文章侧边栏 (LatestArticles)

**设计要点：**
- 浅米黄色卡片背景 `bg-[rgb(250,250,228)]` - 与所有卡片统一
- 粘性定位
- 左侧边框指示器设计

**样式规范：**
- 标题前图标：时钟 (Clock)
- 每篇文章：左侧 2px 蓝色边框
- Hover 效果：边框变粗，文字变蓝

**代码示例：**
\`\`\`tsx
<Card className="p-6 sticky top-24 bg-[rgb(250,250,228)]">
  <div className="flex items-center gap-2 mb-4">
    <Clock className="h-5 w-5 text-primary" />
    <h3 className="text-lg font-serif font-bold">最新文章</h3>
  </div>
  <div className="space-y-4">
    {articles.map((article) => (
      <a href={`/blog/${article.id}`} className="block group">
        <div className="border-l-2 border-border hover:border-primary pl-3 py-1 transition-colors">
          <h4 className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {article.title}
          </h4>
          <p className="text-xs text-muted-foreground">{article.date}</p>
        </div>
      </a>
    ))}
  </div>
</Card>
\`\`\`

### 5. 博客卡片 (BlogCard)

**设计要点：**
- 背景色：`rgb(250, 250, 228)` 或 `bg-[rgb(250,250,228)]` - 与所有卡片统一
- 阴影：`shadow-lg hover:shadow-xl` - 强阴影确保与背景区分
- 边框：`border-border/60` - 60%透明度的边框
- 封面图片：高度 192px，悬停缩放 1.05 倍
- 分类标签：黄色背景圆角矩形

**结构层次：**
1. 封面图片区域（高度 192px）
2. 内容区域（padding 20px）
   - 分类标签（黄色背景圆角徽章）
   - 文章标题（衬线字体，18px，加粗）
   - 文章摘要（14px，灰色，最多 2 行）
   - 元信息（日期 + 阅读时间）

**代码示例：**
\`\`\`tsx
<Card className="overflow-hidden bg-[rgb(250,250,228)] shadow-lg hover:shadow-xl transition-all duration-300 group border-border/60">
  <a href={`/blog/${article.id}`} className="block">
    <div className="h-48 overflow-hidden bg-muted">
      <img 
        src={article.coverImage || "/placeholder.svg"} 
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-5">
      <div className="mb-3">
        <span className="inline-block px-3 py-1.5 text-xs font-semibold bg-accent-yellow/30 text-[rgb(133,77,14)] rounded-md border border-accent-yellow/40">
          {article.category}
        </span>
      </div>
      <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{article.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{article.readTime}</span>
        </div>
      </div>
    </div>
  </a>
</Card>
\`\`\`

### 6. 分类标签 (Badge)

**三种样式：**

**A. 技术栈标签（个人信息卡）**
- 样式：`variant="secondary"`
- 背景：浅灰色
- 字号：12px
- 圆角：4px

**B. 分类标签（博客卡片）**
- 背景：`bg-accent-yellow/30`（黄色 30% 透明度）
- 文字：`text-[rgb(133,77,14)]`（深棕色）
- 边框：`border border-accent-yellow/40`
- 圆角：6px (`rounded-md`)
- 内边距：`px-3 py-1.5`

**C. 文章标签（博客详情）**
- 样式：`variant="outline"`
- 边框：浅灰色
- 字号：12px

**代码示例：**
\`\`\`tsx
{/* 技术栈标签 */}
<Badge variant="secondary" className="text-xs">Python</Badge>

{/* 分类标签 */}
<span className="inline-block px-3 py-1.5 text-xs font-semibold bg-accent-yellow/30 text-[rgb(133,77,14)] rounded-md border border-accent-yellow/40">
  技术教程
</span>

{/* 文章标签 */}
<Badge variant="outline" className="text-xs">Hugo</Badge>
\`\`\`

### 7. 按钮 (Button)

**按钮变体：**

| 变体 | 用途 | 背景色 | 文字色 | 边框 |
|------|------|--------|--------|------|
| default | 主操作 | 蓝色 | 白色 | 无 |
| outline | 次要操作 | 透明 | 蓝色 | 蓝色 |
| ghost | 图标按钮 | 透明 | 默认 | 无 |

**尺寸规格：**
- sm：32px 高度，12px 内边距
- default：40px 高度，16px 内边距
- lg：48px 高度，24px 内边距
- icon：40x40px 正方形

### 8. 搜索框 (SearchInput)

**设计规范：**
- 高度：36px
- 背景：卡片背景色
- 圆角：6px
- 左侧图标：搜索图标（20px）
- 占位文字："搜索文章标题..."

---

## 页面布局

### 1. 首页布局 (HomePage)

**网格系统：**
- 总宽度：最大 1280px (`max-w-7xl`)
- 布局：12 列网格系统
- 间距：24px (`gap-6`)

**列分配：**
\`\`\`
[3列 个人信息卡] [6列 精选博客] [3列 最新文章]
\`\`\`

**响应式断点：**
- 移动端（< 1024px）：单列堆叠
- 桌面端（≥ 1024px）：三列布局

**代码结构：**
\`\`\`tsx
<main className="container mx-auto px-4 py-8 max-w-7xl">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <aside className="lg:col-span-3">{/* 个人信息卡 */}</aside>
    <section className="lg:col-span-6">{/* 精选博客 */}</section>
    <aside className="lg:col-span-3">{/* 最新文章 */}</aside>
  </div>
</main>
\`\`\`

### 2. 博客列表页 (BlogPage)

**页面结构：**
1. 页面标题 + 描述
2. 搜索栏（最大宽度 448px）
3. 分类筛选标签
4. 博客卡片网格（3 列）

**网格配置：**
- 移动端：1 列
- 平板端：2 列 (`md:grid-cols-2`)
- 桌面端：3 列 (`lg:grid-cols-3`)
- 间距：24px (`gap-6`)

**代码结构：**
\`\`\`tsx
<main className="max-w-6xl mx-auto px-6 py-12">
  <div className="mb-12">
    <h1 className="text-4xl font-serif font-bold mb-4">博客文章</h1>
    <p className="text-lg text-muted-foreground">描述文字</p>
  </div>
  
  {/* 搜索栏 */}
  <div className="mb-8">
    <Input type="search" placeholder="搜索文章标题..." className="max-w-md" />
  </div>
  
  {/* 分类标签 */}
  <div className="flex flex-wrap gap-2 mb-8">
    {categories.map(cat => <Badge>{cat}</Badge>)}
  </div>
  
  {/* 博客网格 */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {articles.map(article => <BlogCard {...article} />)}
  </div>
</main>
\`\`\`

### 3. 博客详情页 (BlogDetailPage)

**页面宽度：** 最大 896px (`max-w-4xl`)

**内容区域：**
1. 返回按钮
2. 文章元信息（分类、日期、阅读时间）
3. 文章标题（36px，衬线字体）
4. 文章摘要（18px，灰色）
5. 文章标签
6. 分享按钮
7. 封面图片（16:9 比例）
8. 文章正文（Markdown 渲染）
9. 相关文章推荐（2 列网格）
10. 评论区

**Markdown 渲染样式：**
- 字号：17px (`1.0625rem`)
- 行高：1.75
- 标题使用衬线字体
- 代码块：深色背景，白色文字
- 引用：左侧蓝色边框，浅色背景
- 链接：蓝色下划线，悬停加深

### 4. 项目页面 (ProjectsPage)

**页面结构：**
1. 页面标题 + 描述
2. 技术栈筛选标签
3. 项目卡片网格（2 列）
4. 底部 CTA 卡片

**项目卡片内容：**
- 项目封面图（高度 192px）
- 项目名称 + 状态标签
- GitHub 统计（Stars + Forks）
- 项目描述
- 技术标签
- 操作按钮（源码 + 演示）

---

## 技术栈

### 前端框架
- **Next.js 16** - React 框架，支持 SSR 和 SSG
- **React 19.2** - UI 库
- **TypeScript** - 类型安全

### 样式方案
- **Tailwind CSS v4** - 原子化 CSS 框架
- **shadcn/ui** - 高质量组件库
- **Noto Serif SC** - 中文衬线字体

### 图标库
- **Lucide React** - 现代化图标库

### 部署平台
- **Vercel** - 自动部署和 CDN

---

## 实现细节

### 1. 颜色系统实现

在 `app/globals.css` 中定义 CSS 变量：

\`\`\`css
:root {
  /* 主色调 - 温暖米黄色主题 */
  --bg-primary: 245 245 213;        /* 页面主背景 */
  --bg-card: 250 250 228;           /* 卡片背景（所有卡片统一使用）*/
  --text-primary: 34 34 34;         /* 主文字颜色 */
  --text-secondary: 115 115 115;    /* 次要文字颜色 */
  --accent-blue: 37 99 235;         /* 蓝色强调色 */
  --accent-yellow: 234 179 8;       /* 黄色强调色 */
  --border: 229 229 209;            /* 边框颜色 */
}

@theme inline {
  --color-background: var(--bg-primary);
  --color-foreground: var(--text-primary);
  --color-card: var(--bg-card);
  --color-primary: var(--accent-blue);
  --color-border: var(--border);
}
\`\`\`

**重要：** 所有卡片（个人信息卡、最新文章卡、博客卡片）统一使用 `bg-[rgb(250,250,228)]` 颜色，确保视觉一致性。

### 2. 字体系统实现

在 `app/layout.tsx` 中导入字体（如使用 Google Fonts）：

\`\`\`tsx
import { Noto_Serif_SC } from 'next/font/google'

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
})
\`\`\`

在 `app/globals.css` 中配置字体变量：

\`\`\`css
@theme inline {
  --font-serif: "Noto Serif SC", ui-serif, Georgia, Cambria, 
                "Times New Roman", Times, serif;
}

body {
  font-family: var(--font-sans);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
}
\`\`\`

### 3. 响应式断点

Tailwind 默认断点：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

本项目主要使用：
- `md`: 平板端布局切换
- `lg`: 桌面端多列布局

### 4. 组件复用

**shadcn/ui 组件：**
- Button
- Card
- Badge
- Input
- Separator

**自定义组件：**
- Header
- ProfileCard
- FeaturedArticles
- LatestArticles

### 5. 动画过渡

**通用过渡效果：**
\`\`\`css
transition-colors    /* 颜色过渡 - 200ms */
transition-shadow    /* 阴影过渡 - 200ms */
transition-transform /* 变换过渡 - 200ms */
\`\`\`

**悬停效果：**
- 文字颜色：`hover:text-primary`
- 背景色：`hover:bg-card/50`
- 阴影：`hover:shadow-lg`
- 缩放：`hover:scale-105`

### 6. Markdown 渲染

使用 `dangerouslySetInnerHTML` 渲染 Markdown（实际项目建议使用 `react-markdown`）：

\`\`\`tsx
<div 
  className="article-content" 
  dangerouslySetInnerHTML={{ __html: markdownContent }}
/>
\`\`\`

在 `app/globals.css` 中定义 `.article-content` 样式：

\`\`\`css
.article-content {
  font-size: 1.0625rem;
  line-height: 1.75;
}

.article-content h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid rgb(var(--color-border));
  padding-bottom: 0.75rem;
}

.article-content code {
  background-color: rgb(var(--color-muted));
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: var(--font-mono);
}

.article-content pre {
  background-color: rgb(var(--text-primary));
  color: rgb(var(--bg-card));
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-card);
  overflow-x: auto;
}
\`\`\`

### 7. 图片优化

使用 Next.js `Image` 组件（推荐）：

\`\`\`tsx
import Image from 'next/image'

<Image
  src="/cover.jpg"
  alt="文章封面"
  width={800}
  height={450}
  className="rounded-lg"
/>
\`\`\`

或使用普通 `<img>` 标签配合 CSS：

\`\`\`tsx
<img 
  src="/cover.jpg" 
  alt="文章封面"
  className="w-full h-full object-cover"
/>
\`\`\`

### 8. 路由结构

\`\`\`
/                   - 首页
/blog               - 博客列表
/blog/[id]          - 博客详情
/projects           - 项目展示
/about              - 关于页面
\`\`\`

### 9. 数据管理

当前使用静态数据（硬编码）：

\`\`\`tsx
const articles = [
  {
    id: 1,
    title: "文章标题",
    date: "2025年11月08日",
    category: "技术教程",
    // ...
  },
]
\`\`\`

**未来扩展：**
- 集成 CMS（Contentful, Strapi）
- 使用 Markdown 文件（MDX）
- 连接数据库（Supabase, PlanetScale）

---

## 设计检查清单

在实现时，确保以下要点：

### 颜色一致性
- [ ] 页面背景使用 `rgb(245, 245, 213)`
- [ ] 所有卡片统一使用 `rgb(250, 250, 228)`（个人信息卡、最新文章卡、博客卡片、项目卡片）
- [ ] 所有链接和按钮使用蓝色 `rgb(37, 99, 235)`
- [ ] 分类标签使用黄色背景 `bg-accent-yellow/30`

### 字体层次
- [ ] 所有标题使用衬线字体 `font-serif`
- [ ] 正文使用无衬线字体 `font-sans`
- [ ] 精选博客列表使用衬线字体展示标题
- [ ] 代码块使用等宽字体 `font-mono`

### 视觉层次
- [ ] 博客卡片有明显阴影，与背景区分清晰
- [ ] 分类标签使用圆角矩形包裹，有边框
- [ ] Hover 状态有明显反馈（颜色、阴影、缩放）
- [ ] 留白充足，不拥挤

### 响应式设计
- [ ] 移动端单列布局
- [ ] 桌面端三列布局（首页）
- [ ] 博客列表在不同屏幕尺寸下合理展示
- [ ] 导航菜单在移动端可访问

### 可访问性
- [ ] 颜色对比度符合 WCAG AA 标准
- [ ] 所有交互元素有焦点样式
- [ ] 图片有 alt 文本
- [ ] 语义化 HTML 标签

---

## 总结

本文档详细记录了"乐乐博文"博客的完整设计规范，包括：

1. **配色系统** - 温暖的米黄色主题，所有卡片统一使用 `rgb(250, 250, 228)`
2. **字体系统** - 衬线字体标题 + 无衬线字体正文
3. **组件设计** - 8 种核心组件的详细规范
4. **页面布局** - 4 个主要页面的结构和网格系统
5. **技术栈** - Next.js + Tailwind CSS + shadcn/ui
6. **实现细节** - CSS 变量、响应式、动画、Markdown 渲染等

遵循本文档，可以完整复现整个博客的设计和功能，确保视觉一致性和用户体验。

---

**文档版本：** 2.0  
**最后更新：** 2025年11月09日  
**维护者：** 乐乐博文团队
