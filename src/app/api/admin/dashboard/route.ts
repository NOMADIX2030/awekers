import { NextRequest } from "next/server";
import prisma from "../../../../lib/prisma";
import { CacheManager } from "../../../../lib/admin/CacheManager";
import { QueryOptimizer } from "../../../../lib/admin/QueryOptimizer";
import fs from 'fs';

// 🎯 캐시 키 상수 정의
const CACHE_KEYS = {
  DASHBOARD_FULL: 'dashboard:full',
  STATS_BASIC: 'dashboard:stats:basic',
  STATS_INQUIRIES: 'dashboard:stats:inquiries', 
  RECENT_INQUIRIES: 'dashboard:recent:inquiries',
  RECENT_POSTS: 'dashboard:recent:posts',
  RECENT_COMMENTS: 'dashboard:recent:comments',
  VIEWS_TOTAL: 'dashboard:stats:views'
};

// 🚀 극대화된 캐시 TTL (10분 → 30분)
const CACHE_TTL = 1800; // 30분

let apiCallCount = 0;

export async function GET(request: NextRequest) {
  apiCallCount++;
  const logMsg = `🔥 Dashboard API 호출 #${apiCallCount} 시작 - ${new Date().toISOString()}`;
  console.log(logMsg);

  // 🚨 파일 로깅으로 정확한 추적
  try {
    fs.appendFileSync('/tmp/dashboard-api-log.txt', logMsg + '\n');
  } catch (e) {
    // 파일 로깅 실패해도 계속 진행
  }

  const startTime = performance.now();
  const cache = CacheManager.getInstance();

  try {
    // 🚀 Phase 1: 전체 대시보드 캐시 확인 (최우선)
    const fullCacheKey = CACHE_KEYS.DASHBOARD_FULL;
    const cachedDashboard = await cache.get(fullCacheKey);
    
    if (cachedDashboard) {
      const responseTime = (performance.now() - startTime).toFixed(2);
      console.log(`🚀 대시보드 전체 캐시 히트: ${responseTime}ms`);
      
      return Response.json({
        ...cachedDashboard,
        cached: true,
        responseTime: `${responseTime}ms`,
        cacheHit: 'FULL'
      });
    }

    // 🎯 Phase 2: 개별 캐시 확인 및 조합 (부분 캐시 히트)
    console.log('🔍 개별 캐시 확인 시작');
    
    const [
      cachedBasicStats,
      cachedInquiryStats,
      cachedViewsTotal,
      cachedRecentInquiries,
      cachedRecentPosts,
      cachedRecentComments
    ] = await Promise.all([
      cache.get(CACHE_KEYS.STATS_BASIC),
      cache.get(CACHE_KEYS.STATS_INQUIRIES),
      cache.get(CACHE_KEYS.VIEWS_TOTAL),
      cache.get(CACHE_KEYS.RECENT_INQUIRIES),
      cache.get(CACHE_KEYS.RECENT_POSTS),
      cache.get(CACHE_KEYS.RECENT_COMMENTS)
    ]);

    let partialCacheHits = 0;
    const dbQueries = [];

    // 🚀 Phase 3: 누락된 데이터만 선택적 조회 (Database Selective Loading)
    
    // 기본 통계
    let basicStats = cachedBasicStats;
    if (!basicStats) {
      console.log('💾 기본 통계 DB 조회 필요');
      dbQueries.push(
      prisma.blog.count(),
      prisma.comment.count(),
      prisma.user.count(),
        prisma.inquiry.count()
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 기본 통계 캐시 히트');
    }

    // 문의 통계
    let inquiryStats = cachedInquiryStats;
    if (!inquiryStats) {
      console.log('💾 문의 통계 DB 조회 필요');
      dbQueries.push(
      prisma.inquiry.groupBy({
        by: ['status'],
          _count: { status: true }
        })
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 문의 통계 캐시 히트');
    }

    // 조회수 통계
    let viewsTotal = cachedViewsTotal;
    if (!viewsTotal) {
      console.log('💾 조회수 통계 DB 조회 필요');
      dbQueries.push(
        prisma.blog.aggregate({ _sum: { view: true } })
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 조회수 통계 캐시 히트');
    }

    // 최근 데이터들
    let recentInquiries = cachedRecentInquiries;
    let recentPosts = cachedRecentPosts;
    let recentComments = cachedRecentComments;

    if (!recentInquiries) {
      console.log('💾 최근 문의 DB 조회 필요');
      dbQueries.push(
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, serviceType: true, createdAt: true, status: true }
        })
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 최근 문의 캐시 히트');
    }

    if (!recentPosts) {
      console.log('💾 최근 게시글 DB 조회 필요');
      dbQueries.push(
      prisma.blog.findMany({
        take: 5,
        orderBy: { view: 'desc' },
          select: { id: true, title: true, date: true, tag: true, view: true }
        })
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 최근 게시글 캐시 히트');
    }

    if (!recentComments) {
      console.log('💾 최근 댓글 DB 조회 필요');
      // Application-level JOIN은 캐시되지 않은 경우에만 실행
      dbQueries.push(
        QueryOptimizer.getInstance().executeWithApplicationJoin(
          () => prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
            where: { isHidden: false },
            select: { id: true, content: true, createdAt: true, userId: true, blogId: true }
          }),
          {
          user: {
              foreignKey: 'userId',
              joinQuery: (userIds: any[]) =>
                prisma.user.findMany({
                  where: { id: { in: userIds } },
                  select: { id: true, email: true }
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
        )
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 최근 댓글 캐시 히트');
    }

    // 🚀 Phase 4: 필요한 DB 쿼리만 실행 (최소화된 데이터베이스 접근)
    console.log(`🔍 실행할 DB 쿼리 수: ${dbQueries.length}개 (캐시 히트: ${partialCacheHits}개)`);
    
    if (dbQueries.length > 0) {
      console.log(`🔍 API 호출 #${apiCallCount}: Promise.all 시작 - ${dbQueries.length}개 쿼리 병렬 실행`);
      
      const results = await Promise.all(dbQueries);
      let resultIndex = 0;

      // 결과를 변수에 할당
      if (!basicStats) {
        basicStats = {
          totalPosts: results[resultIndex++],
          totalComments: results[resultIndex++],
          totalUsers: results[resultIndex++],
          totalInquiries: results[resultIndex++]
        };
        // 개별 캐시 저장
        await cache.set(CACHE_KEYS.STATS_BASIC, basicStats, CACHE_TTL);
      }

      if (!inquiryStats) {
        inquiryStats = results[resultIndex++];
        await cache.set(CACHE_KEYS.STATS_INQUIRIES, inquiryStats, CACHE_TTL);
      }

      if (!viewsTotal) {
        viewsTotal = results[resultIndex++];
        await cache.set(CACHE_KEYS.VIEWS_TOTAL, viewsTotal, CACHE_TTL);
      }

      if (!recentInquiries) {
        recentInquiries = results[resultIndex++];
        await cache.set(CACHE_KEYS.RECENT_INQUIRIES, recentInquiries, CACHE_TTL);
      }

      if (!recentPosts) {
        recentPosts = results[resultIndex++];
        await cache.set(CACHE_KEYS.RECENT_POSTS, recentPosts, CACHE_TTL);
      }

      if (!recentComments) {
        recentComments = results[resultIndex++];
        await cache.set(CACHE_KEYS.RECENT_COMMENTS, recentComments, CACHE_TTL);
      }

      console.log(`✅ API 호출 #${apiCallCount}: Promise.all 완료 - ${dbQueries.length}개 쿼리 실행됨`);
    }

    // 🎯 Phase 5: 최종 데이터 조합 및 전체 캐시 저장
    const dashboardData = {
      stats: {
        totalPosts: basicStats.totalPosts,
        totalComments: basicStats.totalComments,
        totalViews: viewsTotal._sum?.view || 0,
        totalUsers: basicStats.totalUsers,
        totalTags: 0, // 계산 생략 (성능 우선)
        totalInquiries: basicStats.totalInquiries,
        pendingInquiries: inquiryStats.find((s: any) => s.status === 'PENDING')?._count?.status || 0,
        processingInquiries: inquiryStats.find((s: any) => s.status === 'PROCESSING')?._count?.status || 0,
        completedInquiries: inquiryStats.find((s: any) => s.status === 'COMPLETED')?._count?.status || 0
      },
      recentPosts: recentPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        date: post.date.toISOString().split('T')[0],
        author: "관리자",
        views: post.view,
        tag: post.tag
      })),
      recentComments: recentComments.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        date: comment.createdAt.toISOString().split('T')[0],
        user: { email: comment.user?.email || "알 수 없음" },
        blogTitle: comment.blog?.title || "삭제된 게시글"
      })),
      recentInquiries: recentInquiries.map((inquiry: any) => ({
        id: inquiry.id,
        name: inquiry.name,
        serviceType: inquiry.serviceType,
        date: inquiry.createdAt.toISOString().split('T')[0],
        status: inquiry.status
      })),
      serverInfo: {
        uptime: "15일 8시간",
        memory: "45%",
        cpu: "23%",
        disk: "67%",
        lastUpdate: new Date().toISOString()
      }
    };

    // 🚀 전체 대시보드 캐시 저장
    await cache.set(CACHE_KEYS.DASHBOARD_FULL, dashboardData, CACHE_TTL);

    const responseTime = (performance.now() - startTime).toFixed(2);
    console.log(`🎯 대시보드 로딩 완료: ${responseTime}ms (캐시 미스, 부분 히트: ${partialCacheHits})`);

    return Response.json({
      ...dashboardData,
      cached: false,
      partialCacheHits,
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error("❌ Dashboard API 오류:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 🚀 캐시 무효화 API (관리자용)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // CacheManager는 전역 캐시를 관리하므로 개별 캐시 키를 명시적으로 지우지 않아도 됨
    // 대신 전체 캐시를 무효화하는 것이 더 효율적일 수 있음
    CacheManager.getInstance().clear();
    
    return Response.json({ 
      success: true, 
      message: '대시보드 캐시가 무효화되었습니다.' 
    });
  } catch (error) {
    console.error('캐시 무효화 오류:', error);
    return Response.json(
      { success: false, error: '캐시 무효화에 실패했습니다.' },
      { status: 500 }
    );
  }
} 
 
 