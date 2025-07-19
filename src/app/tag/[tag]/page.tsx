import React from "react";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

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
          <div className="grid gap-8 md:grid-cols-2">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="group border border-black/10 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow p-0 flex flex-col gap-0 cursor-pointer hover:-translate-y-1 overflow-hidden"
                onClick={() => window.location.href = `/blog/${blog.id}`}
                tabIndex={0}
                role="button"
                aria-label={blog.title + ' 상세보기'}
                onKeyDown={e => { if (e.key === 'Enter') window.location.href = `/blog/${blog.id}`; }}
              >
                <div className="w-full aspect-[16/9] bg-gray-100 overflow-hidden">
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title + ' 대표 이미지'}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-black/50 mb-1">
                    <span className="font-semibold">{blog.tag}</span>
                    <span>·</span>
                    <span>{blog.date?.toISOString().slice(0, 10)}</span>
                  </div>
                  <h2 className="text-xl font-bold group-hover:underline transition-colors">{blog.title}</h2>
                  <p className="text-sm text-black/70 line-clamp-2">{blog.summary}</p>
                  <span className="mt-2 text-xs font-semibold text-black/60 group-hover:text-black">자세히 보기 →</span>
                </div>
              </article>
            ))}
          </div>
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