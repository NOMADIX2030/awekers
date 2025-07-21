import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

// 댓글 삭제 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId: commentIdStr } = await params;
    const blogId = parseInt(id);
    const commentId = parseInt(commentIdStr);
    const body = await request.json();
    const { userId } = body;

    // 입력 검증
    if (isNaN(blogId) || isNaN(commentId)) {
      return NextResponse.json(
        { error: '올바르지 않은 ID입니다.' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 댓글 존재 확인 및 권한 검증
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: {
            id: true,
            isAdmin: true
          }
        }
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: '존재하지 않는 댓글입니다.' },
        { status: 404 }
      );
    }

    if (comment.blogId !== blogId) {
      return NextResponse.json(
        { error: '잘못된 요청입니다.' },
        { status: 400 }
      );
    }

    // 권한 확인 (댓글 작성자 본인 또는 관리자만 삭제 가능)
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: '올바르지 않은 사용자입니다.' },
        { status: 400 }
      );
    }

    const canDelete = comment.userId === userId || currentUser.isAdmin;

    if (!canDelete) {
      return NextResponse.json(
        { error: '삭제 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 트랜잭션으로 관련 데이터 먼저 삭제 후 댓글 삭제
    await prisma.$transaction(async (tx) => {
      // 1. 댓글의 좋아요 삭제
      await tx.commentLike.deleteMany({
        where: { commentId }
      });

      // 2. 댓글의 신고 삭제
      await tx.commentReport.deleteMany({
        where: { commentId }
      });

      // 3. 댓글 삭제
      await tx.comment.delete({
        where: { id: commentId }
      });
    });

    return NextResponse.json({ 
      message: '댓글이 삭제되었습니다.' 
    });

  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    return NextResponse.json(
      { error: '댓글 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 