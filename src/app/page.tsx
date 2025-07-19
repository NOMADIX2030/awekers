
// 서버 컴포넌트에서 prisma import
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import BlogListServer from "./components/BlogListServer";

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

// SEO 메타데이터 동적 생성
export async function generateMetadata(): Promise<Metadata> {
  // DB에서 사이트 설정값 읽기 (오류 처리 추가)
  const settings: Record<string, string> = {};
  try {
    const settingsArr = await prisma.siteSetting.findMany();
    settingsArr.forEach(s => { settings[s.key] = s.value; });
  } catch (error) {
    console.warn('데이터베이스 연결 실패, 기본값 사용:', error);
    // 기본값 사용
  }
  
  // 기본값
  const siteName = settings.siteName || "Awekers";
  const siteDesc = settings.siteDesc || "트렌디한 IT/AI 블로그";
  const keywords = settings.keywords || "트렌드,블로그,IT,AI,개발,디자인";
  const ogImage = settings.ogImage || "/next.svg";
  const author = settings.author || "Awekers";
  const publisher = settings.publisher || "Awekers";
  // 도메인 동적 추출 (Next.js 제공)
  const url = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) || "";
  return {
    title: siteName,
    description: siteDesc,
    keywords,
    openGraph: {
      title: siteName,
      description: siteDesc,
      url,
      images: [ogImage],
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDesc,
      images: [ogImage],
    },
    authors: [{ name: author }],
    publisher,
    alternates: {
      canonical: url,
    },
  };
}

// 강력한 캐싱 전략 적용
export const revalidate = 600; // 10분마다 재생성
export const dynamic = 'force-static'; // 정적 생성 강제

// 서버 컴포넌트: 블로그 리스트 서버에서 직접 렌더링
export default async function Home() {
  // DB에서 사이트 설정값 읽기 (오류 처리 추가)
  const settings: Record<string, string> = {};
  try {
    const settingsArr = await prisma.siteSetting.findMany();
    settingsArr.forEach(s => { settings[s.key] = s.value; });
  } catch (error) {
    console.warn('데이터베이스 연결 실패, 기본값 사용:', error);
    // 기본값 사용
  }
  
  const siteName = settings.siteName || "Awekers";

  // 서버에서 직접 블로그 데이터 쿼리 (캐싱 최적화)
  let blogs: Blog[] = [];
  try {
    blogs = await prisma.blog.findMany({
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
        date: "desc",
      },
      take: 10, // 성능을 위해 더 제한
    });
  } catch (error) {
    console.error('블로그 데이터 로딩 실패:', error);
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-10">
      <BlogListServer siteName={siteName} blogs={blogs} />
    </div>
  );
}
