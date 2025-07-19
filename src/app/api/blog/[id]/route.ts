import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 특정 블로그 조회
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

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: "블로그를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(blog);
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