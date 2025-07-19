import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 블로그 목록
export async function GET() {
  const blogs = await prisma.blog.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(blogs);
}

// POST: 블로그 등록
export async function POST(req: NextRequest) {
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
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 });
  }
} 