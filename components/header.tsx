"use client"

import { Menu, Moon, Search, Sun, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

const SearchDialog = dynamic(
  () => import("@/components/search-dialog").then((module) => module.SearchDialog),
  { ssr: false }
)

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { href: "/", label: "首页" },
    { href: "/blog", label: "博客" },
    { href: "/projects", label: "项目" },
    { href: "/thought", label: "游思" },
    { href: "/about", label: "关于" },
  ]

  return (
    <>
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="min-w-0 truncate pr-2 text-xl sm:text-2xl font-serif font-semibold text-primary hover:text-primary/80 transition-colors">
              乐乐の博客空间
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-base font-serif font-bold">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`hover:text-primary transition-colors font-serif pb-1 ${isActive(item.href)
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground"
                    }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Search */}
            <div className="flex items-center gap-2">
              <Button
                className="h-11 w-11 md:h-9 md:w-9 font-extralight shadow hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="切换主题"
              >
                <Sun className="h-5 w-5 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
              </Button>
              <Button
                className="h-11 w-11 md:h-9 md:w-9 font-extralight shadow hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="搜索"
              >
                <Search className="w-5 h-5 text-foreground" />
              </Button>
              <Button
                className="h-11 w-11 font-extralight shadow hover:bg-black/5 dark:hover:bg-white/10 transition-colors md:hidden"
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? "关闭导航菜单" : "打开导航菜单"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav
              id="mobile-navigation"
              className="grid grid-cols-2 gap-2 border-t border-border py-3 md:hidden"
              aria-label="移动端导航"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-md px-4 font-serif font-semibold transition-colors ${isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                    }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Search Dialog */}
      {searchOpen && <SearchDialog open onOpenChange={setSearchOpen} />}
    </>
  )
}
