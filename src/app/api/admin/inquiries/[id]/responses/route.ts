import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface AddResponseBody {
  adminId: string;
  adminName: string;
  responseType: 'RESPONSE' | 'STATUS_CHANGE' | 'INTERNAL_MEMO';
  content: string;
  isVisibleToCustomer: boolean;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const inquiryId = parseInt(resolvedParams.id);
    const body: AddResponseBody = await request.json();
    
    // 입력값 검증
    if (!body.adminId || !body.adminName || !body.content?.trim()) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (!['RESPONSE', 'STATUS_CHANGE', 'INTERNAL_MEMO'].includes(body.responseType)) {
      return NextResponse.json(
        { success: false, error: '올바르지 않은 대응 유형입니다.' },
        { status: 400 }
      );
    }

    // 문의 존재 확인
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId }
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 문의입니다.' },
        { status: 404 }
      );
    }

    // 새 대응 추가
    const newResponse = await prisma.inquiryResponse.create({
      data: {
        inquiryId: inquiryId,
        adminId: body.adminId,
        adminName: body.adminName,
        responseType: body.responseType,
        content: body.content.trim(),
        isVisibleToCustomer: body.isVisibleToCustomer
      }
    });

    // 문의 업데이트 시간 갱신
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { updatedAt: new Date() }
    });

    // 성공 응답
    return NextResponse.json({
      success: true,
      data: newResponse,
      message: '새 대응이 성공적으로 추가되었습니다.'
    });

  } catch (error) {
    console.error('대응 추가 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 특정 문의의 대응 히스토리 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const inquiryId = parseInt(resolvedParams.id);

    // 대응 히스토리 조회 (시간순 정렬)
    const responses = await prisma.inquiryResponse.findMany({
      where: { inquiryId: inquiryId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        adminId: true,
        adminName: true,
        responseType: true,
        content: true,
        isVisibleToCustomer: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: responses
    });

  } catch (error) {
    console.error('대응 히스토리 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 