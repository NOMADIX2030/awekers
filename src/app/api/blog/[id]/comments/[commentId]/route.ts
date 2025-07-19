import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE: 댓글 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params;
    const blogId = Number(id);
    const commentIdNum = Number(commentId);
    
    if (isNaN(blogId) || isNaN(commentIdNum)) {
      return NextResponse.json({ error: '잘못된 ID입니다.' }, { status: 400 });
    }

    // 요청 본문에서 사용자 ID 가져오기
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: '사용자 인증이 필요합니다.' }, { status: 401 });
    }

    // 댓글 조회
    const comment = await prisma.comment.findUnique({
      where: { id: commentIdNum },
      include: {
        user: { select: { id: true, isAdmin: true } }
      }
    });

    if (!comment) {
      return NextResponse.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 권한 확인: 자신의 댓글이거나 관리자인 경우만 삭제 가능
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isAdmin: true }
    });

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 삭제 권한 확인
    const canDelete = user.isAdmin || comment.user.id === userId;
    
    if (!canDelete) {
      return NextResponse.json({ error: '댓글을 삭제할 권한이 없습니다.' }, { status: 403 });
    }

    // 관련 데이터 삭제 (트랜잭션으로 처리)
    await prisma.$transaction(async (tx) => {
      // 신고 삭제
      await tx.commentReport.deleteMany({
        where: { commentId: commentIdNum }
      });

      // 좋아요 삭제
      await tx.commentLike.deleteMany({
        where: { commentId: commentIdNum }
      });

      // 답글 삭제 (있는 경우)
      await tx.comment.deleteMany({
        where: { parentId: commentIdNum }
      });

      // 댓글 삭제
      await tx.comment.delete({
        where: { id: commentIdNum }
      });
    });

    return NextResponse.json({ 
      message: '댓글이 삭제되었습니다.',
      success: true
    });

  } catch (e) {
    console.error('댓글 삭제 오류:', e);
    return NextResponse.json({ error: '댓글 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 