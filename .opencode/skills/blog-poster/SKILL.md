---
name: blog-poster
description: 发布博客或项目到个人博客网站。当用户给你一个 Markdown 文档（无 frontmatter 元信息），让你帮忙整理发布成博客或项目时使用此 Skill。
---

# 博客/项目发布助手

## 你的任务

用户会给你一篇没有 frontmatter 元信息的纯 Markdown 文档，告诉你这是「博客」还是「项目」。你需要：

1. 根据文档内容生成合适的元数据
2. 创建正确的目录结构和文件
3. 启动本地预览
4. 用户确认后推送到 GitHub

## 项目信息

### 目录结构

```
content/
├── blog/           # 博客文章目录
│   └── {slug}/
│       ├── index.mdx
│       └── images/
└── projects/       # 项目目录
    └── {slug}/
        ├── index.mdx
        └── images/
```

### Velite 元数据字段

**博客 (Blog) 必需字段：**
```yaml
---
title: 文章标题
slug: url-slug   # 英文短横线分隔
date: 2026-03-15
image: ./images/cover.jpg
description: 一句话描述
categories: [分类1, 分类2]
featured: false
---
```

**项目 (Project) 必需字段：**
```yaml
---
title: 项目标题
slug: project-slug
date: 2026-03-15
status: 进行中  # 或 "已完成"
image: ./images/cover.png
description: 项目简介
tags: [技术栈1, 技术栈2]
github_url: https://github.com/xxx/xxx
demo_url: https://xxx.com
stars: 0
forks: 0
---
```

## 工作流程

### 步骤 1: 确定类型和生成元数据

1. 询问用户这是「博客」还是「项目」
2. 阅读用户提供的 Markdown 内容
3. 根据内容生成合适的元数据：
   - **slug**: 从标题提取英文关键词，用短横线连接
   - **title**: 整理成合适的标题
   - **description**: 生成 100 字以内的简介
   - **categories/tags**: 根据内容提取分类或标签
   - **date**: 使用今天的日期 (2026-03-15)
   - **status**: 项目专有，询问用户或默认"进行中"
   - **image**: 暂时设为占位符 `./images/cover.jpg`，后续可调整
   - **featured**: 博客专有，默认 false

### 步骤 2: 创建文件

1. 在 `content/blog/{slug}/` 或 `content/projects/{slug}/` 创建目录
2. 创建 `index.mdx` 文件，包含 frontmatter + 正文
3. 创建 `images/` 子目录（如果需要图片）

**注意：**
- 文件名必须是 `index.mdx`（不是 .md）
- frontmatter 使用 YAML 格式，用 `---` 包裹
- 正文内容保持用户提供的 Markdown 格式
- 如果用户提供了图片，询问图片存放位置，或暂时跳过

### 步骤 3: 敏感信息检查

**⚠️ 必须在本地预览之前进行敏感信息检查！**

在创建文件后，检查正文中是否包含敏感信息（如真实路径、密码、密钥等），如有需要替换为占位符：
- 真实路径：`/root/xxx/xxx/` → `/host/path/xxx/`
- 密码/密钥：替换为 `***` 或 `your-secret`
- **必须获得用户确认敏感信息已处理后再继续**

### 步骤 4: 展示元数据确认

完成文件创建和敏感信息检查后，向用户展示生成的元数据：

```
📝 博客元数据:
- title: xxx
- slug: xxx
- date: xxx
- description: xxx
- categories: xxx
```

**⚠️ 必须等待用户确认后再继续。** 用户说可以继续，或者用户说修改某些元数据，修改后再等待用户确认。

### 步骤 5: 等待用户提供封面图片

**⚠️ 在进行本地预览之前，必须等待用户提供封面图片！**

1. **主动询问用户**："请提供封面图片路径，或者告诉我稍后处理"
2. 如果用户提供图片路径，将图片复制到 `content/blog/{slug}/images/cover.jpg`（或 cover.png）
3. 如果用户说没有封面或稍后处理，暂时跳过，使用占位符
4. **必须获得用户明确确认封面已处理后再进行本地预览**

**注意：没有封面图片会导致预览时 404 错误，所以必须先处理封面再进行预览！**

### 步骤 6: 本地预览

1. 运行 `npm run dev` 启动开发服务器
2. 告知用户访问 http://localhost:3000 预览效果
3. **⚠️ 必须等待用户亲自查看页面，确认显示正常后再继续**
4. 如果用户发现有问题，先解决问题，再等待用户确认

### 步骤 7: Build 验证

1. 停止 dev 服务器
2. 运行 `npm run build` 构建生产版本
3. 确保构建成功，无报错
4. **静态导出预览**: 如果用户想预览构建后的静态文件，使用 `npx serve out` 启动静态服务器（因为项目使用 `output: export` 配置，`next start` 不可用）
   - 访问 http://localhost:3000 查看静态导出后的效果
   - 注意：静态导出模式下，页面不会自动刷新，需要重新构建才能看到修改

### 步骤 8: GitHub 推送

**⚠️ 绝对禁止自动推送！必须获得用户明确确认后才可以执行。**

只有在用户明确说"确认推送"、"可以推送"或"发布"等明确表示同意后：

1. 运行 `git status` 查看变更
2. 运行 `git diff` 确认变更内容
3. 检查是否有额外被追踪的文件，告知用户由用户决定如何处理
4. 添加文件: `git add content/blog/{slug}/` 或 `git add content/projects/{slug}/`
5. 提交: `git commit -m "feat: 添加《{标题}》博客/项目"`
6. 推送: `git push`

GitHub Actions 会自动构建部署。

## 注意事项

- 用户提供的文档是纯 Markdown，没有任何 frontmatter
- 不要修改用户正文内容，只添加元数据
- 如果需要图片，先跳过，后续单独处理
- **⚠️ 严禁自动执行整个流程，每一步必须等待用户明确确认后才能继续**
- **⚠️ 敏感信息检查必须在本地预览之前完成**
- **⚠️ 封面图片必须在本地预览之前提供**
- **⚠️ 推送前必须获得用户的明确确认，绝对禁止自动推送**
- 本地预览命令: `npm run dev`
- **代码块语言类型**：Markdown 中的代码块如果没有指定语言类型，默认使用 `c`，以获得更好的渲染效果
- **敏感信息检查**：发布前检查并替换真实路径、密码等敏感信息
- **build 验证**：确保 dev 和 build 都能正常运行
