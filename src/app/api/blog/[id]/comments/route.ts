import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { QueryOptimizer } from '@/lib/admin/QueryOptimizer';

// 댓글 조회 (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogId = parseInt(id);
    
    if (isNaN(blogId)) {
      return NextResponse.json(
        { error: '올바르지 않은 블로그 ID입니다.' },
        { status: 400 }
      );
    }

    // 🚀 QueryOptimizer를 사용한 성능 최적화
    const optimizer = QueryOptimizer.getInstance();
    
    // 블로그 존재 확인과 댓글 조회를 병렬로 실행
    const results = await optimizer.executeParallel({
      blog: () => prisma.blog.findUnique({
        where: { id: blogId },
        select: { id: true, title: true }
      }),
      comments: () => prisma.comment.findMany({
        where: { 
          blogId,
          isHidden: false // 숨겨진 댓글 제외
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              isAdmin: true
            }
          },
          _count: {
            select: {
              likes: true,
              reports: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    });

    if (!results.blog) {
      return NextResponse.json(
        { error: '존재하지 않는 블로그입니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ comments: results.comments });

  } catch (error) {
    console.error('댓글 조회 오류:', error);
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 작성 (POST)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogId = parseInt(id);
    const body = await request.json();
    const { content, userId } = body;

    // 입력 검증
    if (isNaN(blogId)) {
      return NextResponse.json(
        { error: '올바르지 않은 블로그 ID입니다.' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: '댓글 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 🚀 QueryOptimizer를 사용한 성능 최적화
    const optimizer = QueryOptimizer.getInstance();
    
    // 블로그와 사용자 존재 확인을 병렬로 실행
    const validations = await optimizer.executeParallel({
      blog: () => prisma.blog.findUnique({
        where: { id: blogId },
        select: { id: true }
      }),
      user: () => prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, isAdmin: true }
      })
    });

    if (!validations.blog) {
      return NextResponse.json(
        { error: '존재하지 않는 블로그입니다.' },
        { status: 404 }
      );
    }

    if (!validations.user) {
      return NextResponse.json(
        { error: '올바르지 않은 사용자입니다.' },
        { status: 400 }
      );
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        blogId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isAdmin: true
          }
        },
        _count: {
          select: {
            likes: true,
            reports: true
          }
        }
      }
    });

    return NextResponse.json({ 
      comment,
      message: '댓글이 등록되었습니다!' 
    });

  } catch (error) {
    console.error('댓글 작성 오류:', error);
    return NextResponse.json(
      { error: '댓글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 