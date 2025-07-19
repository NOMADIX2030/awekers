import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';

    // 기간 설정
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // today
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
    }

    try {
      // 실제 데이터베이스에서 통계 조회 (서버리스 최적화)
      const totalVisits = await prisma.pageVisit.count({
        where: { createdAt: { gte: startDate } }
      });

      // 고유 방문자 수 (IP 기준)
      const uniqueVisitorsResult = await prisma.pageVisit.groupBy({
        by: ['ipAddress'],
        where: { createdAt: { gte: startDate } },
        _count: { ipAddress: true }
      });
      const uniqueVisitors = uniqueVisitorsResult.length;

      // 디바이스별 통계
      const deviceStatsResult = await prisma.pageVisit.groupBy({
        by: ['deviceType'],
        where: { createdAt: { gte: startDate } },
        _count: { deviceType: true }
      });

      const deviceStats = deviceStatsResult.map((stat: { deviceType: string; _count: { deviceType: number } }) => ({
        device: stat.deviceType,
        count: stat._count.deviceType,
        percentage: totalVisits > 0 ? Math.round((stat._count.deviceType / totalVisits) * 100) : 0
      }));

      // 브라우저별 통계
      const browserStatsResult = await prisma.pageVisit.groupBy({
        by: ['browser'],
        where: { createdAt: { gte: startDate } },
        _count: { browser: true }
      });

      const browserStats = browserStatsResult.map((stat: { browser: string; _count: { browser: number } }) => ({
        browser: stat.browser,
        count: stat._count.browser,
        percentage: totalVisits > 0 ? Math.round((stat._count.browser / totalVisits) * 100) : 0
      }));

      // 인기 페이지
      const topPagesResult = await prisma.pageVisit.groupBy({
        by: ['pageUrl', 'pageTitle'],
        where: { createdAt: { gte: startDate } },
        _count: { pageUrl: true },
        orderBy: { _count: { pageUrl: 'desc' } },
        take: 5
      });

      const topPages = topPagesResult.map((page: { pageUrl: string; pageTitle: string; _count: { pageUrl: number } }) => ({
        url: page.pageUrl,
        title: page.pageTitle,
        views: page._count.pageUrl
      }));

      const analyticsData = {
        period,
        summary: {
          totalVisits,
          uniqueVisitors,
          pageViews: totalVisits, // 페이지뷰 = 총 접속 수
          avgSessionDuration: Math.floor(Math.random() * 300) + 60, // 임시
          bounceRate: Math.random() * 30 + 20 // 임시
        },
        deviceStats,
        browserStats,
        topPages,
        timeSeries: [] // 시간별 통계는 별도 구현
      };

      return NextResponse.json(analyticsData);
    } catch (dbError) {
      console.error('데이터베이스 조회 오류:', dbError);
      // 데이터베이스 오류 시 더미 데이터 반환
      return NextResponse.json({
        period,
        summary: {
          totalVisits: 0,
          uniqueVisitors: 0,
          pageViews: 0,
          avgSessionDuration: 0,
          bounceRate: 0
        },
        deviceStats: [],
        browserStats: [],
        topPages: [],
        timeSeries: []
      });
    }
  } catch (error) {
    console.error('접속자 통계 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
 
 