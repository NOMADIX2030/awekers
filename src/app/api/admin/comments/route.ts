import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인 (실제로는 세션/토큰 기반 인증 필요)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 댓글 목록 조회 (최근 20개)
    const comments = await prisma.comment.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
        blogId: true
      }
    });

    // 사용자와 블로그 정보를 별도로 조회
    if (comments.length > 0) {
      const userIds = [...new Set(comments.map((c: any) => c.userId).filter(Boolean))];
      const blogIds = [...new Set(comments.map((c: any) => c.blogId).filter(Boolean))];

      const users = await prisma.user.findMany({
        where: { id: { in: userIds as number[] } },
        select: { id: true, email: true }
      });

      const blogs = await prisma.blog.findMany({
        where: { id: { in: blogIds as number[] } },
        select: { id: true, title: true }
      });

      // 댓글 데이터에 사용자와 블로그 정보 추가
      const commentsWithDetails = comments.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        author: users.find(u => u.id === comment.userId)?.email || '알 수 없음',
        blogTitle: blogs.find(b => b.id === comment.blogId)?.title || '삭제된 게시글',
        date: comment.createdAt.toISOString(),
        isHidden: false // 현재는 숨김 기능이 없으므로 false
      }));

      return NextResponse.json({ comments: commentsWithDetails });
    }

    return NextResponse.json({ comments: [] });

  } catch (error) {
    console.error('댓글 관리 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 삭제 API
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ error: '댓글 ID가 필요합니다.' }, { status: 400 });
    }

    await prisma.comment.delete({
      where: { id: parseInt(commentId) }
    });

    return NextResponse.json({ success: true, message: '댓글이 삭제되었습니다.' });

  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    return NextResponse.json(
      { error: '댓글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 수정/숨김 API
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, content, isHidden } = body;
    if (!id) {
      return NextResponse.json({ error: '댓글 ID가 필요합니다.' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof content === 'string') updateData.content = content;
    if (typeof isHidden === 'boolean') updateData.isHidden = isHidden;

    const updated = await prisma.comment.update({
      where: { id: Number(id) },
      data: updateData
    });

    return NextResponse.json({ success: true, comment: updated });
  } catch (error) {
    console.error('댓글 수정/숨김 오류:', error);
    return NextResponse.json(
      { error: '댓글 수정/숨김 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
 
 