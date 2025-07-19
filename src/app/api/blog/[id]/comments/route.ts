import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET: 댓글 리스트(최신순, 트리형)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blogId = Number(id);
    if (isNaN(blogId)) return NextResponse.json({ error: '잘못된 블로그 ID' }, { status: 400 });
    // 최상위 댓글(부모 없음)만 조회, 답글은 별도 포함
    const comments = await prisma.comment.findMany({
      where: { blogId, parentId: null },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, isAdmin: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, email: true, isAdmin: true } },
            _count: { select: { likes: true, reports: true } },
          },
        },
        _count: { select: { likes: true, reports: true } },
      },
    });
    return NextResponse.json({ comments });
  } catch (e) {
    return NextResponse.json({ error: '댓글 조회 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// POST: 댓글/답글 작성
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blogId = Number(id);
    if (isNaN(blogId)) return NextResponse.json({ error: '잘못된 블로그 ID' }, { status: 400 });
    const { content, userId, parentId } = await req.json();
    // 입력값 검증
    if (!content || typeof content !== 'string' || content.length < 1) {
      return NextResponse.json({ error: '댓글 내용을 입력하세요.' }, { status: 400 });
    }
    if (!userId || typeof userId !== 'number') {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }
    // 답글일 경우 부모 댓글 존재 확인
    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent || parent.blogId !== blogId) {
        return NextResponse.json({ error: '유효하지 않은 부모 댓글입니다.' }, { status: 400 });
      }
    }
    // 사용자 존재 여부 확인
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: '존재하지 않는 사용자입니다.' }, { status: 404 });
    }
    const comment = await prisma.comment.create({
      data: {
        blogId,
        userId,
        content,
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, email: true, isAdmin: true } },
        _count: { select: { likes: true, reports: true } },
      },
    });
    return NextResponse.json({ comment });
  } catch (e) {
    console.error('댓글 작성 오류:', e);
    return NextResponse.json({ error: '댓글 등록 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 