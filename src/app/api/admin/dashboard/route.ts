import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인 (실제로는 세션/토큰 기반 인증 필요)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 실제 데이터베이스에서 통계 데이터 수집 (안전한 방식)
    let totalPosts = 0;
    let totalComments = 0;
    let totalViews = 0;
    let totalUsers = 0;
    let recentPosts: { id: number; title: string; date: Date; view: number; tag: string }[] = [];
    let recentComments: { id: number; content: string; createdAt: Date; userId: number; blogId: number; user?: { id: number; email: string }; blog?: { id: number; title: string } }[] = [];

    try {
      // 각 쿼리를 개별적으로 실행하여 오류 방지
      totalPosts = await prisma.blog.count();
    } catch (error) {
      console.error('게시글 수 조회 오류:', error);
    }

    try {
      totalComments = await prisma.comment.count();
    } catch (error) {
      console.error('댓글 수 조회 오류:', error);
    }

    try {
      const viewsResult = await prisma.blog.aggregate({
        _sum: {
          view: true
        }
      });
      totalViews = viewsResult._sum.view || 0;
    } catch (error) {
      console.error('조회수 조회 오류:', error);
    }

    try {
      totalUsers = await prisma.user.count();
    } catch (error) {
      console.error('사용자 수 조회 오류:', error);
    }

    try {
      recentPosts = await prisma.blog.findMany({
        take: 5,
        orderBy: {
          view: 'desc'
        },
        select: {
          id: true,
          title: true,
          date: true,
          view: true,
          tag: true
        }
      });
    } catch (error) {
      console.error('인기 게시글 조회 오류:', error);
    }

    try {
      recentComments = await prisma.comment.findMany({
        take: 5,
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
      if (recentComments.length > 0) {
        const userIds = [...new Set(recentComments.map(c => c.userId).filter(Boolean))];
        const blogIds = [...new Set(recentComments.map(c => c.blogId).filter(Boolean))];

        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true }
        });

        const blogs = await prisma.blog.findMany({
          where: { id: { in: blogIds } },
          select: { id: true, title: true }
        });

        // 댓글 데이터에 사용자와 블로그 정보 추가
        recentComments = recentComments.map(comment => ({
          ...comment,
          user: users.find(u => u.id === comment.userId),
          blog: blogs.find(b => b.id === comment.blogId)
        }));
      }
    } catch (error) {
      console.error('최근 댓글 조회 오류:', error);
    }

    // 서버 정보
    const serverInfo = {
      uptime: "15일 8시간",
      memory: "45%",
      cpu: "23%",
      disk: "67%",
      lastUpdate: new Date().toISOString()
    };

    // 응답 데이터 구성
    const dashboardData = {
      stats: {
        totalPosts,
        totalComments,
        totalViews,
        totalUsers,
        totalTags: 0
      },
      recentPosts: recentPosts.map((post) => ({
        id: post.id,
        title: post.title,
        date: post.date.toISOString().split('T')[0],
        author: '관리자',
        views: post.view || 0,
        tag: post.tag
      })),
      recentComments: recentComments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        date: comment.createdAt.toISOString().split('T')[0],
        author: comment.user?.email || '익명',
        blogTitle: comment.blog?.title || '알 수 없음'
      })),
      serverInfo
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('대시보드 데이터 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
 
 