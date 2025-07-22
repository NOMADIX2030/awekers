import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { CacheManager } from '../../../../lib/admin/CacheManager';
import { QueryOptimizer } from '../../../../lib/admin/QueryOptimizer';

// 🎯 캐시 키 상수 정의 (Menu Management)
const CACHE_KEYS = {
  MENU_LIST: 'menu:list:all',
  MENU_STATS: 'menu:stats:all'
};

// 🚀 극대화된 캐시 TTL
const CACHE_TTL = 1800; // 30분 (메뉴는 자주 변경되지 않음)

// 메뉴 목록 조회 (GET) - Cache-First 최적화
export async function GET() {
  const startTime = performance.now();
  const cache = CacheManager.getInstance();
  
  try {
    // 🚀 Phase 1: 전체 캐시 확인
    const cachedResult = await cache.get(CACHE_KEYS.MENU_LIST);
    if (cachedResult) {
      const responseTime = (performance.now() - startTime).toFixed(2);
      console.log(`🚀 메뉴 관리 전체 캐시 히트: ${responseTime}ms`);
      
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        responseTime: `${responseTime}ms`,
        cacheHit: 'FULL'
      });
    }

    // 🎯 Phase 2: DB 쿼리 실행
    console.log('💾 메뉴 목록 DB 조회 필요');
    const menus = await prisma.menu.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        label: true,
        href: true,
        order: true,
        isActive: true,
        visibilityLevel: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // 🎯 Phase 3: 최종 데이터 조합
    const responseData = {
      success: true,
      data: menus,
      stats: {
        total: menus.length,
        active: menus.filter(m => m.isActive).length
      }
    };

    // 🚀 전체 결과 캐시 저장
    await cache.set(CACHE_KEYS.MENU_LIST, responseData, CACHE_TTL);

    const responseTime = (performance.now() - startTime).toFixed(2);
    console.log(`🎯 메뉴 관리 로딩 완료: ${responseTime}ms (${menus.length}개 메뉴)`);

    return NextResponse.json({
      ...responseData,
      cached: false,
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error("❌ 메뉴 관리 API 오류:", error);
    return NextResponse.json(
      { success: false, error: '메뉴 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 메뉴 생성 (POST)
export async function POST(request: NextRequest) {
  const cache = CacheManager.getInstance();
  
  try {
    const body = await request.json();
    const { label, href, order, isActive, visibilityLevel } = body;

    // 입력값 검증
    if (!label || !href) {
      return NextResponse.json(
        { success: false, error: '메뉴명과 링크는 필수입니다.' },
        { status: 400 }
      );
    }

    // 순서가 지정되지 않으면 마지막 순서로 설정
    let menuOrder = order;
    if (menuOrder === undefined || menuOrder === null) {
      const lastMenu = await prisma.menu.findFirst({
        orderBy: { order: 'desc' }
      });
      menuOrder = (lastMenu?.order || 0) + 1;
    }

    const newMenu = await prisma.menu.create({
      data: {
        label,
        href,
        order: menuOrder,
        isActive: isActive !== undefined ? isActive : true,
        visibilityLevel: visibilityLevel || 'GUEST'
      }
    });

    // 🚀 캐시 무효화
    await cache.invalidate('menu:list');
    await cache.invalidate('menu:stats');

    return NextResponse.json({
      success: true,
      data: newMenu,
      message: '메뉴가 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    console.error('메뉴 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '메뉴 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 메뉴 수정 (PUT)
export async function PUT(request: NextRequest) {
  const cache = CacheManager.getInstance();
  
  try {
    const body = await request.json();
    const { id, label, href, order, isActive, visibilityLevel } = body;

    // 입력값 검증
    if (!id || !label || !href) {
      return NextResponse.json(
        { success: false, error: '메뉴 ID, 메뉴명, 링크는 필수입니다.' },
        { status: 400 }
      );
    }

    const updatedMenu = await prisma.menu.update({
      where: { id: parseInt(id) },
      data: {
        label,
        href,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        visibilityLevel: visibilityLevel || 'GUEST'
      }
    });

    // 🚀 캐시 무효화
    await cache.invalidate('menu:list');
    await cache.invalidate('menu:stats');

    return NextResponse.json({
      success: true,
      data: updatedMenu,
      message: '메뉴가 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('메뉴 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '메뉴 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 메뉴 삭제 (DELETE)
export async function DELETE(request: NextRequest) {
  const cache = CacheManager.getInstance();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '메뉴 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 🚀 관련 하위메뉴도 함께 삭제
    await prisma.$transaction(async (tx) => {
      // 먼저 관련 하위메뉴 삭제
      await tx.subMenu.deleteMany({
        where: { parentMenuId: parseInt(id) }
      });
      
      // 그 다음 메뉴 삭제
      await tx.menu.delete({
        where: { id: parseInt(id) }
      });
    });

    // 🚀 캐시 무효화
    await cache.invalidate('menu:list');
    await cache.invalidate('menu:stats');

    return NextResponse.json({
      success: true,
      message: '메뉴가 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('메뉴 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '메뉴 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 