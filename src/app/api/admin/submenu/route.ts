import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 하위메뉴 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentMenuId = searchParams.get('parentMenuId');

    let subMenus;
    
    if (parentMenuId) {
      // 특정 상위 메뉴의 하위메뉴만 조회
      subMenus = await prisma.subMenu.findMany({
        where: {
          parentMenuId: parseInt(parentMenuId)
        },
        include: {
          parentMenu: {
            select: {
              id: true,
              label: true
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      });
    } else {
      // 모든 하위메뉴 조회
      subMenus = await prisma.subMenu.findMany({
        include: {
          parentMenu: {
            select: {
              id: true,
              label: true
            }
          }
        },
        orderBy: [
          { parentMenuId: 'asc' },
          { order: 'asc' }
        ]
      });
    }

    return NextResponse.json({
      success: true,
      data: subMenus
    });
  } catch (error) {
    console.error('하위메뉴 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '하위메뉴 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 하위메뉴 생성 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parentMenuId, label, href, icon, order, isActive, visibilityLevel } = body;

    // 입력값 검증
    if (!parentMenuId || !label || !href) {
      return NextResponse.json(
        { success: false, error: '상위메뉴, 하위메뉴명, 링크는 필수입니다.' },
        { status: 400 }
      );
    }

    // 상위 메뉴 존재 확인
    const parentMenu = await prisma.menu.findUnique({
      where: { id: parseInt(parentMenuId) }
    });

    if (!parentMenu) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 상위 메뉴입니다.' },
        { status: 400 }
      );
    }

    // 순서가 지정되지 않으면 마지막 순서로 설정
    let subMenuOrder = order;
    if (subMenuOrder === undefined || subMenuOrder === null) {
      const lastSubMenu = await prisma.subMenu.findFirst({
        where: { parentMenuId: parseInt(parentMenuId) },
        orderBy: { order: 'desc' }
      });
      subMenuOrder = (lastSubMenu?.order || 0) + 1;
    }

    const newSubMenu = await prisma.subMenu.create({
      data: {
        parentMenuId: parseInt(parentMenuId),
        label,
        href,
        icon: icon || null,
        order: subMenuOrder,
        isActive: isActive !== undefined ? isActive : true,
        visibilityLevel: visibilityLevel || 'GUEST'
      },
      include: {
        parentMenu: {
          select: {
            id: true,
            label: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: newSubMenu,
      message: '하위메뉴가 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    console.error('하위메뉴 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '하위메뉴 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 하위메뉴 수정 (PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, parentMenuId, label, href, icon, order, isActive } = body;

    // 입력값 검증
    if (!id || !parentMenuId || !label || !href) {
      return NextResponse.json(
        { success: false, error: '하위메뉴 ID, 상위메뉴, 하위메뉴명, 링크는 필수입니다.' },
        { status: 400 }
      );
    }

    const updatedSubMenu = await prisma.subMenu.update({
      where: { id: parseInt(id) },
      data: {
        parentMenuId: parseInt(parentMenuId),
        label,
        href,
        icon: icon || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        parentMenu: {
          select: {
            id: true,
            label: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSubMenu,
      message: '하위메뉴가 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('하위메뉴 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '하위메뉴 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 하위메뉴 삭제 (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '하위메뉴 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await prisma.subMenu.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: '하위메뉴가 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('하위메뉴 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '하위메뉴 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 