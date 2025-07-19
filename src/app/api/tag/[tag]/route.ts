import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 특정 태그의 블로그 글 목록 반환 (최적화)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tag: string }> }
) {
  try {
    // Next.js 15+ dynamic API route에서는 params가 Promise이므로 await 필요
    const params = await context.params;
    const tag = params?.tag;
    if (!tag) {
      return NextResponse.json({ error: "태그가 지정되지 않았습니다." }, { status: 400 });
    }

    const decodedTag = decodeURIComponent(tag);
    console.log("검색할 태그:", decodedTag);
    
    // 최적화된 쿼리: 필요한 필드만 선택하고 인덱스 활용
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
      // 성능을 위한 제한
      take: 50,
    });
    
    console.log("찾은 블로그 수:", blogs.length);
    
    // 캐시 헤더 추가 (3분 캐시)
    const response = NextResponse.json({ blogs });
    response.headers.set('Cache-Control', 'public, s-maxage=180, stale-while-revalidate=300');
    response.headers.set('Content-Encoding', 'gzip');
    
    return response;
  } catch (error) {
    console.error("태그별 블로그 목록 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
} 