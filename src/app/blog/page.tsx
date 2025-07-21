import prisma from "@/lib/prisma";
import { Metadata } from "next";
import BlogPageList from "../components/BlogPageList";
import awekers from "@/lib/logger";

// 🎯 동적 도메인 감지 함수
function getCurrentDomain(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.NODE_ENV === 'production') {
    return 'https://awekers.vercel.app';
  }
  
  return 'http://localhost:3000';
}

// SEO 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  const perf = awekers.performance.start('blogPageMetadata');
  
  const currentDomain = getCurrentDomain();
  const metadataBase = new URL(currentDomain);
  
  try {
    const blogCount = await prisma.blog.count();
    const recentBlogs = await prisma.blog.findMany({
      select: { tag: true },
      take: 10,
      orderBy: { date: 'desc' }
    });
    
    const allTags = recentBlogs
      .flatMap(blog => blog.tag?.split(',').map(t => t.trim()) || [])
      .filter(Boolean);
    
    const uniqueTags = [...new Set(allTags)].slice(0, 20);
    
    awekers.seo.metadataGeneration('blog', {
      blogCount,
      tagCount: uniqueTags.length,
      domain: currentDomain
    });
    
    perf.end({ blogCount, tagCount: uniqueTags.length });
    
    return {
      metadataBase,
      title: `블로그 - AWEKERS (${blogCount}개 포스트)`,
      description: `AWEKERS 블로그에서 ${blogCount}개의 최신 포스트를 확인하세요. ${uniqueTags.slice(0, 5).join(', ')} 등 다양한 주제를 다룹니다.`,
      keywords: `블로그, AWEKERS, ${uniqueTags.join(', ')}, SEO, 웹개발, 마케팅`,
      openGraph: {
        title: `AWEKERS 블로그 - ${blogCount}개 포스트`,
        description: `최신 ${blogCount}개 포스트와 ${uniqueTags.slice(0, 3).join(', ')} 등의 주제를 확인하세요.`,
        url: `${currentDomain}/blog`,
        siteName: 'AWEKERS',
        type: 'website',
        images: [
          {
            url: '/next.svg',
            width: 1200,
            height: 630,
            alt: 'AWEKERS 블로그',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `AWEKERS 블로그 - ${blogCount}개 포스트`,
        description: `${uniqueTags.slice(0, 3).join(', ')} 등 다양한 주제의 ${blogCount}개 포스트`,
        images: ['/next.svg'],
      },
      alternates: {
        canonical: `${currentDomain}/blog`,
      },
    };
  } catch (error) {
    awekers.error('블로그 메타데이터 생성 실패', { error });
    perf.end({ error: true });
    
    return {
      metadataBase,
      title: "블로그 - AWEKERS",
      description: "AWEKERS 블로그에서 최신 포스트를 확인하세요.",
      keywords: "블로그, AWEKERS, SEO, 웹개발",
    };
  }
}

// 정적 생성 최적화
export const revalidate = 300; // 5분마다 재생성
export const dynamic = 'force-static';

export default async function BlogPage() {
  const perf = awekers.performance.start('blogPage');
  
  try {
    // 🎯 블로그 데이터 가져오기
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        tag: true,
        image: true,
        date: true,
        view: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 20, // 20개 포스트
    });

    awekers.info('블로그 페이지 로드 완료', {
      blogCount: blogs.length
    });
    
    perf.end({ 
      blogCount: blogs.length
    });

    return (
      <div className="w-full max-w-4xl mx-auto py-10">
        <BlogPageList 
          siteName="AWEKERS 블로그"
          blogs={blogs}
        />
      </div>
    );

  } catch (error) {
    awekers.error('블로그 페이지 로딩 실패', { error });
    perf.end({ error: true });
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            블로그를 불러올 수 없습니다
          </h1>
          <p className="text-gray-600 mb-8">
            잠시 후 다시 시도해주세요.
          </p>
          <a 
            href="/" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }
} 