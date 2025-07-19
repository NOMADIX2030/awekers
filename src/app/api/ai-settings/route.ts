import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: AI 설정 불러오기
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['ai_model', 'ai_max_tokens', 'ai_style', 'ai_system_prompt']
        }
      }
    });

    const defaultSettings = {
      model: 'gpt-3.5-turbo',
      maxTokens: 6000,
      style: '트렌디',
      systemPrompt: '너는 최신 트렌드에 밝은 한국어 블로그 작가야. 사용자가 입력한 주제에 대해 상세하고 유익한 블로그 글을 생성해.'
    };

    const result = { ...defaultSettings };
    
    settings.forEach(setting => {
      switch (setting.key) {
        case 'ai_model':
          result.model = setting.value;
          break;
        case 'ai_max_tokens':
          result.maxTokens = parseInt(setting.value);
          break;
        case 'ai_style':
          result.style = setting.value;
          break;
        case 'ai_system_prompt':
          result.systemPrompt = setting.value;
          break;
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "설정을 불러오는데 실패했습니다." }, { status: 500 });
  }
}

// POST: AI 설정 저장
export async function POST(req: NextRequest) {
  try {
    const { model, maxTokens, style, systemPrompt } = await req.json();

    // 설정 저장
    await Promise.all([
      prisma.siteSetting.upsert({
        where: { key: 'ai_model' },
        update: { value: model },
        create: { key: 'ai_model', value: model }
      }),
      prisma.siteSetting.upsert({
        where: { key: 'ai_max_tokens' },
        update: { value: maxTokens.toString() },
        create: { key: 'ai_max_tokens', value: maxTokens.toString() }
      }),
      prisma.siteSetting.upsert({
        where: { key: 'ai_style' },
        update: { value: style },
        create: { key: 'ai_style', value: style }
      }),
      prisma.siteSetting.upsert({
        where: { key: 'ai_system_prompt' },
        update: { value: systemPrompt },
        create: { key: 'ai_system_prompt', value: systemPrompt }
      })
    ]);

    return NextResponse.json({ message: "설정이 저장되었습니다." });
  } catch (error) {
    return NextResponse.json({ error: "설정 저장에 실패했습니다." }, { status: 500 });
  }
} 