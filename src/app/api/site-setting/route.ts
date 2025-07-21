import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CacheManager } from '@/lib/admin/CacheManager';

// 🎯 캐시 키 상수 정의 (Site Settings)
const CACHE_KEYS = {
  SETTINGS_ALL: 'settings:all'
};

// 🚀 극대화된 캐시 TTL
const CACHE_TTL = 3600; // 1시간 (설정은 자주 변경되지 않음)

// GET: 모든 사이트 설정값 반환 (Cache-First 최적화)
export async function GET() {
  const startTime = performance.now();
  const cache = CacheManager.getInstance();
  
  try {
    // 🚀 Phase 1: 전체 캐시 확인
    const cachedResult = await cache.get(CACHE_KEYS.SETTINGS_ALL);
    if (cachedResult) {
      const responseTime = (performance.now() - startTime).toFixed(2);
      console.log(`🚀 사이트 설정 전체 캐시 히트: ${responseTime}ms`);
      
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        responseTime: `${responseTime}ms`,
        cacheHit: 'FULL'
      });
    }

    // 🎯 Phase 2: DB 쿼리 실행
    console.log('💾 사이트 설정 DB 조회 필요');
    const settings = await prisma.siteSetting.findMany();
    
    // key-value 객체로 변환
    const result: Record<string, string> = {};
    settings.forEach((s) => { result[s.key] = s.value; });

    // 🚀 전체 결과 캐시 저장
    await cache.set(CACHE_KEYS.SETTINGS_ALL, result, CACHE_TTL);

    const responseTime = (performance.now() - startTime).toFixed(2);
    console.log(`🎯 사이트 설정 로딩 완료: ${responseTime}ms (${settings.length}개 설정)`);

    return NextResponse.json(result);
    
  } catch (error) {
    console.error("❌ 사이트 설정 API 오류:", error);
    return NextResponse.json(
      { success: false, error: '설정 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 설정값 저장/수정 (body: { key, value })
export async function POST(req: NextRequest) {
  const cache = CacheManager.getInstance();
  
  try {
    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ error: 'key는 필수입니다.' }, { status: 400 });
    
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // 🚀 캐시 무효화 (설정 변경시)
    await cache.invalidate('settings:');
    console.log('✅ 사이트 설정 캐시 무효화 완료');

    return NextResponse.json(setting);
    
  } catch (error) {
    console.error("❌ 사이트 설정 저장 오류:", error);
    return NextResponse.json(
      { success: false, error: '설정 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
} 