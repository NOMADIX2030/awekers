import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: 좋아요 추가
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id: blogId, commentId: commentIdStr } = await params;
    const commentId = parseInt(commentIdStr);
    const { userId } = await req.json();

    if (isNaN(commentId)) {
      return NextResponse.json({ error: "유효하지 않은 댓글 ID입니다." }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true }
    });

    if (!comment) {
      return NextResponse.json({ error: "존재하지 않는 댓글입니다." }, { status: 404 });
    }

    // 본인 댓글에는 좋아요 불가
    if (comment.userId === userId) {
      return NextResponse.json({ error: "본인 댓글에는 좋아요를 할 수 없습니다." }, { status: 400 });
    }

    // 이미 좋아요했는지 확인
    const existingLike = await prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId, userId } }
    });

    if (existingLike) {
      return NextResponse.json({ error: "이미 좋아요한 댓글입니다." }, { status: 400 });
    }

    // 좋아요 추가
    await prisma.commentLike.create({
      data: { commentId, userId }
    });

    // 좋아요 수 반환
    const likeCount = await prisma.commentLike.count({
      where: { commentId }
    });

    return NextResponse.json({ 
      message: "좋아요가 추가되었습니다.",
      likeCount,
      isLiked: true
    });

  } catch (e) {
    console.error("좋아요 추가 오류:", e);
    return NextResponse.json({ error: "좋아요 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}

// DELETE: 좋아요 취소
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id: blogId, commentId: commentIdStr } = await params;
    const commentId = parseInt(commentIdStr);
    const { userId } = await req.json();

    if (isNaN(commentId)) {
      return NextResponse.json({ error: "유효하지 않은 댓글 ID입니다." }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    // 좋아요 삭제
    await prisma.commentLike.deleteMany({
      where: { commentId, userId }
    });

    // 좋아요 수 반환
    const likeCount = await prisma.commentLike.count({
      where: { commentId }
    });

    return NextResponse.json({ 
      message: "좋아요가 취소되었습니다.",
      likeCount,
      isLiked: false
    });

  } catch (e) {
    console.error("좋아요 취소 오류:", e);
    return NextResponse.json({ error: "좋아요 취소 중 오류가 발생했습니다." }, { status: 500 });
  }
} 