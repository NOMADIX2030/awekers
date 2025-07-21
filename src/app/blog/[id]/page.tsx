import React from "react";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";
import awekers from "@/lib/logger";

// 🎯 동적 도메인 감지 함수 - 메인 페이지와 동일
function getCurrentDomain(): string {
  // 1순위: 환경변수 설정값
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // 2순위: Vercel 자동 제공 환경변수
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // 3순위: 환경에 따른 기본값
  if (process.env.NODE_ENV === 'production') {
    return 'https://awekers.vercel.app';
  }
  
  // 개발환경 기본값
  return 'http://localhost:3000';
}

// SEO 메타데이터 동적 생성 - 경고 완전 해결
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  // 🎯 성능 모니터링 시작
  const perf = awekers.performance.start('blogMetadataGeneration');
  
  const { id } = await params;
  const blogId = parseInt(id);
  
  // 🎯 동적 도메인 감지
  const currentDomain = getCurrentDomain();
  const metadataBase = new URL(currentDomain);
  
  if (isNaN(blogId)) {
    awekers.warn('잘못된 블로그 ID', { id, blogId });
    perf.end({ error: 'invalid_id' });
    
    return {
      metadataBase,
      title: "블로그를 찾을 수 없습니다 - AWEKERS",
      description: "요청하신 블로그를 찾을 수 없습니다.",
      robots: { index: false, follow: false },
    };
  }

  try {
    // 🚀 중복 쿼리 방지: 메타데이터용 최소 데이터만 조회
    const blog = await prisma.blog.findUnique({
      select: {
        title: true,
        summary: true,
        tag: true,
        image: true,
        date: true,
      },
      where: { id: blogId },
    });

    if (!blog) {
      awekers.warn('존재하지 않는 블로그 ID', { blogId });
      perf.end({ error: 'not_found' });
      
      return {
        metadataBase,
        title: "블로그를 찾을 수 없습니다 - AWEKERS",
        description: "요청하신 블로그를 찾을 수 없습니다.",
        robots: { index: false, follow: false },
      };
    }

    const blogUrl = `${currentDomain}/blog/${blogId}`;
    const ogImage = blog.image || "/next.svg";

    // 🔍 SEO 블로그 메타데이터 생성 로그
    awekers.seo.metadataGeneration(`blog/${blogId}`, {
      title: blog.title,
      domain: currentDomain,
      ogImage
    });

    const metadata: Metadata = {
      // 🛡️ 경고 해결: metadataBase 동적 설정
      metadataBase,
      
      title: `${blog.title} - AWEKERS`,
      description: blog.summary,
      keywords: blog.tag,
      
      // Open Graph 메타태그
      openGraph: {
        title: blog.title,
        description: blog.summary,
        url: blogUrl,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: blog.title,
          }
        ],
        type: "article",
        siteName: "AWEKERS",
        locale: 'ko_KR',
        publishedTime: blog.date.toISOString(),
        authors: ["AWEKERS"],
      },
      
      // Twitter 메타태그
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.summary,
        images: [ogImage],
        creator: "@AWEKERS",
      },
      
      // 추가 SEO 메타태그
      authors: [{ name: "AWEKERS" }],
      publisher: "AWEKERS",
      robots: {
        index: true,
        follow: true,
        googleBot: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
      },
      
      // 정규 URL 설정
      alternates: {
        canonical: blogUrl,
      },
      
      // JSON-LD 구조화 데이터 (향후 추가 예정)
      other: {
        'article:author': 'AWEKERS',
        'article:published_time': blog.date.toISOString(),
        'article:tag': blog.tag,
      },
    };

    // 🎯 성능 모니터링 종료
    perf.end({ blogId, title: blog.title });
    
    return metadata;
  } catch (error) {
    awekers.error('블로그 메타데이터 생성 오류', error, { blogId });
    perf.end({ error: true });
    
    return {
      metadataBase,
      title: "블로그 - AWEKERS",
      description: "AI 검색엔진최적화 블로그",
      robots: { index: false, follow: true },
    };
  }
}

// 정적 생성 최적화
export const dynamic = 'force-static';
export const revalidate = 3600; // 1시간마다 재생성

async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  // 🎯 페이지 성능 모니터링 시작
  const perf = awekers.performance.start('blogDetailPage');
  
  const { id } = await params;
  const blogId = parseInt(id);

  if (isNaN(blogId)) {
    awekers.warn('잘못된 블로그 ID 접근', { id, blogId });
    perf.end({ error: 'invalid_id' });
    
          return (
        <div className="w-full max-w-full sm:max-w-3xl lg:max-w-4xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">잘못된 블로그 주소입니다</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8">올바른 블로그 주소인지 확인해주세요.</p>
          <a 
            href="/blog" 
            className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
          >
            블로그 목록으로 돌아가기
          </a>
        </div>
      );
  }

  try {
    // 🚀 중복 쿼리 방지: 메타데이터와 동일한 데이터 조회
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        tag: true,
        image: true,
        date: true,
        view: true,
      },
    });

    if (!blog) {
      awekers.warn('존재하지 않는 블로그 접근', { blogId });
      perf.end({ error: 'not_found' });
      
      return (
        <div className="w-full max-w-full sm:max-w-3xl lg:max-w-4xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">블로그를 찾을 수 없습니다</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8">요청하신 블로그가 존재하지 않습니다.</p>
          <a 
            href="/blog" 
            className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
          >
            블로그 목록으로 돌아가기
          </a>
        </div>
      );
    }

    // 📝 블로그 조회 로그
    awekers.blog.view(blogId, {
      title: blog.title,
      currentViews: blog.view,
      tag: blog.tag
    });

    // 🔍 SEO 페이지뷰 로그
    awekers.seo.pageView(`/blog/${blogId}`, {
      title: blog.title,
      views: blog.view
    });

    // 🎯 성능 모니터링 종료
    perf.end({ 
      blogId, 
      title: blog.title,
      views: blog.view 
    });

    return <BlogDetailClient blog={blog} />;
  } catch (error) {
    awekers.error('블로그 상세 페이지 로드 실패', error, { blogId });
    perf.end({ error: true });
    
    return (
      <div className="w-full max-w-full sm:max-w-3xl lg:max-w-4xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">오류가 발생했습니다</h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8">블로그를 불러오는 중 오류가 발생했습니다.</p>
        <a 
          href="/blog" 
          className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
        >
          블로그 목록으로 돌아가기
        </a>
      </div>
    );
  }
}

export default BlogPage; 