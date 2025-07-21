import React from "react";
import prisma from "@/lib/prisma";
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
    });

    // 클라이언트 컴포넌트에 데이터 전달
    return (
      <div className="min-h-screen bg-gray-50">
        <TagListClient 
          tag={decodedTag} 
          blogs={blogs} 
        />
      </div>
    );
  } catch (error) {
    console.error("태그 페이지 로딩 오류:", error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            페이지를 불러올 수 없습니다
          </h1>
          <p className="text-gray-600 mb-8">
            잠시 후 다시 시도해주세요.
          </p>
          <a 
            href="/blog" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            블로그 목록으로 돌아가기
          </a>
        </div>
      </div>
    );
  }
} 