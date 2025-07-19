import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET: 특정 사용자 정보 조회
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const userId = parseInt(idStr);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "존재하지 않는 사용자입니다." }, { status: 404 });
    }
    
    return NextResponse.json({ user });
  } catch (e) {
    console.error("사용자 조회 오류:", e);
    return NextResponse.json({ error: "사용자 정보를 불러오는데 실패했습니다." }, { status: 500 });
  }
}

// PUT: 사용자 정보 수정
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const userId = parseInt(idStr);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }
    
    const { email, password, isAdmin } = await req.json();
    
    // 사용자 존재 확인
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return NextResponse.json({ error: "존재하지 않는 사용자입니다." }, { status: 404 });
    }
    
    // 이메일 중복 확인 (자기 자신 제외)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json({ error: "이미 존재하는 이메일입니다." }, { status: 400 });
      }
    }
    
    // 업데이트할 데이터 준비
    const updateData: Record<string, unknown> = {};
    
    if (email) updateData.email = email;
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "비밀번호는 최소 6자 이상이어야 합니다." }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;
    
    // 사용자 정보 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json({ 
      user: updatedUser, 
      message: "사용자 정보가 성공적으로 수정되었습니다." 
    });
  } catch (e) {
    console.error("사용자 수정 오류:", e);
    return NextResponse.json({ error: "사용자 정보 수정에 실패했습니다." }, { status: 500 });
  }
}

// DELETE: 사용자 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const userId = parseInt(idStr);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }
    
    // 사용자 존재 확인
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "존재하지 않는 사용자입니다." }, { status: 404 });
    }
    
    // 관리자는 삭제 불가 (자기 자신 보호)
    if (user.isAdmin) {
      return NextResponse.json({ error: "관리자 계정은 삭제할 수 없습니다." }, { status: 403 });
    }
    
    // 사용자의 댓글도 함께 삭제
    await prisma.comment.deleteMany({ where: { userId } });
    
    // 사용자 삭제
    await prisma.user.delete({ where: { id: userId } });
    
    return NextResponse.json({ message: "사용자가 성공적으로 삭제되었습니다." });
  } catch (e) {
    console.error("사용자 삭제 오류:", e);
    return NextResponse.json({ error: "사용자 삭제에 실패했습니다." }, { status: 500 });
  }
} 