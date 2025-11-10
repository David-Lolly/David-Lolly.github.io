"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { Components } from 'react-markdown'
import type { ClassAttributes, HTMLAttributes } from 'react'
import type { ExtraProps } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // 生成标题 ID（用于目录导航）
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  // 代码复制功能
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // 自定义组件映射
  const components: Components = {
    // 标题（h1-h4）- 自动生成 ID
    h1: ({ children, ...props }: ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps) => {
      const text = String(children)
      const id = generateId(text)
      return (
        <h1 id={id} className="text-4xl font-serif font-bold mt-12 mb-4 text-foreground" style={{ lineHeight: 1.2, color: '#000000' }} {...props}>
          {children}
        </h1>
      )
    },
    h2: ({ children, ...props }: ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps) => {
      const text = String(children)
      const id = generateId(text)
      return (
        <h2 id={id} className="text-3xl font-serif font-bold mt-10 mb-5 text-foreground border-b pb-3" style={{ color: '#000000', borderColor: 'rgb(var(--color-border))' }} {...props}>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }: ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps) => {
      const text = String(children)
      const id = generateId(text)
      return (
        <h3 id={id} className="text-2xl font-serif font-bold mt-8 mb-4 text-foreground" style={{ color: '#000000' }} {...props}>
          {children}
        </h3>
      )
    },
    h4: ({ children, ...props }: ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps) => {
      const text = String(children)
      const id = generateId(text)
      return (
        <h4 id={id} className="text-xl font-serif font-semibold mt-6 mb-3 text-foreground" style={{ color: '#000000' }} {...props}>
          {children}
        </h4>
      )
    },

    // 段落
    p: ({ children, ...props }: ClassAttributes<HTMLParagraphElement> & HTMLAttributes<HTMLParagraphElement> & ExtraProps) => (
      <p className="mb-6 leading-relaxed text-foreground" {...props}>
        {children}
      </p>
    ),

    // 无序列表
    ul: ({ children, ...props }: ClassAttributes<HTMLUListElement> & HTMLAttributes<HTMLUListElement> & ExtraProps) => (
      <ul className="mb-6 ml-6 space-y-2 list-disc" {...props}>
        {children}
      </ul>
    ),

    // 有序列表
    ol: ({ children, ...props }: ClassAttributes<HTMLOListElement> & HTMLAttributes<HTMLOListElement> & ExtraProps) => (
      <ol className="mb-6 ml-6 space-y-2 list-decimal" {...props}>
        {children}
      </ol>
    ),

    // 列表项
    li: ({ children, ...props }: ClassAttributes<HTMLLIElement> & HTMLAttributes<HTMLLIElement> & ExtraProps) => (
      <li className="leading-relaxed text-foreground" style={{ paddingLeft: '0.5rem' }} {...props}>
        {children}
      </li>
    ),

    // 引用
    blockquote: ({ children, ...props }: ClassAttributes<HTMLQuoteElement> & HTMLAttributes<HTMLQuoteElement> & ExtraProps) => (
      <blockquote 
        className="my-6 pl-5 italic" 
        style={{ 
          borderLeft: '4px solid rgb(var(--color-primary))',
          backgroundColor: 'rgb(var(--color-muted) / 0.5)',
          padding: '1rem 1.25rem',
          borderRadius: '0 var(--radius-button) var(--radius-button) 0',
          color: 'rgb(var(--text-secondary))'
        }} 
        {...props}
      >
        {children}
      </blockquote>
    ),

    // 行内代码
    code: ({ inline, className, children, ...props }: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps & { inline?: boolean }) => {
      const match = /language-(\w+)/.exec(className || '')
      
      
      // 处理代码字符串，移除首尾空白和统一缩进
      let codeString = String(children).trim()
      
      
      // 去除每一行的公共缩进
      const lines = codeString.split(/\r?\n/) 
      if (lines.length > 1) {
        // 找出所有非空行的最小缩进
        const indents = lines
          .filter(line => line.trim().length > 0) // 只考虑非空行
          .map(line => {
            const matchIndent = line.match(/^(\s*)/)
            return matchIndent ? matchIndent[1].length : 0
          })
        
        const minIndent = Math.min(...indents)
      
        
        // 如果存在公共缩进，则移除
        if (minIndent > 0) {
          codeString = lines
            .map(line => line.slice(minIndent))
            .join('\n')
          
   
        }
      }
    
      
      
      if (!inline && match) {
        // 代码块 - macOS 终端风格
        const language = match[1]
        
        
        return (
          <div className="relative group my-6">
            {/* macOS 风格的窗口容器 */}
            <div 
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: '#2d3748',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* macOS 窗口头部 - 灰色背景覆盖整个宽度 */}
              <div 
                className="flex items-center px-4"
                style={{
                  backgroundColor: '#3d4754',
                  paddingTop: '0.75rem',    // 可调整：头部上内边距 (默认 0.75rem = 12px)
                  paddingBottom: '0.75rem', // 可调整：头部下内边距 (默认 0.75rem = 12px)
                  width: '100%',            // 灰色背景覆盖整个宽度
                }}
              >
                {/* macOS 三个圆点按钮 */}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#ff5f57' }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#febc2e' }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#28c840' }}
                  />
                </div>
              </div>

              {/* 代码内容区域 */}
              <div className="relative" style={{ backgroundColor: '#2d3748' }}>
                {/* 复制按钮 - 放在代码块内右上角 */}
                <button
                  onClick={() => handleCopyCode(codeString)}
                  className="absolute opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded hover:bg-white/10 z-10"
                  style={{
                    top: '0.5rem',   // 可调整：复制按钮距离顶部距离 (默认 0.5rem = 8px)
                    right: '0.75rem', // 可调整：复制按钮距离右侧距离 (默认 0.75rem = 12px)
                    color: '#a0aec0',
                  }}
                  title={copiedCode === codeString ? '已复制' : '复制代码'}
                >
                  {copiedCode === codeString ? (
                    <Check size={18} style={{ color: '#28c840' }} />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>

                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={language}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    paddingTop: '0.75rem',    // 可调整：代码距离头部的距离 (默认 0.75rem = 12px)
                    paddingBottom: '1.25rem', // 可调整：代码底部内边距 (默认 1.25rem = 20px)
                    paddingLeft: '1.5rem',    // 可调整：代码左侧内边距 (默认 1.5rem = 24px)
                    paddingRight: '3.5rem',   // 可调整：代码右侧内边距，为复制按钮留空间 (默认 3.5rem = 56px)
                    fontSize: '0.875rem',
                    lineHeight: '1.7',
                    backgroundColor: '#2d3748',
                    borderRadius: 0,
                    textIndent: 0, // 确保没有文本缩进
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: '0.875rem',
                      padding: 0, // 覆盖全局 .article-content code 的 padding
                      backgroundColor: 'transparent', // 覆盖全局样式
                      borderRadius: 0, // 覆盖全局样式
                      fontWeight: 'normal', // 覆盖全局样式
                      textIndent: 0, // 确保没有文本缩进
                      display: 'block', // 确保块级显示
                    }
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        )
      }

      // 行内代码
      return (
        <code
          className="font-mono text-sm"
          style={{
            backgroundColor: 'rgb(var(--color-muted))',
            color: 'rgb(var(--text-primary))',
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
            fontWeight: 500
          }}
          {...props}
        >
          {children}
        </code>
      )
    },

    // 预格式化文本（由 code 组件处理）
    pre: ({ children }: ClassAttributes<HTMLPreElement> & HTMLAttributes<HTMLPreElement> & ExtraProps) => (
      <div>{children}</div>
    ),

    // 链接
    a: ({ children, ...props }: any) => (
      <a
        className="font-medium underline decoration-2 underline-offset-4 transition-colors"
        style={{
          color: 'rgb(var(--color-primary))',
          textDecorationColor: 'rgb(var(--color-primary) / 0.3)'
        }}
        {...props}
      >
        {children}
      </a>
    ),

    // 图片
    img: ({ ...props }: any) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        className="rounded-lg my-6 w-full" 
        style={{ boxShadow: 'var(--shadow-md)' }}
        {...props} 
      />
    ),

    // 水平线
    hr: ({ ...props }: ClassAttributes<HTMLHRElement> & HTMLAttributes<HTMLHRElement> & ExtraProps) => (
      <hr className="my-8" style={{ borderColor: 'rgb(var(--color-border))' }} {...props} />
    ),

    // 表格
    // table: ({ children, ...props }: ClassAttributes<HTMLTableElement> & HTMLAttributes<HTMLTableElement> & ExtraProps) => (
    //   <div 
    //     className="my-6 w-full rounded-xl"
    //     style={{
    //       backgroundColor: 'rgb(var(--color-card))',
    //       border: '1px solid rgb(var(--color-border) / 0.1)',
    //       overflow: 'hidden' // 确保圆角生效
    //     }}
    //   >
    //     <div className="overflow-x-auto">
    //       <table 
    //         className="w-full" 
    //         style={{ 
    //           borderCollapse: 'collapse', // 改为 collapse，消除单元格间距
    //           margin: 0,
    //           padding: 0
    //         }} 
    //         {...props}
    //       >
    //         {children}
    //       </table>
    //     </div>
    //   </div>
    // ),
    table: ({ children, ...props }: ClassAttributes<HTMLTableElement> & HTMLAttributes<HTMLTableElement> & ExtraProps) => (
      <div 
        className="my-6 w-full rounded-xl" // 保持圆角
        style={{
          backgroundColor: 'rgb(var(--color-secondary))', // 使用比页面背景稍暗的颜色
          boxShadow: 'var(--shadow-md)', // 添加阴影以“突出”
          overflow: 'hidden', // 确保圆角内的阴影和内容被正确裁剪
          border: '1px solid rgb(var(--color-border) / 1)', // 【新增】添加了半透明的边框
        }}
      >
        <div className="overflow-x-auto">
          <table 
            className="w-full" 
            style={{ 
              borderCollapse: 'collapse', 
              margin: 0,
              padding: 0
            }} 
            {...props}
          >
            {children}
          </table>
        </div>
      </div>
),

    // 表格头部
    thead: ({ children, ...props }: ClassAttributes<HTMLTableSectionElement> & HTMLAttributes<HTMLTableSectionElement> & ExtraProps) => (
      <thead 
        style={{ 
          margin: 0, 
          padding: 0,
          border: 'none'
        }} 
        {...props}
      >
        {children}
      </thead>
    ),

    // 表格主体
    tbody: ({ children, ...props }: ClassAttributes<HTMLTableSectionElement> & HTMLAttributes<HTMLTableSectionElement> & ExtraProps) => (
      <tbody 
        style={{ 
          margin: 0, 
          padding: 0,
          border: 'none'
        }} 
        {...props}
      >
        {children}
      </tbody>
    ),

    // 表格行
    tr: ({ children, ...props }: ClassAttributes<HTMLTableRowElement> & HTMLAttributes<HTMLTableRowElement> & ExtraProps) => (
      <tr 
        className="transition-colors hover:bg-muted/30"
        style={{ 
          margin: 0,
          padding: 0
        }}
        {...props}
      >
        {children}
      </tr>
    ),

    // 表头单元格
    // th: ({ children, ...props }: ClassAttributes<HTMLTableCellElement> & HTMLAttributes<HTMLTableCellElement> & ExtraProps) => (
    //   <th
    //     className="font-bold text-left px-6 py-4 text-sm"
    //     style={{
    //       // backgroundColor: 'rgb(var(--color-muted) / 0.3)',
    //       backgroundColor: 'rgb(255,0,0))',
    //       color: 'rgb(var(--text-primary))',
    //       borderBottom: '2px solid rgb(var(--color-border) / 0.2)',
    //       fontWeight: 600,
    //       margin: 0
    //     }}
    //     {...props}
    //   >
    //     {children}
    //   </th>
    // ),

    th: ({ children, ...props }: ClassAttributes<HTMLTableCellElement> & HTMLAttributes<HTMLTableCellElement> & ExtraProps) => (
      <th
        className="font-bold text-left px-6 py-4 text-sm"
        style={{
          backgroundColor: 'rgb(var(--color-muted))', // 使用比表格背景更深的颜色
          color: 'rgb(var(--foreground-rgb))', // 确保使用主文字颜色
          borderBottom: '1px solid rgb(var(--color-border),0.2)', // 使用实线边框
          fontWeight: 600,
          margin: 0
        }}
        {...props}
      >
        {children}
      </th>
),

    // 表格单元格
    // td: ({ children, ...props }: ClassAttributes<HTMLTableCellElement> & HTMLAttributes<HTMLTableCellElement> & ExtraProps) => (
    //   <td
    //     className="px-6 py-4 text-sm"
    //     style={{ 
    //       color: 'rgb(var(--text-secondary))',
    //       lineHeight: '1.6',
    //       borderBottom: '1px solid rgb(var(--color-border) / 0.1)',
    //       margin: 0
    //     }}
    //     {...props}
    //   >
    //     {children}
    //   </td>
    // ),

    td: ({ children, ...props }: ClassAttributes<HTMLTableCellElement> & HTMLAttributes<HTMLTableCellElement> & ExtraProps) => (
      <td
        className="px-6 py-4 text-sm"
        style={{ 
          color: 'rgb(var(--foreground-muted-rgb))', // 使用次要文字颜色
          lineHeight: '1.6',
          borderBottom: '1px solid rgb(var(--color-border) / 0.2)', // 调高边框透明度
          margin: 0
        }}
        {...props}
      >
        {children}
      </td>
),

    // 加粗
    strong: ({ children, ...props }: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps) => (
      <strong className="font-bold text-foreground" {...props}>
        {children}
      </strong>
    ),

    // 斜体
    em: ({ children, ...props }: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps) => (
      <em className="italic" {...props}>
        {children}
      </em>
    ),

    // 删除线
    del: ({ children }: any) => (
      <del className="line-through">
        {children}
      </del>
    ),
  }

  return (
    <div className="text-foreground" style={{ fontSize: '1.0625rem', lineHeight: 1.75 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
