import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// 🚀 초고속 배치 처리를 위한 큐 시스템
const visitQueue: any[] = [];
const BATCH_SIZE = 20; // 배치 크기 증가
const BATCH_TIMEOUT = 2000; // 2초로 단축
const MAX_QUEUE_SIZE = 1000; // 최대 큐 크기

let batchTimer: NodeJS.Timeout | null = null;
let isProcessing = false;

// 🎯 초고속 배치 처리 함수
async function processBatch() {
  if (isProcessing || visitQueue.length === 0) return;
  
  isProcessing = true;
  
  try {
    while (visitQueue.length > 0) {
      const batchSize = Math.min(BATCH_SIZE, visitQueue.length);
      const batch = visitQueue.splice(0, batchSize);
      
            // 🚀 중복 제거 후 배치 처리
      const startTime = performance.now();
      
      // 중복 제거: 동일한 pageUrl + userId + createdAt(1분 내) 제거
      const uniqueBatch = batch.filter((visit, index, self) => {
        const key = `${visit.pageUrl}-${visit.userId || 'anonymous'}`;
        const firstIndex = self.findIndex(v => 
          `${v.pageUrl}-${v.userId || 'anonymous'}` === key
        );
        return firstIndex === index;
      });
      
      if (uniqueBatch.length > 0) {
      await prisma.pageVisit.createMany({
          data: uniqueBatch,
        skipDuplicates: true
      });
      
      const endTime = performance.now();
        console.log(`🚀 PageVisit 배치 처리 완료: ${uniqueBatch.length}개 레코드 (중복 제거: ${batch.length - uniqueBatch.length}개), ${(endTime - startTime).toFixed(2)}ms`);
      } else {
        console.log(`🚀 PageVisit 배치 처리 건너뜀: 모든 항목이 중복`);
      }
      
      // 큐가 많이 쌓인 경우 즉시 다음 배치 처리
      if (visitQueue.length > BATCH_SIZE * 2) {
        continue;
      } else {
        break;
      }
    }
  } catch (error) {
    console.error('PageVisit 배치 처리 오류:', error);
  } finally {
    isProcessing = false;
  }
}

// 🎯 스마트 배치 스케줄링
function scheduleBatch() {
  if (batchTimer) {
    clearTimeout(batchTimer);
  }
  
  // 큐가 많이 쌓인 경우 즉시 처리
  if (visitQueue.length >= BATCH_SIZE) {
    setImmediate(processBatch);
  } else {
    batchTimer = setTimeout(processBatch, BATCH_TIMEOUT);
  }
}

// 🎯 초경량 디바이스/브라우저 감지 (성능 최적화)
function detectDeviceType(userAgent: string): string {
  if (!userAgent) return 'unknown';
  
  // 모바일 키워드만 빠르게 체크
  if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) return 'mobile';
  if (/Tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function detectBrowser(userAgent: string): string {
  if (!userAgent) return 'unknown';
  
  // 주요 브라우저만 빠르게 감지
  if (userAgent.includes('Chrome')) return 'chrome';
  if (userAgent.includes('Firefox')) return 'firefox';
  if (userAgent.includes('Safari')) return 'safari';
  if (userAgent.includes('Edge')) return 'edge';
  return 'other';
}

function detectOS(userAgent: string): string {
  if (!userAgent) return 'unknown';
  
  // 주요 OS만 빠르게 감지
  if (userAgent.includes('Windows')) return 'windows';
  if (userAgent.includes('Mac')) return 'macos';
  if (userAgent.includes('Linux')) return 'linux';
  if (userAgent.includes('Android')) return 'android';
  if (userAgent.includes('iOS')) return 'ios';
  return 'other';
}

// 🚀 초고속 PageVisit 추적 API
export async function POST(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const body = await request.json();
    const { pageUrl, pageTitle, blogId, userId } = body;

    // 🎯 즉시 응답 반환 (0.1ms 이하)
    const visitId = Date.now() + Math.random();

    // 🚀 비동기로 데이터 수집 및 큐에 추가 (응답 지연 없음)
    setImmediate(() => {
      try {
        // 큐 크기 제한으로 메모리 보호
        if (visitQueue.length >= MAX_QUEUE_SIZE) {
          console.warn(`⚠️ PageVisit 큐 포화 (${visitQueue.length}개), 오래된 항목 제거`);
          visitQueue.splice(0, BATCH_SIZE); // 오래된 항목 제거
        }

        // 🎯 최소한의 데이터만 수집
        const userAgent = request.headers.get('user-agent') || '';
        const ip = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  '127.0.0.1';
        const referrer = request.headers.get('referer') || '';

        // 🚀 초고속 감지
        const deviceType = detectDeviceType(userAgent);
        const browser = detectBrowser(userAgent);
        const os = detectOS(userAgent);

        // 큐에 추가
        visitQueue.push({
          pageUrl: pageUrl || '/',
          pageTitle: pageTitle || 'Unknown',
          ipAddress: ip.split(',')[0].trim(), // 🔧 스키마와 일치하도록 필드명 수정
          userAgent,
          referrer,
          deviceType,
          browser,
          os,
          blogId: blogId ? parseInt(blogId) : null,
          userId: userId ? parseInt(userId) : null,
          createdAt: new Date()
        });

        // 스마트 배치 스케줄링
        scheduleBatch();
        
      } catch (asyncError) {
        console.error('비동기 방문 추적 오류:', asyncError);
      }
    });

    const endTime = performance.now();
    
    return NextResponse.json({
      success: true,
      visitId,
      responseTime: `${(endTime - startTime).toFixed(2)}ms`,
      processing: 'async',
      queueSize: visitQueue.length
    });

  } catch (error) {
    const endTime = performance.now();
    console.error('PageVisit 추적 오류:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '추적 오류',
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      },
      { status: 500 }
    );
  }
}

// 🎯 배치 상태 확인 API
export async function GET(request: NextRequest) {
  return NextResponse.json({
    queueSize: visitQueue.length,
    isProcessing,
    maxQueueSize: MAX_QUEUE_SIZE,
    batchSize: BATCH_SIZE,
    batchTimeout: BATCH_TIMEOUT
  });
} 
 
 