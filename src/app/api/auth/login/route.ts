import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// POST: 로그인
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력하세요." }, { status: 400 });
    }
    // prisma.user로 접근 (users가 아님)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "존재하지 않는 계정입니다." }, { status: 404 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
    }
    // 관리자 여부 반환
    return NextResponse.json({ success: true, isAdmin: user.isAdmin, userId: user.id });
  } catch (e) {
    console.error("로그인 서버 에러:", e);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
} 