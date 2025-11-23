"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyMarkdownButtonProps {
  content: string
  className?: string
}

export function CopyMarkdownButton({
  content,
  className,
}: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success("已复制 Markdown 原文")
      setTimeout(() => setCopied(false), 1000)
    } catch (error) {
      toast.error("复制失败，请重试")
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "gap-2 bg-transparent  text-[rgb(110,70,10)] transition-all duration-200 cursor-pointer hover:bg-[rgb(252,248,232)] hover:text-[rgb(80,50,15)]  hover:shadow-md focus-visible:ring-2 focus-visible:ring-[rgb(210,180,120)] focus-visible:ring-offset-2 focus-visible:bg-[rgb(252,248,232)] active:scale-[0.98]",
        className
      )}
      onClick={handleCopyContent}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          已复制
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          复制全文
        </>
      )}
    </Button>
  )
}


