import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, inquiryId, searchMethod } = body;

    // 입력값 검증
    if (!email) {
      return NextResponse.json(
        { success: false, error: '이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    const emailLowerCase = email.toLowerCase().trim();

    // 검색 방법에 따른 조건 설정
    let searchCondition;
    
    if (searchMethod === 'both' && inquiryId) {
      // 문의번호가 숫자인지 문자(참조번호)인지 확인
      const isNumericId = /^\d+$/.test(inquiryId.toString());
      
      if (isNumericId) {
        // 숫자 ID + 이메일 매칭
        searchCondition = {
          id: parseInt(inquiryId),
          email: emailLowerCase
        };
      } else {
        // 참조번호 + 이메일 매칭
        searchCondition = {
          referenceNo: inquiryId.toString().trim(),
          email: emailLowerCase
        };
      }
    } else {
      // 이메일만으로 검색
      searchCondition = {
        email: emailLowerCase
      };
    }

    // 문의 조회
    const inquiries = await (prisma as any).inquiry.findMany({
      where: searchCondition,
      select: {
        id: true,
        referenceNo: true,
        serviceType: true,
        name: true,
        email: true,
        company: true,
        category: true,
        subcategory: true,
        message: true,
        status: true,
        adminResponse: true,
        createdAt: true,
        updatedAt: true,
        responses: {
          where: {
            isVisibleToCustomer: true
          },
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!inquiries || inquiries.length === 0) {
      return NextResponse.json(
        { success: false, error: '해당 조건으로 등록된 문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 단일 검색 결과인 경우 객체로, 복수인 경우 배열로 반환
    const responseData = inquiries.length === 1 && searchMethod === 'both' 
      ? inquiries[0] 
      : inquiries;

    return NextResponse.json({
      success: true,
      data: responseData,
      message: inquiries.length === 1 
        ? '문의를 성공적으로 조회했습니다.' 
        : `총 ${inquiries.length}건의 문의를 찾았습니다.`
    });

  } catch (error) {
    console.error('문의 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 