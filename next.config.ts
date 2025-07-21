import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 🚫 React StrictMode 비활성화 (중복 쿼리 방지)
  reactStrictMode: false,
  
  // ⚡ 성능 최적화 설정
  experimental: {
    optimizePackageImports: ['@prisma/client', '@upstash/redis'],
  },
  
  // 🎯 Redis 캐시 최적화를 위한 헤더 설정
  async headers() {
    return [
      {
        source: '/api/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
