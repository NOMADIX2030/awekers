import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { CacheManager } from '../../../../lib/admin/CacheManager';
import { QueryOptimizer } from '../../../../lib/admin/QueryOptimizer';

// 🎯 캐시 키 상수 정의 (Comments Management)
const CACHE_KEYS = {
  COMMENT_LIST: (page: number, limit: number, status?: string, search?: string) => 
    `comment:list:${page}:${limit}:${status || 'all'}:${search || 'none'}`,
  COMMENT_STATS: 'comment:stats:all',
  COMMENT_COUNT: (status?: string, search?: string) => `comment:count:${status || 'all'}:${search || 'none'}`
};

// 🚀 극대화된 캐시 TTL (2분 → 5분)
const CACHE_TTL = 300; // 5분

// 관리자 댓글 목록 조회 (GET) - Cache-First 최적화
export async function GET(request: NextRequest) {
  const startTime = performance.now();
  const cache = CacheManager.getInstance();
  
  try {
    const { searchParams } = new URL(request.url);
    
    // 페이지네이션
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // 필터링 옵션
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // 🚀 Phase 1: 전체 캐시 확인 (최우선)
    const fullCacheKey = CACHE_KEYS.COMMENT_LIST(page, limit, status || undefined, search || undefined);
    const cachedResult = await cache.get(fullCacheKey);
    
    if (cachedResult) {
      const responseTime = (performance.now() - startTime).toFixed(2);
      console.log(`🚀 댓글 관리 전체 캐시 히트: ${responseTime}ms`);
      
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        responseTime: `${responseTime}ms`,
        cacheHit: 'FULL'
      });
    }

    // 🎯 Phase 2: 개별 캐시 확인 및 조합
    console.log('🔍 댓글 관리 개별 캐시 확인 시작');
    
    const [cachedStats] = await Promise.all([
      cache.get(CACHE_KEYS.COMMENT_STATS)
    ]);

    let partialCacheHits = 0;
    const dbQueries = [];

    // 통계 데이터
    let commentStats = cachedStats;
    if (!commentStats) {
      console.log('💾 댓글 통계 DB 조회 필요');
      dbQueries.push(
        prisma.comment.count(), // 전체 댓글
        prisma.comment.count({ where: { isHidden: false } }), // 공개 댓글
        prisma.comment.count({ where: { isHidden: true } }), // 숨김 댓글
        prisma.comment.count({ where: { reports: { some: {} } } }) // 신고된 댓글
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 댓글 통계 캐시 히트');
    }

    // 🎯 검색 조건 구성
    const whereCondition: any = {};
    
    // 상태 필터
    if (status === 'hidden') {
      whereCondition.isHidden = true;
    } else if (status === 'visible') {
      whereCondition.isHidden = false;
    } else if (status === 'reported') {
      whereCondition.reports = { some: {} };
    }
    
    // 검색 조건
    if (search) {
      whereCondition.content = { contains: search };
    }

    // 메인 댓글 목록 (항상 DB에서 조회 - 실시간 반영 필요)
    console.log('💾 댓글 목록 DB 조회 (실시간 데이터)');

    // 🚀 Phase 3: 필요한 DB 쿼리만 실행
    const allQueries = [
      // 댓글 목록 (항상 실행) - Application-level JOIN 사용
      QueryOptimizer.getInstance().executeWithApplicationJoin(
        () => prisma.comment.findMany({
        where: whereCondition,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          isHidden: true,
            userId: true,
            blogId: true,
            parentId: true
          }
        }),
        {
          user: {
            foreignKey: 'userId',
            joinQuery: (userIds: string[]) =>
              prisma.user.findMany({
                where: { id: { in: userIds.map(Number) } },
                select: { id: true, email: true }
              }),
            mapTo: 'user'
          },
          blog: {
            foreignKey: 'blogId',
            joinQuery: (blogIds: string[]) =>
              prisma.blog.findMany({
                where: { id: { in: blogIds.map(Number) } },
                select: { id: true, title: true }
              }),
            mapTo: 'blog'
          },
          parent: {
            foreignKey: 'parentId',
            joinQuery: (parentIds: string[]) =>
              prisma.comment.findMany({
                where: { id: { in: parentIds.map(Number).filter(Boolean) } },
                select: { id: true, content: true }
              }),
            mapTo: 'parentComment'
          }
        }
      ),
      // 총 개수 (항상 실행)
      prisma.comment.count({ where: whereCondition }),

      // 조건부 쿼리들
      ...dbQueries
    ];

    console.log(`🔍 댓글 관리 API: ${allQueries.length}개 쿼리 병렬 실행`);
    
    const results = await Promise.all(allQueries);
    
    // 결과 할당
    const comments = results[0] as any[];
    const totalCount = results[1] as number;
    let resultIndex = 2;

    // 조건부 결과 할당
    if (!commentStats) {
      const totalComments = results[resultIndex++] as number;
      const visibleComments = results[resultIndex++] as number;
      const hiddenComments = results[resultIndex++] as number;
      const reportedComments = results[resultIndex++] as number;
      
      commentStats = { totalComments, visibleComments, hiddenComments, reportedComments };
      await cache.set(CACHE_KEYS.COMMENT_STATS, commentStats, CACHE_TTL);
    }

    // 🎯 Phase 4: 최종 데이터 조합
    const responseData = {
      success: true,
      data: {
        comments: await Promise.all(comments.map(async (comment: any) => {
          // 각 댓글의 likes와 reports 수를 조회
          const [likesCount, reportsCount] = await Promise.all([
            prisma.commentLike.count({
              where: { commentId: comment.id }
            }),
            prisma.commentReport.count({
              where: { commentId: comment.id }
            })
          ]);

          return {
            ...comment,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
            user: comment.user || { email: '알 수 없음' },
            blog: comment.blog || { title: '삭제된 게시글' },
            parentComment: comment.parentComment || null,
            _count: {
              likes: likesCount,
              reports: reportsCount
            }
          };
        })),
        pagination: {
          page: page,
          pages: Math.ceil(totalCount / limit),
          total: totalCount,
          hasNext: skip + limit < totalCount,
          hasPrev: page > 1
        },
        statistics: {
          total: commentStats.totalComments,
          visible: commentStats.visibleComments,
          hidden: commentStats.hiddenComments,
          reported: commentStats.reportedComments
        }
      },
      cached: false,
      partialCacheHits,
      responseTime: `${(performance.now() - startTime).toFixed(2)}ms`
    };

    // 🚀 전체 결과 캐시 저장
    await cache.set(fullCacheKey, responseData, CACHE_TTL);

    const responseTime = (performance.now() - startTime).toFixed(2);
    console.log(`🎯 댓글 관리 로딩 완료: ${responseTime}ms (부분 히트: ${partialCacheHits})`);

    return NextResponse.json({
      ...responseData,
      cached: false,
      partialCacheHits,
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error('❌ 댓글 관리 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 🚀 최적화된 댓글 대량 상태 변경 (PATCH)
export async function PATCH(request: NextRequest) {
  const startTime = performance.now();
  const cache = CacheManager.getInstance();
  
  try {
    const body = await request.json();
    const { commentIds, action } = body;

    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return NextResponse.json(
        { success: false, message: '댓글 ID 목록이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!action || !['hide', 'show', 'delete'].includes(action)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 작업입니다.' },
        { status: 400 }
      );
    }

    let result;

    // 🎯 트랜잭션으로 안전한 처리
    switch (action) {
      case 'hide':
        result = await prisma.comment.updateMany({
          where: { id: { in: commentIds } },
          data: { isHidden: true, updatedAt: new Date() }
        });
        break;

      case 'show':
        result = await prisma.comment.updateMany({
          where: { id: { in: commentIds } },
          data: { isHidden: false, updatedAt: new Date() }
        });
        break;

      case 'delete':
        result = await prisma.$transaction(async (tx) => {
          // 🚀 병렬 삭제로 성능 최적화
          await Promise.all([
            tx.commentLike.deleteMany({
              where: { commentId: { in: commentIds } }
            }),
            tx.commentReport.deleteMany({
              where: { commentId: { in: commentIds } }
            })
          ]);
          
          return await tx.comment.deleteMany({
            where: { id: { in: commentIds } }
          });
        });
        break;
        
      default:
        return NextResponse.json(
          { success: false, message: '지원되지 않는 작업입니다.' },
          { status: 400 }
        );
    }

    // 🚀 관련 캐시 무효화
    await cache.invalidate('comment:');

    const endTime = performance.now();
    const actionKorean = action === 'hide' ? '숨김' : action === 'show' ? '표시' : '삭제';
    
    console.log(`🎯 댓글 ${actionKorean} 처리 완료: ${result.count}개, ${(endTime - startTime).toFixed(2)}ms`);
    
    return NextResponse.json({
      success: true,
      message: `${result.count}개의 댓글이 ${actionKorean} 처리되었습니다.`,
      data: {
        action,
        affectedCount: result.count,
        commentIds
      },
      responseTime: `${(endTime - startTime).toFixed(2)}ms`
    });

  } catch (error) {
    const endTime = performance.now();
    console.error('관리자 댓글 상태 변경 오류:', error);
    console.error(`⚠️ 댓글 상태 변경 실패: ${(endTime - startTime).toFixed(2)}ms`);
    
    return NextResponse.json(
      {
        success: false,
        message: '댓글 상태 변경에 실패했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

// 🚀 캐시 무효화 API (관리자용)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const cache = CacheManager.getInstance();
    await cache.clear();
    
    return NextResponse.json({ 
      success: true, 
      message: '댓글 관리 캐시가 무효화되었습니다.' 
    });
  } catch (error) {
    console.error('캐시 무효화 오류:', error);
    return NextResponse.json(
      { success: false, error: '캐시 무효화에 실패했습니다.' },
      { status: 500 }
    );
  }
} 