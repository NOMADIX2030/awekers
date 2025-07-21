import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../lib/prisma';

// Google Analytics 설정 조회
export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const config = await prisma.googleAnalyticsConfig.findFirst({
      where: { isActive: true }
    });

    if (!config) {
      return NextResponse.json({ 
        isConfigured: false,
        message: 'Google Analytics가 설정되지 않았습니다.' 
      });
    }

    // 민감한 정보는 제외하고 반환
    return NextResponse.json({
      isConfigured: true,
      propertyId: config.propertyId,
      isActive: config.isActive,
      lastUpdated: config.updatedAt
    });

  } catch (error) {
    console.error('Google Analytics 설정 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Google Analytics 설정 저장/업데이트
export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId, clientId, clientSecret, refreshToken } = body;

    // 필수 필드 검증
    if (!propertyId || !clientId || !clientSecret || !refreshToken) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 기존 설정 비활성화
    await prisma.googleAnalyticsConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // 새 설정 저장
    const config = await prisma.googleAnalyticsConfig.create({
      data: {
        propertyId,
        clientId,
        clientSecret,
        refreshToken,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Google Analytics 설정이 저장되었습니다.',
      configId: config.id
    });

  } catch (error) {
    console.error('Google Analytics 설정 저장 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Google Analytics 설정 삭제
export async function DELETE(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    await prisma.googleAnalyticsConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    return NextResponse.json({
      success: true,
      message: 'Google Analytics 설정이 비활성화되었습니다.'
    });

  } catch (error) {
    console.error('Google Analytics 설정 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
 
 