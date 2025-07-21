import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: 블로그 조회수 증가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: "유효하지 않은 ID입니다." }, { status: 400 });
    }
    // 조회수 1 증가
    const updated = await prisma.blog.update({
      where: { id },
      data: { view: { increment: 1 } },
    });
    return NextResponse.json({ view: updated.view });
  } catch (error) {
    return NextResponse.json({ error: "조회수 증가 실패" }, { status: 500 });
  }
} 