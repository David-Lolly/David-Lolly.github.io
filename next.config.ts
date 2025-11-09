import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 添加空的 turbopack 配置以明确启用 Turbopack
  turbopack: {},
}

export default nextConfig
