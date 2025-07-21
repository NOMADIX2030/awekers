import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserRole, canAccessMenu, UserRole, VisibilityLevel } from "@/lib/auth";

// 🚀 Redis 캐싱 시스템 추가 (선택적 의존성)
let redis: any = null;

// Redis 클라이언트 초기화 (선택적)
async function getRedisClient() {
  if (!redis && process.env.REDIS_URL) {
    try {
      // Redis 모듈이 설치되어 있는지 확인하고 동적으로 로드
      const redisModule = await eval('import("redis")').catch(() => null);
      
      if (redisModule && redisModule.createClient) {
        redis = redisModule.createClient({
          url: process.env.REDIS_URL
        });
        await redis.connect();
        console.log('🚀 Redis 연결 성공');
      } else {
        console.warn('Redis 모듈을 찾을 수 없습니다. 메모리 캐시를 사용합니다.');
        redis = null;
      }
    } catch (error) {
      console.warn('Redis 연결 실패 또는 모듈 없음, 메모리 캐시 사용:', error);
      redis = null;
    }
  }
  return redis;
}

// 🎯 다중 레이어 캐시 시스템 (L1: 메모리, L2: Redis)
const L1_CACHE = new Map(); // L1 캐시 (메모리)
const L1_TTL = 30 * 1000; // L1 캐시: 30초
const L2_TTL = 300; // L2 캐시 (Redis): 5분

// 🚀 스마트 캐시 관리
class SmartCache {
  static async get(key: string) {
    // L1 캐시 확인
    const l1Data = L1_CACHE.get(key);
    if (l1Data && Date.now() - l1Data.timestamp < L1_TTL) {
      return { data: l1Data.data, source: 'L1' };
    }

    // L2 캐시 (Redis) 확인
    const redisClient = await getRedisClient();
    if (redisClient) {
      try {
        const l2Data = await redisClient.get(key);
        if (l2Data) {
          const parsedData = JSON.parse(l2Data);
          // L1 캐시에도 저장
          L1_CACHE.set(key, { data: parsedData, timestamp: Date.now() });
          return { data: parsedData, source: 'L2' };
        }
      } catch (error) {
        console.warn('Redis 읽기 실패:', error);
      }
    }

    return null;
  }

  static async set(key: string, data: any) {
    // L1 캐시에 저장
    L1_CACHE.set(key, { data, timestamp: Date.now() });

    // L2 캐시 (Redis)에 저장
    const redisClient = await getRedisClient();
    if (redisClient) {
      try {
        await redisClient.setEx(key, L2_TTL, JSON.stringify(data));
      } catch (error) {
        console.warn('Redis 쓰기 실패:', error);
      }
    }
  }

  static async invalidate(pattern: string) {
    // L1 캐시 무효화
    for (const key of L1_CACHE.keys()) {
      if (key.includes(pattern)) {
        L1_CACHE.delete(key);
      }
    }

    // L2 캐시 무효화
    const redisClient = await getRedisClient();
    if (redisClient) {
      try {
        const keys = await redisClient.keys(`*${pattern}*`);
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      } catch (error) {
        console.warn('Redis 무효화 실패:', error);
      }
    }
  }
}

// 활성화된 메뉴 목록 조회 (공개 API) - 하위메뉴 포함, 권한별 필터링
export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    // 사용자 권한 확인
    const userRole = getUserRole(request);
    
    // 🎯 스마트 캐시 키 생성
    const cacheKey = `menu_v2_${userRole}`;
    
    // 🚀 다중 레이어 캐시에서 확인 (극한 최적화)
    const cachedResult = await SmartCache.get(cacheKey);
    if (cachedResult) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`🚀 ${cachedResult.source} 캐시 히트 (극한 최적화): ${responseTime.toFixed(2)}ms`);
      
      return NextResponse.json({
        success: true,
        data: cachedResult.data.menus,
        userRole: cachedResult.data.userRole,
        accessibleLevels: cachedResult.data.accessibleLevels,
        cached: true,
        cacheSource: cachedResult.source,
        responseTime: `${responseTime.toFixed(2)}ms`
      });
    }

    // 캐시 미스 로그 추가 (디버깅용)
    console.log(`💨 캐시 미스 (극한 최적화): ${cacheKey} (${(performance.now() - startTime).toFixed(3)}ms)`);
    console.log('💾 메뉴 목록 DB 조회 필요');
    
    // 🎯 사용자 권한에 따라 접근 가능한 메뉴만 조회 (최적화된 쿼리)
    const accessibleLevels = [];
    if (canAccessMenu(userRole, VisibilityLevel.GUEST)) {
      accessibleLevels.push('GUEST');
    }
    if (canAccessMenu(userRole, VisibilityLevel.USER)) {
      accessibleLevels.push('USER');
    }
    if (canAccessMenu(userRole, VisibilityLevel.ADMIN)) {
      accessibleLevels.push('ADMIN');
    }

    // 🚀 최적화된 단일 쿼리 (JOIN 사용) - 필드 최소화
    const menus = await prisma.menu.findMany({
      select: {
        id: true,
        label: true,
        href: true,
        order: true,
        visibilityLevel: true,
        subMenus: {
          select: {
            id: true,
            label: true,
            href: true,
            icon: true,
            order: true,
            visibilityLevel: true
          },
          where: {
            isActive: true,
            visibilityLevel: {
              in: accessibleLevels as any[]
            }
          },
          orderBy: {
            order: 'asc'
          },
          take: 10 // 하위메뉴 최대 10개로 제한
        }
      },
      where: {
        isActive: true,
        visibilityLevel: {
          in: accessibleLevels as any[]
        }
      },
      orderBy: {
        order: 'asc'
      },
      take: 20 // 메뉴 최대 20개로 제한
    });

    const responseData = {
      menus,
      userRole,
      accessibleLevels
    };

    // 🚀 스마트 캐시에 저장
    await SmartCache.set(cacheKey, responseData);

    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // 디버깅을 위한 로그
    console.log(`🎯 메뉴 로딩 완료: ${responseTime.toFixed(2)}ms (사용자: ${userRole}, 메뉴: ${menus.length}개)`);

    return NextResponse.json({
      success: true,
      data: menus,
      userRole,
      accessibleLevels,
      cached: false,
      responseTime: `${responseTime.toFixed(2)}ms`
    });
  } catch (error) {
    const endTime = performance.now();
    console.error('메뉴 조회 오류:', error);
    console.error(`⚠️ 메뉴 로딩 실패: ${(endTime - startTime).toFixed(2)}ms`);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '메뉴 조회에 실패했습니다.',
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      },
      { status: 500 }
    );
  }
}

// 🚀 캐시 무효화 API (관리자용)
export async function DELETE(request: NextRequest) {
  try {
    const userRole = getUserRole(request);
    
    // 관리자만 캐시 무효화 가능
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    await SmartCache.invalidate('menu');
    
    return NextResponse.json({ 
      success: true, 
      message: '메뉴 캐시가 무효화되었습니다.' 
    });
  } catch (error) {
    console.error('캐시 무효화 오류:', error);
    return NextResponse.json(
      { success: false, error: '캐시 무효화에 실패했습니다.' },
      { status: 500 }
    );
  }
} 