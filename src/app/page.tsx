
// 서버 컴포넌트에서 prisma import
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

// SEO 메타데이터 동적 생성
export async function generateMetadata(): Promise<Metadata> {
  // DB에서 사이트 설정값 읽기
  const settingsArr = await prisma.siteSetting.findMany();
  const settings: Record<string, string> = {};
  settingsArr.forEach(s => { settings[s.key] = s.value; });
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


// src/app/page.tsx - 서버 컴포넌트 (SEO/SSR)
import BlogListClient from "./components/BlogListClient";

// 서버 컴포넌트: 블로그 리스트 클라이언트 컴포넌트만 렌더링
export default async function Home() {
  // DB에서 사이트 설정값 읽기
  const settingsArr = await prisma.siteSetting.findMany();
  const settings: Record<string, string> = {};
  settingsArr.forEach(s => { settings[s.key] = s.value; });
  const siteName = settings.siteName || "Awekers";
  return (
    <div className="w-full max-w-3xl mx-auto py-10">
      {/* 사이트 이름을 BlogListClient에 전달 */}
      <BlogListClient siteName={siteName} />
    </div>
  );
}
