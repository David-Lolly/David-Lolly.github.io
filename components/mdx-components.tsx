"use client"

import * as React from "react"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import { Copy, Check } from 'lucide-react'

type ElementWithChildren = React.ReactElement<{ children?: React.ReactNode }>

const CodeBlockContext = React.createContext(false)

// 约 20 行的可视高度（0.875rem 字号、1.7 行高）
const CODE_BLOCK_MAX_HEIGHT = '30rem'

const toPlainText = (children: React.ReactNode): string => {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child
      if (typeof child === "number") return child.toString()
      if (React.isValidElement(child)) {
        const element = child as ElementWithChildren
        if (element.props?.children) {
          return toPlainText(element.props.children)
        }
      }
      return ""
    })
    .join(" ")
}

const generateId = (children: React.ReactNode): string => {
  return toPlainText(children)
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

const components = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = generateId(children)
    return (
      <h1 id={id} className="text-4xl font-serif font-bold mt-12 mb-4 text-foreground" style={{ lineHeight: 1.2, color: '#000000' }} {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = generateId(children)
    return (
      <h2 id={id} className="text-3xl font-serif font-bold mt-10 mb-5 text-foreground border-b pb-3" style={{ color: '#000000', borderColor: 'rgb(var(--color-border))' }} {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = generateId(children)
    return (
      <h3 id={id} className="text-2xl font-serif font-bold mt-8 mb-4 text-foreground" style={{ color: '#000000' }} {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = generateId(children)
    return (
      <h4 id={id} className="text-xl font-serif font-semibold mt-6 mb-3 text-foreground" style={{ color: '#000000' }} {...props}>
        {children}
      </h4>
    )
  },
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-6 leading-relaxed text-foreground" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => {
    const childrenArray = React.Children.toArray(children)
    return (
      <ul className="mb-6 ml-6 space-y-2 list-disc" {...props}>
        {childrenArray.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { key: index } as any)
          }
          return child
        })}
      </ul>
    )
  },
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => {
    const childrenArray = React.Children.toArray(children)
    return (
      <ol className="mb-6 ml-6 space-y-2 list-decimal" {...props}>
        {childrenArray.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { key: index } as any)
          }
          return child
        })}
      </ol>
    )
  },
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed text-foreground marker:text-black" style={{ paddingLeft: '0.5rem' }} {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
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
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isCodeBlock = React.useContext(CodeBlockContext)
    const { style: inlineStyles, ...restProps } = props

    if (isCodeBlock) {
      return (
        <code
          className="font-mono text-sm"
          style={{
            ...(inlineStyles || {}),
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '0.875rem',
            backgroundColor: 'transparent',
            borderRadius: 0,
            fontWeight: 'normal',
            textIndent: 0,
            // display: 'inline-block',
            display: 'block',
            whiteSpace: 'pre',
            minWidth: 'fit-content',
            overflowWrap: 'normal',
          }}
          {...restProps}
        >
          {children}
        </code>
      )
    }

    // 行内代码（保留你的定制外观）
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
        {...restProps}
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    const [copied, setCopied] = React.useState(false)
    const preRef = React.useRef<HTMLPreElement>(null)
    
    const handleCopy = () => {
      if (preRef.current) {
        // 获取 pre 标签内的纯文本内容
        const textContent = preRef.current.textContent || ''
        navigator.clipboard.writeText(textContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }

    return (
      <div className="relative group my-6">
        {/* macOS 风格的窗口容器 */}
        <div 
          className="rounded-xl"
          style={{
            backgroundColor: '#2d3748',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'visible',
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
              borderTopLeftRadius: '0.75rem',
              borderTopRightRadius: '0.75rem',
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

          {/* 代码内容区域的包装容器 */}
          <div className="relative" style={{ 
            backgroundColor: '#2d3748',
            borderBottomLeftRadius: '0.75rem',
            borderBottomRightRadius: '0.75rem',
          }}>
            {/* 复制按钮 - 固定在可视区域右上角，不随滚动移动 */}
            <button
              onClick={handleCopy}
              className="absolute opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded hover:bg-white/10 z-10"
              style={{
                top: '0.5rem',
                right: '0.75rem',
                color: '#a0aec0',
              }}
              title={copied ? '已复制' : '复制代码'}
            >
              {copied ? (
                <Check size={18} style={{ color: '#28c840' }} />
              ) : (
                <Copy size={18} />
              )}
            </button>

            {/* 可滚动的代码内容 */}
            <div 
              className="code-scroll" 
              style={{ 
                overflow: 'auto',
                maxHeight: CODE_BLOCK_MAX_HEIGHT,
                scrollbarGutter: 'stable',
                borderBottomLeftRadius: '0.75rem',
                borderBottomRightRadius: '0.75rem',
              }}
            >
              <CodeBlockContext.Provider value={true}>
                <pre 
                  ref={preRef}
                  className="font-mono text-sm"
                  style={{
                    margin: 0,
                    paddingTop: '0.75rem',    // 可调整：代码距离头部的距离 (默认 0.75rem = 12px)
                    paddingBottom: '1.25rem', // 可调整：代码底部内边距 (默认 1.25rem = 20px)
                    paddingLeft: '1.5rem',    // 可调整：代码左侧内边距 (默认 1.5rem = 24px)
                    paddingRight: '3.5rem',   // 可调整：代码右侧内边距，为复制按钮留空间 (默认 3.5rem = 56px)
                    backgroundColor: '#2d3748',
                    fontSize: '0.875rem',
                    lineHeight: '1.7',
                    borderRadius: 0,
                    textIndent: 0,
                  }}
                  {...props}
                >
                  {children}
                </pre>
              </CodeBlockContext.Provider>
            </div>
          </div>
        </div>
      </div>
    )
  },
  a: ({
    children,
    href = "",
    rel,
    target,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const staysInPage = href.startsWith("#")
    const finalTarget = staysInPage ? target : target ?? "_blank"
    const finalRel = staysInPage ? rel : rel ?? "noopener noreferrer"

    return (
      <a
        href={href}
        target={finalTarget}
        rel={finalRel}
        className="font-medium underline decoration-2 underline-offset-4 transition-colors"
        style={{
          color: 'rgb(var(--color-primary))',
          textDecorationColor: 'rgb(var(--color-primary) / 0.3)'
        }}
        {...props}
      >
        {children}
      </a>
    )
  },
  img: ({ alt, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      alt={alt} 
      src={src} 
      className="rounded-lg my-6 w-full" 
      style={{ boxShadow: 'var(--shadow-md)' }}
      {...props} 
    />
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8" style={{ borderColor: 'rgb(var(--color-border))' }} {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => {
    const childrenArray = React.Children.toArray(children)
    return (
      <div 
        className="my-6 w-full rounded-xl"
        style={{
          backgroundColor: 'rgb(var(--color-secondary))',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
          border: '1px solid rgb(var(--color-border) / 1)',
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
            {childrenArray.map((child, index) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { key: index } as any)
              }
              return child
            })}
          </table>
        </div>
      </div>
    )
  },
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
    const childrenArray = React.Children.toArray(children)
    return (
      <thead {...props}>
        {childrenArray.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { key: index } as any)
          }
          return child
        })}
      </thead>
    )
  },
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
    const childrenArray = React.Children.toArray(children)
    return (
      <tbody {...props}>
        {childrenArray.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { key: index } as any)
          }
          return child
        })}
      </tbody>
    )
  },
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
    const childrenArray = React.Children.toArray(children)
    return (
      <tr 
        className="m-0 p-0 transition-colors hover:bg-muted/50"
        style={{ borderBottom: '1px solid rgb(var(--color-border) / 0.1)' }}
        {...props}
      >
        {childrenArray.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { key: index } as any)
          }
          return child
        })}
      </tr>
    )
  },
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="font-bold text-left px-6 py-4 text-sm"
      style={{
        backgroundColor: 'rgb(var(--color-muted))',
        color: 'rgb(var(--foreground-rgb))',
        borderBottom: '1px solid rgb(var(--color-border),0.2)',
        fontWeight: 600,
        margin: 0
      }}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-6 py-4 text-sm"
      style={{ 
        color: 'rgb(var(--foreground-muted-rgb))',
        lineHeight: '1.6',
        borderBottom: '1px solid rgb(var(--color-border) / 0.2)',
        margin: 0
      }}
      {...props}
    >
      {children}
    </td>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  del: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <del className="line-through" {...props}>
      {children}
    </del>
  ),
  kbd: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <kbd 
      className="font-mono text-sm px-2 py-1 rounded"
      style={{
        backgroundColor: 'rgb(var(--color-muted))',
        border: '1px solid rgb(var(--color-border))',
        boxShadow: '0 1px 0 rgb(var(--color-border))'
      }}
      {...props}
    >
      {children}
    </kbd>
  ),
}

export function MDXContent({ code }: { code: string }) {
  const Component = React.useMemo(() => {
    try {
      // velite 生成的代码格式:
      // const{Fragment,jsx,jsxs}=arguments[0];
      // function _createMdxContent(r){...}
      // return{default:function(n={}){...}}
      
      // 创建一个包装函数来执行 MDX 代码
      const fn = new Function(`
        const {Fragment, jsx, jsxs} = arguments[0];
        ${code}
        return { default: _createMdxContent };
      `)
      
      const result = fn({
        Fragment,
        jsx,
        jsxs,
      })
      
      return result.default
    } catch (error) {
      console.error('MDX 渲染错误:', error)
      return null
    }
  }, [code])

  if (!Component) {
    return <div className="text-muted-foreground">内容加载失败</div>
  }

  return (
    <div className="text-foreground" style={{ fontSize: '1.0625rem', lineHeight: 1.75 }}>
      <Component components={components} />
    </div>
  )
}

export default components
