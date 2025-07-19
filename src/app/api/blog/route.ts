import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 블로그 목록 (최적화)
export async function GET() {
  try {
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
      orderBy: { date: "desc" },
      take: 20, // 성능을 위해 제한
    });
    
    // 캐시 헤더 추가 (3분 캐시)
    const response = NextResponse.json(blogs);
    response.headers.set('Cache-Control', 'public, s-maxage=180, stale-while-revalidate=300');
    response.headers.set('Content-Encoding', 'gzip');
    
    return response;
  } catch (error) {
    console.error('블로그 목록 조회 실패:', error);
    // 데이터베이스 연결 실패 시 빈 배열 반환
    return NextResponse.json([]);
  }
}

// POST: 블로그 등록
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        summary: data.summary,
        content: data.content,
        tag: data.tag,
        image: data.image,
      },
    });
    return NextResponse.json(blog);
  } catch (error) {
    console.error('블로그 등록 실패:', error);
    return NextResponse.json({ error: '블로그 등록에 실패했습니다.' }, { status: 500 });
  }
}

// DELETE: 블로그 삭제
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 });
  }
  try {
    await prisma.blog.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('블로그 삭제 실패:', error);
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 });
  }
} 