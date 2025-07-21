import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { CacheManager } from '../../../../lib/admin/CacheManager';
import { QueryOptimizer } from '../../../../lib/admin/QueryOptimizer';

// 🎯 캐시 키 상수 정의 (Inquiries Management)  
const CACHE_KEYS = {
  INQUIRY_LIST: (page: number, limit: number, status?: string, serviceType?: string, search?: string) => 
    `inquiry:list:${page}:${limit}:${status || 'all'}:${serviceType || 'all'}:${search || 'none'}`,
  INQUIRY_STATS: 'inquiry:stats:all'
};

// 🚀 극대화된 캐시 TTL
const CACHE_TTL = 300; // 5분 (문의는 자주 변경)

// 관리자 인증 체크
function checkAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const adminKey = process.env.ADMIN_API_KEY || 'admin-key';
  
  return authHeader === `Bearer ${adminKey}`;
}

// GET 요청 - 관리자용 문의 목록 조회 (Cache-First 최적화)
export async function GET(req: NextRequest) {
  const startTime = performance.now();
  const cache = CacheManager.getInstance();
  
  try {
    // 관리자 인증 체크
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const serviceType = searchParams.get('serviceType');
    const search = searchParams.get('search');

    // 🚀 Phase 1: 전체 캐시 확인
    const fullCacheKey = CACHE_KEYS.INQUIRY_LIST(page, limit, status || undefined, serviceType || undefined, search || undefined);
    const cachedResult = await cache.get(fullCacheKey);
    
    if (cachedResult) {
      const responseTime = (performance.now() - startTime).toFixed(2);
      console.log(`🚀 문의 관리 전체 캐시 히트: ${responseTime}ms`);
      
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        responseTime: `${responseTime}ms`,
        cacheHit: 'FULL'
      });
    }

    // 🎯 Phase 2: 개별 캐시 확인
    const [cachedStats] = await Promise.all([
      cache.get(CACHE_KEYS.INQUIRY_STATS)
    ]);

    let partialCacheHits = 0;
    let dbQueries = [];

    // 통계 데이터
    let inquiryStats = cachedStats;
    if (!inquiryStats) {
      console.log('💾 문의 통계 DB 조회 필요');
      dbQueries.push(
        prisma.inquiry.groupBy({
          by: ['status'],
          _count: { status: true }
        }),
        prisma.inquiry.groupBy({
          by: ['serviceType'],
          _count: { serviceType: true }
        })
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 문의 통계 캐시 히트');
    }

    const skip = (page - 1) * limit;

    // 필터 조건 구성
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (serviceType) {
      where.serviceType = serviceType;
    }
    
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm } },
        { email: { contains: searchTerm } },
        { message: { contains: searchTerm } }
      ];
    }

    // 🚀 Phase 3: 필요한 DB 쿼리만 실행
    const allQueries = [
      // 문의 목록 (항상 실행)
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
              select: {
        id: true,
        referenceNo: true,
        name: true,
        email: true,
          serviceType: true,
          status: true,
        message: true,
        createdAt: true,
          updatedAt: true
        }
      }),
      // 총 개수 (항상 실행)
      prisma.inquiry.count({ where }),
      ...dbQueries
    ];

    console.log(`🔍 문의 관리 API: ${allQueries.length}개 쿼리 실행`);
    const results = await Promise.all(allQueries);
    
    const inquiries = results[0] as any[];
    const totalCount = results[1] as number;
    let resultIndex = 2;

    // 조건부 결과 할당
    if (!inquiryStats) {
      const statusStats = results[resultIndex++] as any[];
      const serviceTypeStats = results[resultIndex++] as any[];
      
      inquiryStats = { statusStats, serviceTypeStats };
      await cache.set(CACHE_KEYS.INQUIRY_STATS, inquiryStats, CACHE_TTL);
    }

    // 🎯 Phase 4: 최종 데이터 조합
    const responseData = {
      success: true,
      data: {
        inquiries: inquiries.map(inquiry => ({
          ...inquiry,
          createdAt: inquiry.createdAt.toISOString(),
          updatedAt: inquiry.updatedAt.toISOString()
        })),
      pagination: {
          page: page,
          pages: Math.ceil(totalCount / limit),
          total: totalCount,
          hasNext: skip + limit < totalCount,
          hasPrev: page > 1
        },
        statistics: {
          byStatus: inquiryStats.statusStats,
          byServiceType: inquiryStats.serviceTypeStats
        }
      }
    };

    // 🚀 전체 결과 캐시 저장
    await cache.set(fullCacheKey, responseData, CACHE_TTL);

    const responseTime = (performance.now() - startTime).toFixed(2);
    console.log(`🎯 문의 관리 로딩 완료: ${responseTime}ms (부분 히트: ${partialCacheHits})`);
    
    return NextResponse.json({
      ...responseData,
      cached: false,
      partialCacheHits,
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error("❌ 문의 관리 API 오류:", error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 통계만 조회하는 별도 엔드포인트 (대시보드용)
export async function POST(req: NextRequest) {
  try {
    // 관리자 인증 체크
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'getStats') {
      // 🚀 중앙집중식: 모든 통계 쿼리를 한 번에 처리
      console.log('🎯 문의 통계: QueryOptimizer 적용 시작');
      
      const statsResult = await QueryOptimizer.getInstance().executeParallel({
        totalCount: () => prisma.inquiry.count(),
        statusStats: () => prisma.inquiry.groupBy({
        by: ['status'],
          _count: { id: true }
        }),
        recentInquiries: () => prisma.inquiry.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        serviceCounts: () => prisma.inquiry.groupBy({
          by: ['serviceType'],
          _count: { id: true },
          orderBy: {
            _count: { id: 'desc' }
          }
        })
      });

      // 🚀 중앙집중식 결과 처리
      const stats = statsResult.statusStats.reduce((acc: Record<string, number>, item: any) => {
        acc[item.status.toLowerCase()] = item._count.id;
        return acc;
      }, {} as Record<string, number>);

      console.log('✅ 문의 통계: QueryOptimizer 최적화 완료');

      return NextResponse.json({
        success: true,
        data: {
          total: statsResult.totalCount,
          pending: stats.pending || 0,
          processing: stats.processing || 0,
          completed: stats.completed || 0,
          cancelled: stats.cancelled || 0,
          recent: statsResult.recentInquiries,
          services: statsResult.serviceCounts.map((item: any) => ({
            name: item.serviceType,
            count: item._count.id
          }))
        }
      });
    }

    return NextResponse.json(
      { success: false, error: '지원하지 않는 액션입니다.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('문의 통계 조회 중 오류 발생:', error);
    
    return NextResponse.json(
      { success: false, error: '통계를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 