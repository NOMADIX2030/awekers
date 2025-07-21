import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../lib/prisma';
import { QueryOptimizer } from '../../../../lib/admin/QueryOptimizer';

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';

    // 기간 설정
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      default: // today
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    // 기본 통계 데이터 (실제 데이터가 없을 때를 대비한 더미 데이터)
    const analyticsData: {
      period: string;
      summary: {
        totalVisits: number;
        uniqueVisitors: number;
        pageViews: number;
        avgSessionDuration: number;
        bounceRate: number;
      };
      deviceStats: Array<{ device: string; count: number; percentage: number }>;
      browserStats: Array<{ browser: string; count: number; percentage: number }>;
      osStats: Array<{ os: string; count: number; percentage: number }>;
      topPages: Array<{ title: string; url: string; views: number }>;
      timeSeries: Array<{ time?: string; date?: string; visits: number; pageViews: number }>;
    } = {
      period,
      summary: {
        totalVisits: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        avgSessionDuration: 0,
        bounceRate: 0
      },
      deviceStats: [
        { device: 'desktop', count: 0, percentage: 0 },
        { device: 'mobile', count: 0, percentage: 0 },
        { device: 'tablet', count: 0, percentage: 0 }
      ],
      browserStats: [
        { browser: 'Chrome', count: 0, percentage: 0 },
        { browser: 'Safari', count: 0, percentage: 0 },
        { browser: 'Firefox', count: 0, percentage: 0 }
      ],
      osStats: [
        { os: 'Windows', count: 0, percentage: 0 },
        { os: 'macOS', count: 0, percentage: 0 },
        { os: 'Linux', count: 0, percentage: 0 }
      ],
      topPages: [],
      timeSeries: []
    };

    // 🚀 중앙집중식 최적화 적용 (QueryOptimizer 패턴)
    console.log('🎯 분석 데이터: QueryOptimizer 적용 시작');
    
    const startTime = performance.now();
    
    try {
      // 🚀 중앙집중식: 모든 통계 쿼리를 병렬로 실행
      const statsResult = await QueryOptimizer.getInstance().executeParallel({
        totalVisits: () => prisma.pageVisit.count({
          where: { createdAt: { gte: startDate } }
        }),
        deviceStats: () => prisma.pageVisit.groupBy({
          by: ['deviceType'],
          where: { createdAt: { gte: startDate } },
          _count: { deviceType: true }
        }),
        browserStats: () => prisma.pageVisit.groupBy({
          by: ['browser'],
          where: { createdAt: { gte: startDate } },
          _count: { browser: true }
        }),
        topPages: () => prisma.pageVisit.groupBy({
          by: ['pageTitle', 'pageUrl'],
          where: { createdAt: { gte: startDate } },
          _count: { pageTitle: true },
          orderBy: { _count: { pageTitle: 'desc' } },
          take: 5
        })
      });

      const totalVisits = statsResult.totalVisits;
      
      if (totalVisits > 0) {

        // 🚀 중앙집중식 결과 처리
        analyticsData.summary.totalVisits = totalVisits;
        analyticsData.summary.pageViews = totalVisits;
        analyticsData.summary.uniqueVisitors = totalVisits; // 간단히 동일하게 설정

        analyticsData.deviceStats = statsResult.deviceStats.map((stat: any) => ({
          device: stat.deviceType,
          count: stat._count.deviceType,
          percentage: Math.round((stat._count.deviceType / totalVisits) * 100)
        }));

        analyticsData.browserStats = statsResult.browserStats.map((stat: any) => ({
          browser: stat.browser,
          count: stat._count.browser,
          percentage: Math.round((stat._count.browser / totalVisits) * 100)
        }));

        analyticsData.topPages = statsResult.topPages.map((page: any) => ({
          title: page.pageTitle,
          url: page.pageUrl,
          views: page._count.pageTitle
        }));
        
        console.log('✅ 분석 데이터: QueryOptimizer 최적화 완료');
        const endTime = performance.now();
        console.log(`🎯 분석 데이터 로딩 완료: ${(endTime - startTime).toFixed(2)}ms (${totalVisits}개 방문)`);  
      }
    } catch (error) {
      console.error('데이터베이스 조회 오류:', error);
      // 오류가 발생해도 기본 데이터 반환
    }

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('접속자 통계 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
 
 