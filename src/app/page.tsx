
// 서버 컴포넌트에서 prisma import
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import BlogListServer from "./components/BlogListServer";
import awekers from "@/lib/logger";

// 블로그 타입 정의
interface Blog {
  id: number;
  title: string;
  summary: string;
  tag: string;
  image: string;
  date: Date;
  view: number;
}

// 🎯 동적 도메인 감지 함수 - 환경변수 기반
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
    // 프로덕션 기본 도메인 (나중에 실제 도메인으로 변경)
    return 'https://awekers.vercel.app';
  }
  
  // 개발환경 기본값
  return 'http://localhost:3000';
}

// SEO 메타데이터 동적 생성 - 경고 완전 해결
export async function generateMetadata(): Promise<Metadata> {
  // 🎯 성능 모니터링 시작
  const perf = awekers.performance.start('generateMetadata');
  
  // 🎯 동적 도메인 감지
  const currentDomain = getCurrentDomain();
  const metadataBase = new URL(currentDomain);
  
  // DB에서 사이트 설정값 읽기 (오류 처리 추가)
  const settings: Record<string, string> = {};
  try {
    const settingsArr = await prisma.siteSetting.findMany();
    settingsArr.forEach((s: any) => { settings[s.key] = s.value; });
    
    awekers.debug('사이트 설정 로드 완료', { 
      settingsCount: settingsArr.length,
      domain: currentDomain 
    });
  } catch (error) {
    awekers.error('데이터베이스 연결 실패, 기본값 사용', error);
  }
  
  // 기본값
  const siteName = settings.siteName || "아커스";
  const siteDesc = settings.siteDesc || "AI 검색엔진최적화";
  const keywords = settings.keywords || "SEO,AI,검색엔진최적화,백링크,네이버,구글";
  const ogImage = settings.ogImage || "/next.svg";
  const author = settings.author || "AWEKERS";
  const publisher = settings.publisher || "AWEKERS";
  
  // 🔍 SEO 메타데이터 생성 로그
  awekers.seo.metadataGeneration('home', {
    siteName,
    domain: currentDomain,
    ogImage
  });
  
  const metadata: Metadata = {
    // 🛡️ 경고 해결: metadataBase 동적 설정
    metadataBase,
    
    title: siteName,
    description: siteDesc,
    keywords,
    
    // Open Graph 메타태그 (소셜 미디어용)
    openGraph: {
      title: siteName,
      description: siteDesc,
      url: currentDomain,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        }
      ],
      type: "website",
      siteName,
      locale: 'ko_KR',
    },
    
    // Twitter 메타태그
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDesc,
      images: [ogImage],
      creator: `@${author}`,
    },
    
    // 추가 SEO 메타태그
    authors: [{ name: author }],
    publisher,
    robots: {
      index: true,
      follow: true,
      googleBot: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
    },
    
    // 정규 URL 설정
    alternates: {
      canonical: currentDomain,
    },
    
    // 추가 메타태그
    other: {
      'google-site-verification': settings.googleSiteVerification || '',
      'naver-site-verification': settings.naverSiteVerification || '',
    },
  };
  
  // 🎯 성능 모니터링 종료
  perf.end();
  
  return metadata;
}

// 강력한 캐싱 전략 적용
export const revalidate = 600; // 10분마다 재생성
export const dynamic = 'force-static'; // 정적 생성 강제

// 서버 컴포넌트: 블로그 리스트 서버에서 직접 렌더링
export default async function Home() {
  // 🎯 페이지 성능 모니터링 시작
  const perf = awekers.performance.start('homePage');
  
  // DB에서 사이트 설정값 읽기 (오류 처리 추가)
  const settings: Record<string, string> = {};
  try {
    const settingsArr = await prisma.siteSetting.findMany();
    settingsArr.forEach((s: any) => { settings[s.key] = s.value; });
  } catch (error) {
    awekers.error('데이터베이스 연결 실패, 기본값 사용', error);
  }
  
  // 기본값
  const siteName = settings.siteName || "아커스";
  
  // 블로그 목록 가져오기 (안전한 날짜 처리)
  try {
    const blogs: Blog[] = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        tag: true,
        image: true,
        date: true,
        view: true,
      },
      orderBy: { date: 'desc' },
      take: 10,
    });

    // 📊 블로그 로드 성공 로그
    awekers.info('메인 페이지 블로그 목록 로드 완료', {
      blogCount: blogs.length,
      siteName
    });

    // 🔍 SEO 페이지뷰 로그
    awekers.seo.pageView('/', {
      siteName,
      blogCount: blogs.length
    });

    // 🎯 성능 모니터링 종료
    perf.end({ blogCount: blogs.length });

    return (
      <div className="w-full max-w-3xl mx-auto py-10">
        <BlogListServer siteName={siteName} blogs={blogs} />
      </div>
    );
  } catch (error) {
    awekers.error('메인 페이지 블로그 로드 실패', error);
    
    // 에러 상황에서도 기본 페이지 제공
    perf.end({ error: true });
    
    return (
      <div className="w-full max-w-3xl mx-auto py-10">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">일시적인 오류가 발생했습니다</h1>
          <p className="text-gray-600">잠시 후 다시 시도해 주세요.</p>
        </div>
      </div>
    );
  }
}
