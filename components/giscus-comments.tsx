"use client"

import { useTheme } from "next-themes"
import Giscus from "@giscus/react"

export function GiscusComments() {
  const { theme, resolvedTheme } = useTheme()
  
  const giscusTheme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <div className="mt-8">
      <Giscus
        repo="David-Lolly/BlogDiscussion"
        repoId="R_kgDOQbJoDQ"
        category="Announcements"
        categoryId="DIC_kwDOQbJoDc4CyGRd"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={giscusTheme}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}

