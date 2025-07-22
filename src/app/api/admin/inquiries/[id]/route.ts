import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 관리자 인증 체크
function checkAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const adminKey = process.env.ADMIN_API_KEY || 'admin-key';
  
  return authHeader === `Bearer ${adminKey}`;
}

// GET 요청 - 특정 문의 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 체크
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const inquiryId = parseInt(id);
    
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      select: {
        id: true,
        serviceType: true,
        name: true,
        phone: true,
        email: true,
        company: true,
        industry: true,
        category: true,
        subcategory: true,
        budget: true,
        message: true,
        status: true,
        adminResponse: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        responses: {
          select: {
            id: true,
            adminId: true,
            adminName: true,
            responseType: true,
            content: true,
            isVisibleToCustomer: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 문의입니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: inquiry
    });

  } catch (error) {
    console.error('문의 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH 요청 - 문의 상태 및 답변 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 체크
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const inquiryId = parseInt(id);
    const body = await request.json();
    const { status, adminResponse } = body;

    // 문의 존재 확인
    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId }
    });

    if (!existingInquiry) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 문의입니다.' },
        { status: 404 }
      );
    }

    // 상태 유효성 검사
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: '올바르지 않은 상태값입니다.' },
        { status: 400 }
      );
    }

    // 업데이트 데이터 구성
    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminResponse !== undefined) updateData.adminResponse = adminResponse;

    // 문의 업데이트
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: updateData,
      select: {
        id: true,
        status: true,
        adminResponse: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedInquiry,
      message: '문의가 성공적으로 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('문의 업데이트 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE 요청 - 문의 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 체크
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const inquiryId = parseInt(id);
    
    // 문의 존재 확인
    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!existingInquiry) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 문의입니다.' },
        { status: 404 }
      );
    }

    // 관련된 대응 히스토리도 함께 삭제됨 (Cascade 설정)
    await prisma.inquiry.delete({
      where: { id: inquiryId }
    });

    return NextResponse.json({
      success: true,
      message: `문의 #${inquiryId} (${existingInquiry.name}님)가 성공적으로 삭제되었습니다.`,
      data: {
        deletedId: inquiryId,
        deletedName: existingInquiry.name,
        deletedEmail: existingInquiry.email
      }
    });

  } catch (error: any) {
    console.error('문의 삭제 오류:', error);
    
    // 외래키 제약 조건 오류 처리
    if (error.code === 'P2003') {
      return NextResponse.json(
        { success: false, error: '연관된 데이터가 있어 삭제할 수 없습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 