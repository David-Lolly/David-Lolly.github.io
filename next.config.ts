import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // GitHub Pages 不支持 Next 的默认图片优化，启用静态模式
    unoptimized: true,
  },
  // 添加空的 turbopack 配置以明确启用 Turbopack
  turbopack: {},
}

export default nextConfig
