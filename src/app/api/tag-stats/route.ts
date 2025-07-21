import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: 최신/인기 태그 집계 API (최적화)
export async function GET() {
  try {
    // 단일 쿼리로 최신/인기 블로그를 함께 가져오기
    const [latestBlogs, popularBlogs] = await Promise.all([
      prisma.blog.findMany({
        select: { tag: true },
        orderBy: { date: "desc" },
        take: 10,
      }),
      prisma.blog.findMany({
        select: { tag: true },
        orderBy: { view: "desc" },
        take: 10,
      })
    ]);

    // 태그 파싱 및 중복 제거 (최적화)
    function extractTags(blogs: Array<{ tag: string }>) {
      const tagSet = new Set<string>();
      blogs.forEach(b => {
        if (b.tag) {
          b.tag.split(",").forEach((t: string) => {
            const trimmed = t.trim();
            if (trimmed) tagSet.add(trimmed);
          });
        }
      });
      return Array.from(tagSet);
    }

    const latestTags = extractTags(latestBlogs);
    const popularTags = extractTags(popularBlogs);

    // 캐시 헤더 추가 (5분 캐시)
    const response = NextResponse.json({ latestTags, popularTags });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('태그 통계 조회 실패:', error);
    // 데이터베이스 연결 실패 시 빈 배열 반환
    return NextResponse.json({ latestTags: [], popularTags: [] });
  }
} 