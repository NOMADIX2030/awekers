import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 🚫 React StrictMode 비활성화 (중복 쿼리 방지)
  reactStrictMode: false,
  
  // ⚡ 성능 최적화 설정
  experimental: {
    optimizePackageImports: ['@upstash/redis'],
  },
  
  // 🛠️ 서버 외부 패키지 설정 (Prisma 클라이언트)
  serverExternalPackages: ['@prisma/client'],
  
  // 🚫 백업 파일 제외
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 🚫 백업 폴더 제외
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 개발 환경에서 클라이언트 사이드 최적화
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // 백업 폴더 제외
    config.module.rules.push({
      test: /\.(tsx|ts|jsx|js)$/,
      exclude: /backups/,
    });
    
    return config;
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
