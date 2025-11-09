"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Searching for:", searchQuery)
    // Search functionality will be implemented here
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-2xl font-serif font-bold text-primary hover:text-primary/80 transition-colors">
            乐乐博客空间
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-base font-serif font-bold">
            <a href="/" className="text-foreground hover:text-primary transition-colors font-serif font-bold">
              首页
            </a>
            <a href="/blog" className="text-muted-foreground hover:text-primary transition-colors font-serif">
              博客
            </a>
            <a href="/projects" className="text-muted-foreground hover:text-primary transition-colors font-serif">
              项目
            </a>
            <a href="/about" className="text-muted-foreground hover:text-primary transition-colors font-serif">
              关于
            </a>
          </nav>

          {/* Search */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 h-9 bg-background"
                  autoFocus
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>
                  取消
                </Button>
              </form>
            ) : (
              <Button className="font-extralight shadow" variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="搜索">
                <Search className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
