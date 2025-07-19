import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 특정 태그의 블로그 글 목록 반환
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
    // 태그가 포함된 블로그 글 목록 조회 (쉼표로 구분된 태그 문자열에서 포함 여부)
    console.log("검색할 태그:", tag);
    console.log("디코딩된 태그:", decodeURIComponent(tag));
    
    const blogs = await prisma.blog.findMany({
      where: {
        tag: {
          contains: decodeURIComponent(tag),
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    
    console.log("찾은 블로그 수:", blogs.length);
    console.log("블로그 태그들:", blogs.map(b => b.tag));
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("태그별 블로그 목록 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
} 