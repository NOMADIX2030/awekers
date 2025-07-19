import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 최신/인기 태그 집계 API
export async function GET() {
  // 최신 블로그 10개에서 태그 추출
  const latestBlogs = await prisma.blog.findMany({
    orderBy: { date: "desc" },
    take: 10,
  });
  // 조회수 상위 10개 블로그에서 태그 추출
  const popularBlogs = await prisma.blog.findMany({
    orderBy: { view: "desc" },
    take: 10,
  });
  // 태그 파싱 및 중복 제거
  function extractTags(blogs: Array<{ tag: string }>) {
    const tags: string[] = [];
    blogs.forEach(b => {
      if (b.tag) {
        b.tag.split(",").map((t: string) => t.trim()).forEach((t: string) => {
          if (t && !tags.includes(t)) tags.push(t);
        });
      }
    });
    return tags;
  }
  const latestTags = extractTags(latestBlogs);
  const popularTags = extractTags(popularBlogs);
  return NextResponse.json({ latestTags, popularTags });
} 