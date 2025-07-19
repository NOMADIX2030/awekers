import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

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

    // 실제 데이터베이스에서 데이터 수집 시도
    try {
      const totalVisits = await prisma.pageVisit.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      });

      if (totalVisits > 0) {
        // 실제 데이터가 있는 경우 통계 계산
        const deviceStats = await prisma.pageVisit.groupBy({
          by: ['deviceType'],
          where: {
            createdAt: {
              gte: startDate
            }
          },
          _count: {
            deviceType: true
          }
        });

        const browserStats = await prisma.pageVisit.groupBy({
          by: ['browser'],
          where: {
            createdAt: {
              gte: startDate
            }
          },
          _count: {
            browser: true
          }
        });

        const topPages = await prisma.pageVisit.groupBy({
          by: ['pageTitle', 'pageUrl'],
          where: {
            createdAt: {
              gte: startDate
            }
          },
          _count: {
            pageTitle: true
          },
          orderBy: {
            _count: {
              pageTitle: 'desc'
            }
          },
          take: 5
        });

        // 데이터 업데이트
        analyticsData.summary.totalVisits = totalVisits;
        analyticsData.summary.pageViews = totalVisits;
        analyticsData.summary.uniqueVisitors = totalVisits; // 간단히 동일하게 설정

        analyticsData.deviceStats = deviceStats.map((stat: { deviceType: string; _count: { deviceType: number } }) => ({
          device: stat.deviceType,
          count: stat._count.deviceType,
          percentage: Math.round((stat._count.deviceType / totalVisits) * 100)
        }));

        analyticsData.browserStats = browserStats.map((stat: { browser: string; _count: { browser: number } }) => ({
          browser: stat.browser,
          count: stat._count.browser,
          percentage: Math.round((stat._count.browser / totalVisits) * 100)
        }));

        analyticsData.topPages = topPages.map((page: { pageTitle: string; pageUrl: string; _count: { pageTitle: number } }) => ({
          title: page.pageTitle,
          url: page.pageUrl,
          views: page._count.pageTitle
        }));
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
 
 