import * as React from "react"

const components = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-serif font-bold mt-12 mb-4 text-foreground" style={{ lineHeight: 1.2, color: '#000000' }} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-serif font-bold mt-10 mb-5 text-foreground border-b pb-3" style={{ color: '#000000', borderColor: 'rgb(var(--color-border))' }} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-serif font-bold mt-8 mb-4 text-foreground" style={{ color: '#000000' }} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-xl font-serif font-semibold mt-6 mb-3 text-foreground" style={{ color: '#000000' }} {...props}>
      {children}
    </h4>
  ),
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
    <li className="leading-relaxed text-foreground" style={{ paddingLeft: '0.5rem' }} {...props}>
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
    // 更可靠地检测代码块：rehype-pretty-code 会添加 data-language / data-theme
    const isCodeBlock = (props as any)["data-language"] || (props as any)["data-theme"]

    if (isCodeBlock) {
      // 代码块内的 <code>：交给 rehype-pretty-code 的内联样式与主题处理，不再自定义颜色
      return (
        <code
          className="font-mono text-sm bg-transparent p-0"
          {...props}
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
        {...props}
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
      <div className="relative group">
        <pre 
          ref={preRef}
          className="font-mono text-sm mb-6 overflow-x-auto relative"
          {...props}
        >
          {children}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
    )
  },
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
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
        className="my-6 w-full overflow-hidden rounded-xl"
        style={{
          backgroundColor: 'rgb(var(--color-card))',
          border: '1px solid rgb(var(--color-border) / 0.1)'
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }} {...props}>
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
        className="m-0 p-0 transition-colors hover:bg-muted/30"
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
        backgroundColor: 'rgb(var(--color-muted) / 0.3)',
        color: 'rgb(var(--text-primary))',
        borderBottom: '2px solid rgb(var(--color-border) / 0.2)',
        fontWeight: 600
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
        color: 'rgb(var(--text-secondary))',
        lineHeight: '1.6'
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
        Fragment: React.Fragment,
        jsx: React.createElement,
        jsxs: React.createElement,
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
