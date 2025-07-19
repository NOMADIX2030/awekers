import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET: 사용자 목록 조회
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    });
    
    return NextResponse.json({ users });
  } catch (e) {
    console.error("사용자 목록 조회 오류:", e);
    return NextResponse.json({ error: "사용자 목록을 불러오는데 실패했습니다." }, { status: 500 });
  }
}

// POST: 새 사용자 등록
export async function POST(req: NextRequest) {
  try {
    const { email, password, isAdmin } = await req.json();
    
    // 입력값 검증
    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력하세요." }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: "비밀번호는 최소 6자 이상이어야 합니다." }, { status: 400 });
    }
    
    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "이미 존재하는 이메일입니다." }, { status: 400 });
    }
    
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json({ user, message: "사용자가 성공적으로 등록되었습니다." });
  } catch (e) {
    console.error("사용자 등록 오류:", e);
    return NextResponse.json({ error: "사용자 등록에 실패했습니다." }, { status: 500 });
  }
} 