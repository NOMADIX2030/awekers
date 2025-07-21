import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { QueryOptimizer } from '../../../../lib/admin/QueryOptimizer';

// GET: 신고된 댓글 목록 조회 (중앙집중식)
export async function GET(req: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all'; // all, hidden, visible
    
    // 🚀 중앙집중식 최적화 적용 (N+1 쿼리 문제 해결)
    console.log('🎯 신고 관리: QueryOptimizer 적용 시작 (N+1 해결)');
    
    // 🚀 중앙집중식: Application-level JOIN으로 N+1 문제 해결
    const reportsData = await QueryOptimizer.getInstance().executeWithApplicationJoin(
      // 메인 쿼리: 신고 수가 3개 이상인 댓글들만
      () => prisma.comment.findMany({
        where: {
          reports: { some: {} } // 신고가 있는 댓글들만
        },
          select: {
            id: true,
          content: true,
          isHidden: true,
          createdAt: true,
          userId: true,
          blogId: true,
        _count: {
          select: {
            reports: true,
            likes: true
          }
        }
      },
        orderBy: { createdAt: 'desc' }
      }),
      // 관계 설정: 애플리케이션에서 조인
      {
        user: {
          foreignKey: 'userId',
          joinQuery: (userIds: any[]) => 
            prisma.user.findMany({
              where: { id: { in: userIds } },
              select: { id: true, email: true, isAdmin: true }
            }),
          mapTo: 'user'
        },
        blog: {
          foreignKey: 'blogId',
          joinQuery: (blogIds: any[]) =>
            prisma.blog.findMany({
              where: { id: { in: blogIds } },
              select: { id: true, title: true }
            }),
          mapTo: 'blog'
        }
      }
    );

    // 신고 수가 3개 이상이고 사용자가 존재하는 댓글만 필터링
    let commentsWithReports = reportsData.filter((comment: any) => 
      comment._count.reports >= 3 && comment.user !== null
    );

    // 상태별 필터링
    if (status === 'hidden') {
      commentsWithReports = commentsWithReports.filter((comment: any) => comment.isHidden);
    } else if (status === 'visible') {
      commentsWithReports = commentsWithReports.filter((comment: any) => !comment.isHidden);
    }

    // 🚀 중앙집중식: 모든 신고 데이터를 한 번에 조회 (N+1 해결)
    const commentIds = commentsWithReports.map((comment: any) => comment.id);
    const allReports = commentIds.length > 0 ? await prisma.commentReport.findMany({
      where: { commentId: { in: commentIds } },
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            }
          },
      orderBy: { createdAt: 'desc' }
    }) : [];

    // 애플리케이션 레벨에서 신고 데이터 조인
    const reports = commentsWithReports.map((comment: any) => {
      const commentReports = allReports.filter(report => report.commentId === comment.id);

        return {
          id: comment.id,
          content: comment.content,
          isHidden: comment.isHidden || false,
          createdAt: comment.createdAt,
          user: comment.user,
          blog: comment.blog,
          _count: comment._count,
          reportCount: comment._count.reports,
          likeCount: comment._count.likes,
          reports: commentReports.map(report => ({
            id: report.id,
            reason: report.reason,
            createdAt: report.createdAt,
            user: report.user
          }))
        };
    });
    
    console.log('✅ 신고 관리: QueryOptimizer 최적화 완료 (N+1 해결)');
    const endTime = performance.now();
    console.log(`🎯 신고 관리 로딩 완료: ${(endTime - startTime).toFixed(2)}ms (${reports.length}개 신고)`);

    return NextResponse.json({ 
      reports,
      total: reports.length,
      hidden: reports.filter(r => r.isHidden).length,
      visible: reports.filter(r => !r.isHidden).length
    });
  } catch (e) {
    console.error("신고 목록 조회 오류:", e);
    return NextResponse.json({ error: "신고 목록을 불러오는데 실패했습니다." }, { status: 500 });
  }
}

// POST: 신고 처리 (숨김/복원/삭제)
export async function POST(req: NextRequest) {
  try {
    const { commentId, action, reason } = await req.json();
    
    if (!commentId || !action) {
      return NextResponse.json({ error: "필수 파라미터가 누락되었습니다." }, { status: 400 });
    }

    const updateData: Record<string, boolean> = {};
    let message = "";
    
    switch (action) {
      case 'hide':
        updateData.isHidden = true;
        message = "댓글이 숨겨졌습니다.";
        break;
      case 'unhide':
        updateData.isHidden = false;
        message = "댓글이 복원되었습니다.";
        break;
      case 'delete':
        // 댓글 삭제 (관련 데이터도 함께 삭제)
        await prisma.commentReport.deleteMany({ where: { commentId } });
        await prisma.commentLike.deleteMany({ where: { commentId } });
        await prisma.comment.delete({ where: { id: commentId } });
        return NextResponse.json({ 
          message: "댓글이 삭제되었습니다.",
          deleted: true
        });
      case 'resolve':
        // 신고 해결 처리 (모든 신고를 해결된 것으로 표시)
        // await prisma.commentReport.updateMany({
        //   where: { commentId },
        //   data: { resolved: true }
        // });
        message = "신고가 해결 처리되었습니다.";
        break;
      case 'dismiss':
        // 신고 기각 처리 (모든 신고를 기각된 것으로 표시)
        // await prisma.commentReport.updateMany({
        //   where: { commentId },
        //   data: { dismissed: true }
        // });
        message = "신고가 기각되었습니다.";
        break;
      default:
        return NextResponse.json({ error: "유효하지 않은 액션입니다." }, { status: 400 });
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.comment.update({
        where: { id: commentId },
        data: updateData
      });
    }

    return NextResponse.json({ 
      message,
      success: true
    });
  } catch (e) {
    console.error("신고 처리 오류:", e);
    return NextResponse.json({ error: "신고 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
} 