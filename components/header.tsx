"use client"

import { Moon, Search, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { SearchDialog } from "@/components/search-dialog"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // 判断当前激活的导航项
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  // 键盘快捷键支持 (Ctrl+K 或 Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="text-2xl font-serif font-bold text-primary hover:text-primary/80 transition-colors">
              乐乐の博客空间
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-base font-serif font-bold">
              <a
                href="/"
                className={`text-foreground hover:text-primary transition-colors font-serif font-bold pb-1 ${isActive("/") ? "border-b-2 border-primary" : ""
                  }`}
              >
                首页
              </a>
              <a
                href="/blog"
                className={`text-muted-foreground hover:text-primary transition-colors font-serif pb-1 ${isActive("/blog") ? "border-b-2 border-primary" : ""
                  }`}
              >
                博客
              </a>
              <a
                href="/projects"
                className={`text-muted-foreground hover:text-primary transition-colors font-serif pb-1 ${isActive("/projects") ? "border-b-2 border-primary" : ""
                  }`}
              >
                项目
              </a>
              <a
                href="/thought"
                className={`text-muted-foreground hover:text-primary transition-colors font-serif pb-1 ${isActive("/thought") ? "border-b-2 border-primary" : ""
                  }`}
              >
                游思
              </a>
              <a
                href="/about"
                className={`text-muted-foreground hover:text-primary transition-colors font-serif pb-1 ${isActive("/about") ? "border-b-2 border-primary" : ""
                  }`}
              >
                关于
              </a>
            </nav>

            {/* Search */}
            <div className="flex items-center gap-2">
              <Button
                className="font-extralight shadow hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="切换主题"
              >
                <Sun className="h-5 w-5 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
              </Button>
              <Button
                className="font-extralight shadow hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="搜索"
              >
                <Search className="w-5 h-5 text-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
