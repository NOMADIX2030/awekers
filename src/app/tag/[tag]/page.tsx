import React from "react";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import TagListClient from "./TagListClient";

// SEO 메타데이터 동적 생성
export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  return {
    title: `#${decodedTag} - Awekers`,
    description: `${decodedTag} 태그의 블로그 글들을 확인해보세요.`,
    keywords: `${decodedTag}, 블로그, Awekers`,
  };
}

// ISR을 위한 정적 생성 설정
export const revalidate = 300; // 5분마다 재생성

// 서버 컴포넌트: 태그별 블로그 목록
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  try {
    // 서버에서 직접 데이터베이스 쿼리
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
      where: {
        tag: {
          contains: decodedTag,
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 50,
    });

    return (
      <section className="w-full max-w-3xl mx-auto py-16 px-4 font-pretendard bg-white min-h-screen">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight text-black text-center">
          # {decodedTag}
        </h1>
        {blogs.length === 0 ? (
          <div className="text-black/50 text-center">해당 태그의 글이 없습니다.</div>
        ) : (
          <TagListClient blogs={blogs} />
        )}
      </section>
    );
  } catch (error) {
    console.error('태그 페이지 로딩 오류:', error);
    return (
      <section className="w-full max-w-3xl mx-auto py-16 px-4 font-pretendard bg-white min-h-screen">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight text-black text-center">
          # {decodedTag}
        </h1>
        <div className="text-red-500 text-center">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </section>
    );
  }
} 