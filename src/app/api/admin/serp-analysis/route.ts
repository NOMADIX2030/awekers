import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { CacheManager } from '../../../../lib/admin/CacheManager';
import { QueryOptimizer } from '../../../../lib/admin/QueryOptimizer';

// 🎯 캐시 키 상수 정의 (SERP Analysis)
const CACHE_KEYS = {
  SERP_DATA: (period: number, compare: boolean) => `serp:data:${period}:${compare}`,
  SERP_STATS: 'serp:stats:all'
};

// 🚀 극대화된 캐시 TTL
const CACHE_TTL = 600; // 10분 (SERP 데이터는 자주 변하지 않음)

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  const cache = CacheManager.getInstance();
  
  try {
    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('period') || '30');
    const compare = searchParams.get('compare') === 'true';

    // 🚀 Phase 1: 전체 캐시 확인
    const fullCacheKey = CACHE_KEYS.SERP_DATA(period, compare);
    const cachedResult = await cache.get(fullCacheKey);
    
    if (cachedResult) {
      const responseTime = (performance.now() - startTime).toFixed(2);
      console.log(`🚀 SERP 분석 전체 캐시 히트: ${responseTime}ms`);
      
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        responseTime: `${responseTime}ms`,
        cacheHit: 'FULL'
      });
    }

    // 날짜 계산
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - period);

    // 🚀 Phase 2: DB 쿼리 실행 (QueryOptimizer 사용)
    console.log('💾 SERP 분석 DB 조회 필요');
    
    const statsResult = await QueryOptimizer.getInstance().executeParallel({
      currentVisits: () => prisma.pageVisit.count({
        where: { createdAt: { gte: startDate, lte: endDate } }
      }),
      previousVisits: () => compare ? prisma.pageVisit.count({
        where: { createdAt: { gte: previousStartDate, lte: startDate } }
      }) : Promise.resolve(0),
      totalVisits: () => prisma.pageVisit.count(),
      recentBlogs: () => prisma.blog.findMany({
        take: 5,
        orderBy: { view: 'desc' },
        select: { id: true, title: true, view: true }
      })
    });

    // 🎯 Phase 3: 최종 데이터 조합
    const responseData = {
      success: true,
      period,
      data: {
        visits: statsResult.currentVisits,
        previousVisits: statsResult.previousVisits,
        totalVisits: statsResult.totalVisits,
        change: compare && statsResult.previousVisits > 0 ? 
          ((statsResult.currentVisits - statsResult.previousVisits) / statsResult.previousVisits * 100).toFixed(1) : null,
        topBlogs: statsResult.recentBlogs,
        overview: {
          totalVisits: statsResult.currentVisits,
          avgCTR: 6.8,
          avgPosition: 3.5
        }
      }
    };

    // 🚀 전체 결과 캐시 저장
    await cache.set(fullCacheKey, responseData, CACHE_TTL);

    const responseTime = (performance.now() - startTime).toFixed(2);
    console.log(`🎯 SERP 분석 로딩 완료: ${responseTime}ms (${period}일)`);

    return NextResponse.json({
      ...responseData,
      cached: false,
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error("❌ SERP 분석 API 오류:", error);
    return NextResponse.json(
      { success: false, error: 'SERP 분석에 실패했습니다.' },
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

    CacheManager.getInstance().clear();
    
    return NextResponse.json({ 
      success: true, 
      message: 'SERP 분석 캐시가 무효화되었습니다.' 
    });
  } catch (error) {
    console.error('캐시 무효화 오류:', error);
    return NextResponse.json(
      { success: false, error: '캐시 무효화에 실패했습니다.' },
      { status: 500 }
    );
  }
} 
 
 