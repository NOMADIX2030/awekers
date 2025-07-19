import React from "react";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

// SEO 메타데이터 동적 생성
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const blogId = parseInt(id);
  
  if (isNaN(blogId)) {
    return {
      title: "블로그를 찾을 수 없습니다 - Awekers",
      description: "요청하신 블로그를 찾을 수 없습니다.",
    };
  }

  try {
    const blog = await prisma.blog.findUnique({
      select: {
        title: true,
        summary: true,
        tag: true,
      },
      where: { id: blogId },
    });

    if (!blog) {
      return {
        title: "블로그를 찾을 수 없습니다 - Awekers",
        description: "요청하신 블로그를 찾을 수 없습니다.",
      };
    }

    return {
      title: `${blog.title} - Awekers`,
      description: blog.summary,
      keywords: blog.tag,
      openGraph: {
        title: blog.title,
        description: blog.summary,
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "블로그 - Awekers",
      description: "블로그 상세 페이지",
    };
  }
}

// ISR을 위한 정적 생성 설정
export const revalidate = 300; // 5분마다 재생성

// 서버 컴포넌트: 블로그 상세 페이지
export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blogId = parseInt(id);

  if (isNaN(blogId)) {
    return (
      <div className="w-full max-w-3xl mx-auto py-16 px-4 text-center text-red-500">
        유효하지 않은 블로그 ID입니다.
      </div>
    );
  }

  try {
    // 서버에서 직접 데이터베이스 쿼리
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return (
        <div className="w-full max-w-3xl mx-auto py-16 px-4 text-center text-red-500">
          블로그를 찾을 수 없습니다.
        </div>
      );
    }

    // 조회수 증가 (비동기로 처리)
    prisma.blog.update({
      where: { id: blogId },
      data: { view: { increment: 1 } },
    }).catch(console.error);

    return <BlogDetailClient blog={blog} />;
  } catch (error) {
    console.error('블로그 상세 페이지 로딩 오류:', error);
    return (
      <div className="w-full max-w-3xl mx-auto py-16 px-4 text-center text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }
} 