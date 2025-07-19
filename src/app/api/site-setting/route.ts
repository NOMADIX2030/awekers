import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 모든 사이트 설정값 반환
export async function GET() {
  const settings = await prisma.siteSetting.findMany();
  // key-value 객체로 변환
  const result: Record<string, string> = {};
  settings.forEach((s) => { result[s.key] = s.value; });
  return NextResponse.json(result);
}

// POST: 설정값 저장/수정 (body: { key, value })
export async function POST(req: NextRequest) {
  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: 'key는 필수입니다.' }, { status: 400 });
  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json(setting);
} 