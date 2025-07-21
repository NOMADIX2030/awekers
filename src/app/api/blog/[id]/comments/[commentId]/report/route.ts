import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 댓글 신고 (POST)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { commentId: commentIdStr } = await params;
    const commentId = parseInt(commentIdStr);
    const body = await request.json();
    const { userId, reason } = body;

    // 입력 검증
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: '올바르지 않은 댓글 ID입니다.' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
      return NextResponse.json(
        { error: '신고 사유를 5자 이상 입력해주세요.' },
        { status: 400 }
      );
    }

    if (reason.trim().length > 500) {
      return NextResponse.json(
        { error: '신고 사유는 500자를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return NextResponse.json(
        { error: '존재하지 않는 댓글입니다.' },
        { status: 404 }
      );
    }

    // 자신의 댓글 신고 방지
    if (comment.userId === userId) {
      return NextResponse.json(
        { error: '자신의 댓글은 신고할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 이미 신고했는지 확인
    const existingReport = await prisma.commentReport.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId
        }
      }
    });

    if (existingReport) {
      return NextResponse.json(
        { error: '이미 신고한 댓글입니다.' },
        { status: 400 }
      );
    }

    // 신고 추가
    await prisma.commentReport.create({
      data: {
        commentId,
        userId,
        reason: reason.trim()
      }
    });

    // 신고 수 확인
    const reportCount = await prisma.commentReport.count({
      where: { commentId }
    });

    // 3회 이상 신고시 댓글 자동 숨김 처리
    if (reportCount >= 3) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { isHidden: true }
      });
    }

    return NextResponse.json({ 
      message: '댓글이 신고되었습니다.',
      reportCount,
      isHidden: reportCount >= 3
    });

  } catch (error) {
    console.error('댓글 신고 오류:', error);
    return NextResponse.json(
      { error: '신고 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
} 