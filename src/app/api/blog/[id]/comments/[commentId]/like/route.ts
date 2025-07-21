import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 좋아요 토글 (POST/DELETE)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { commentId: commentIdStr } = await params;
    const commentId = parseInt(commentIdStr);
    const body = await request.json();
    const { userId } = body;

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

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId
        }
      }
    });

    if (existingLike) {
      return NextResponse.json(
        { error: '이미 좋아요를 누르셨습니다.' },
        { status: 400 }
      );
    }

    // 좋아요 추가
    await prisma.commentLike.create({
      data: {
        commentId,
        userId
      }
    });

    // 업데이트된 좋아요 수 반환
    const likesCount = await prisma.commentLike.count({
      where: { commentId }
    });

    return NextResponse.json({ 
      message: '좋아요가 추가되었습니다.',
      likesCount,
      isLiked: true
    });

  } catch (error) {
    console.error('좋아요 추가 오류:', error);
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 좋아요 취소 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { commentId: commentIdStr } = await params;
    const commentId = parseInt(commentIdStr);
    const body = await request.json();
    const { userId } = body;

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

    // 기존 좋아요 확인
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId
        }
      }
    });

    if (!existingLike) {
      return NextResponse.json(
        { error: '좋아요를 누르지 않았습니다.' },
        { status: 400 }
      );
    }

    // 좋아요 삭제
    await prisma.commentLike.delete({
      where: {
        commentId_userId: {
          commentId,
          userId
        }
      }
    });

    // 업데이트된 좋아요 수 반환
    const likesCount = await prisma.commentLike.count({
      where: { commentId }
    });

    return NextResponse.json({ 
      message: '좋아요가 취소되었습니다.',
      likesCount,
      isLiked: false
    });

  } catch (error) {
    console.error('좋아요 취소 오류:', error);
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
} 