import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 특정 블로그 조회 (최적화)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: "유효하지 않은 ID입니다." }, { status: 400 });
    }

    // 최적화된 쿼리: 필요한 필드만 선택
    const blog = await prisma.blog.findUnique({
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        tag: true,
        image: true,
        date: true,
        view: true,
      },
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: "블로그를 찾을 수 없습니다." }, { status: 404 });
    }

    // 캐시 헤더 추가 (5분 캐시)
    const response = NextResponse.json(blog);
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('Content-Encoding', 'gzip');
    
    return response;
  } catch (error) {
    console.error("블로그 조회 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// PUT: 블로그 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: "유효하지 않은 ID입니다." }, { status: 400 });
    }

    const data = await request.json();
    const blog = await prisma.blog.update({
      where: { id },
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
    console.error("블로그 수정 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// DELETE: 블로그 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: "유효하지 않은 ID입니다." }, { status: 400 });
    }

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ message: "블로그가 삭제되었습니다." });
  } catch (error) {
    console.error("블로그 삭제 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
} 