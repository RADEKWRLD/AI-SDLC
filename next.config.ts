import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // 把 /presentation 路由指向 public/presentation.html 静态幻灯片
      { source: "/presentation", destination: "/presentation.html" },
    ];
  },
};

export default nextConfig;
