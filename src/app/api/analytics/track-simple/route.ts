import { NextRequest, NextResponse } from 'next/server';

// 디바이스 타입 감지
function detectDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

// 브라우저 감지
function detectBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/edge/i.test(userAgent)) return 'Edge';
  return 'Other';
}

// OS 감지
function detectOS(userAgent: string): string {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/macintosh|mac os x/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/ios/i.test(userAgent)) return 'iOS';
  return 'Other';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageUrl, pageTitle, blogId, userId } = body;
    
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const referrer = request.headers.get('referer') || null;
    
    const deviceType = detectDeviceType(userAgent);
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);
    
    // 서버리스 환경 최적화: 로깅 + 주기적 배치 저장
    const visitData = {
      pageUrl,
      pageTitle,
      blogId: blogId ? parseInt(blogId) : null,
      userId: userId ? parseInt(userId) : null,
      userAgent,
      ipAddress,
      referrer,
      deviceType,
      browser,
      os,
      timestamp: new Date().toISOString()
    };
    
    // 1. 즉시 로깅 (빠른 응답)
    console.log('Page Visit:', visitData);
    
    // 2. 주기적 배치 저장을 위한 큐 시스템 (실제로는 Redis, SQS 등 사용)
    // 현재는 로깅만 하고, 별도 배치 작업에서 처리
    
    // 3. Vercel Analytics와 연동 (권장)
    // @vercel/analytics가 자동으로 처리
    
    return NextResponse.json({ 
      success: true, 
      message: '접속이 기록되었습니다.',
      data: {
        deviceType,
        browser,
        os,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('접속 추적 오류:', error);
    return NextResponse.json(
      { error: '접속 추적 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
 
 