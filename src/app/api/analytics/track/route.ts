import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// 디바이스 타입 감지 함수
function detectDeviceType(userAgent: string): string {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i;
  
  if (tabletRegex.test(userAgent)) return 'tablet';
  if (mobileRegex.test(userAgent)) return 'mobile';
  return 'desktop';
}

// 브라우저 감지 함수
function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

// OS 감지 함수
function detectOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageUrl, pageTitle, blogId, userId } = body;
    
    // 클라이언트 정보 수집
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const referrer = request.headers.get('referer') || null;
    
    // 디바이스 정보 분석
    const deviceType = detectDeviceType(userAgent);
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);
    
    // 접속 기록 저장
    const visit = await prisma.pageVisit.create({
      data: {
        pageUrl,
        pageTitle,
        userId: userId ? parseInt(userId) : null,
        blogId: blogId ? parseInt(blogId) : null,
        userAgent,
        ipAddress,
        referrer,
        deviceType,
        browser,
        os,
        country: null,
        city: null
      }
    });
    
    return NextResponse.json({ success: true, visitId: visit.id });
  } catch (error) {
    console.error('접속 추적 오류:', error);
    return NextResponse.json(
      { error: '접속 추적 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
 
 