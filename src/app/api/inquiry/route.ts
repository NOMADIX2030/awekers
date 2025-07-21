import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 참조번호 생성 함수
function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6); // 마지막 6자리
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `AWE-${year}-${timestamp}${random}`;
}

// 이메일 발송 함수 (실제로는 이메일 서비스 연동)
async function sendInquiryConfirmationEmail(
  customerEmail: string,
  customerName: string,
  referenceNo: string,
  serviceType: string
): Promise<void> {
  // 실제로는 Nodemailer, SendGrid, AWS SES 등을 사용
  console.log(`
📧 문의 접수 확인 이메일 발송
To: ${customerEmail}
Subject: [AWEKERS] 문의가 정상적으로 접수되었습니다 (참조번호: ${referenceNo})

${customerName}님, 안녕하세요!

AWEKERS에 문의해 주셔서 감사합니다.

📋 문의 정보
- 참조번호: ${referenceNo}
- 서비스: ${serviceType}
- 접수일시: ${new Date().toLocaleString('ko-KR')}

🔍 문의 조회 방법:
1. https://localhost:3000/inquiry-check 접속
2. 이메일 주소만 입력하여 조회 가능
3. 또는 참조번호와 함께 정확한 검색 가능

담당자가 확인 후 빠른 시일 내에 답변드리겠습니다.

감사합니다.
AWEKERS 고객지원팀
  `);
}

// 이메일 유효성 검사
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 전화번호 유효성 검사 (한국 전화번호 패턴)
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+82|82|0)?[-\s]?1[016789][-\s]?\d{3,4}[-\s]?\d{4}$|^(\+82|82|0)?[-\s]?[2-7]\d{1}[-\s]?\d{3,4}[-\s]?\d{4}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}

// 클라이언트 IP 추출
function getClientIP(req: NextRequest): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  const xRealIP = req.headers.get('x-real-ip');
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (xRealIP) {
    return xRealIP;
  }
  
  return '127.0.0.1'; // fallback
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      serviceType,
      name,
      phone,
      email,
      company,
      industry,
      category,
      subcategory,
      budget,
      message
    } = body;

    // 필수 필드 검증
    if (!serviceType || !name || !phone || !email || !industry || !category || !message) {
      return NextResponse.json(
        { success: false, error: '필수 입력 사항을 확인해주세요.' },
        { status: 400 }
      );
    }

    // IP 주소 및 User Agent 추출
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 고유한 참조번호 생성 (중복 방지)
    let referenceNo: string;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      referenceNo = generateReferenceNumber();
      const existing = await (prisma as any).inquiry.findUnique({
        where: { referenceNo }
      });
      
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { success: false, error: '시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    // 문의 저장
    const inquiry = await (prisma as any).inquiry.create({
      data: {
        referenceNo: referenceNo!,
        serviceType,
        name,
        phone,
        email: email.toLowerCase().trim(),
        company: company || null,
        industry,
        category,
        subcategory: subcategory || null,
        budget: budget || null,
        message,
        ipAddress: clientIP,
        userAgent
      }
    });

    // 고객에게 확인 이메일 발송
    try {
      await sendInquiryConfirmationEmail(
        email,
        name,
        referenceNo!,
        serviceType
      );
    } catch (emailError) {
      console.error('이메일 발송 실패:', emailError);
      // 이메일 실패는 치명적이지 않으므로 계속 진행
    }

    return NextResponse.json({
      success: true,
      data: {
        id: inquiry.id,
        referenceNo: referenceNo!,
        message: '문의가 성공적으로 접수되었습니다.'
      }
    });

  } catch (error) {
    console.error('문의 접수 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET 요청 - 관리자용 문의 목록 (옵션)
export async function GET(req: NextRequest) {
  try {
    // 간단한 인증 체크 (실제로는 더 강화된 인증 필요)
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const serviceType = searchParams.get('serviceType');

    const skip = (page - 1) * limit;

    // 필터 조건 구성
    const where: any = {};
    if (status) where.status = status;
    if (serviceType) where.serviceType = serviceType;

    const [inquiries, totalCount] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          serviceType: true,
          name: true,
          email: true,
          phone: true,
          company: true,
          industry: true,
          category: true,
          subcategory: true,
          budget: true,
          message: true,
          status: true,
          createdAt: true,
        }
      }),
      prisma.inquiry.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('문의 목록 조회 중 오류 발생:', error);
    
    return NextResponse.json(
      { success: false, error: '문의 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 