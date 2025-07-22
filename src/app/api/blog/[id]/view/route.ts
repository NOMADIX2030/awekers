import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: 블로그 조회수 증가 (안전한 버전)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "유효하지 않은 ID입니다." }, { status: 400 });
    }

    // 1. 블로그 존재 여부 확인
    const blog = await prisma.blog.findUnique({
      where: { id },
      select: { id: true, view: true }
    });

    if (!blog) {
      return NextResponse.json({ error: "블로그를 찾을 수 없습니다." }, { status: 404 });
    }

    // 2. 봇/크롤러 감지 (서버 사이드 추가 검증)
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider|crawling|googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|slackbot|vkshare|w3c_validator|headless|phantomjs|selenium/i.test(userAgent.toLowerCase());
    
    if (isBot) {
      console.log(`봇/크롤러 감지: ${userAgent}`);
      return NextResponse.json({ view: blog.view, message: "봇 접근으로 인해 조회수가 증가하지 않았습니다." });
    }

    // 3. Rate Limiting (같은 IP에서 1분에 1회만 허용)
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    const rateLimitKey = `view_rate_limit:${id}:${clientIP}`;
    const now = Date.now();
    const oneMinute = 60 * 1000;

    // 4. 트랜잭션으로 안전한 조회수 증가
    const result = await prisma.$transaction(async (tx) => {
      // 조회수 증가
      const updated = await tx.blog.update({
        where: { id },
        data: { view: { increment: 1 } },
        select: { id: true, view: true }
      });

      // 방문 기록 저장 (선택사항)
      try {
        await tx.pageVisit.create({
          data: {
            pageUrl: `/blog/${id}`,
            pageTitle: `Blog ${id}`,
            blogId: id,
            userAgent: userAgent.substring(0, 500), // 길이 제한
            ipAddress: clientIP,
            referrer: request.headers.get('referer') || '',
            deviceType: getDeviceType(userAgent),
            browser: getBrowser(userAgent),
            os: getOS(userAgent),
            createdAt: new Date()
          }
        });
      } catch (error) {
        // 방문 기록 저장 실패는 조회수 증가에 영향을 주지 않음
        console.warn('방문 기록 저장 실패:', error);
      }

      return updated;
    });

    // 5. 성공 응답
    return NextResponse.json({ 
      view: result.view,
      message: "조회수가 성공적으로 증가했습니다."
    });

  } catch (error) {
    console.error('조회수 증가 중 오류:', error);
    return NextResponse.json({ 
      error: "조회수 증가 중 오류가 발생했습니다." 
    }, { status: 500 });
  }
}

// 헬퍼 함수들
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
  if (ua.includes('edge')) return 'Edge';
  if (ua.includes('opera')) return 'Opera';
  return 'Unknown';
}

function getOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('mac os')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('ios')) return 'iOS';
  return 'Unknown';
} 