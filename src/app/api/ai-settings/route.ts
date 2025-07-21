import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { CacheManager } from '../../../lib/admin/CacheManager';
import { QueryOptimizer } from '../../../lib/admin/QueryOptimizer';

// 🎯 캐시 키 상수 정의 (AI Settings)
const CACHE_KEYS = {
  AI_SETTINGS: 'ai:settings:all'
};

// 🚀 극대화된 캐시 TTL
const CACHE_TTL = 1800; // 30분 (AI 설정은 자주 변경되지 않음)

// GET: AI 설정 불러오기 (Cache-First 최적화)
export async function GET() {
  const startTime = performance.now();
  const cache = CacheManager.getInstance();
  
  try {
    // 🚀 Phase 1: 전체 캐시 확인
    const cachedResult = await cache.get(CACHE_KEYS.AI_SETTINGS);
    if (cachedResult) {
      const responseTime = (performance.now() - startTime).toFixed(2);
      console.log(`🚀 AI 설정 전체 캐시 히트: ${responseTime}ms`);
      
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        responseTime: `${responseTime}ms`,
        cacheHit: 'FULL'
      });
    }

    // 🎯 Phase 2: DB 쿼리 실행
    console.log('💾 AI 설정 DB 조회 필요');
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

    // 🚀 전체 결과 캐시 저장
    await cache.set(CACHE_KEYS.AI_SETTINGS, result, CACHE_TTL);

    const responseTime = (performance.now() - startTime).toFixed(2);
    console.log(`🎯 AI 설정 로딩 완료: ${responseTime}ms (${settings.length}개 설정)`);

    return NextResponse.json({
      success: true,
      settings: result,
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error("❌ AI 설정 API 오류:", error);
    return NextResponse.json(
      { success: false, error: 'AI 설정 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST: AI 설정 저장 (중앙집중식)
export async function POST(req: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { model, maxTokens, style, systemPrompt } = await req.json();

    // 🚀 중앙집중식 최적화 적용 (QueryOptimizer 패턴)
    console.log('🎯 AI 설정 저장: QueryOptimizer 적용 시작');

    // 🚀 중앙집중식: 모든 설정 저장을 병렬로 실행
    await QueryOptimizer.getInstance().executeParallel({
      model: () => prisma.siteSetting.upsert({
        where: { key: 'ai_model' },
        update: { value: model },
        create: { key: 'ai_model', value: model }
      }),
      maxTokens: () => prisma.siteSetting.upsert({
        where: { key: 'ai_max_tokens' },
        update: { value: maxTokens.toString() },
        create: { key: 'ai_max_tokens', value: maxTokens.toString() }
      }),
      style: () => prisma.siteSetting.upsert({
        where: { key: 'ai_style' },
        update: { value: style },
        create: { key: 'ai_style', value: style }
      }),
      systemPrompt: () => prisma.siteSetting.upsert({
        where: { key: 'ai_system_prompt' },
        update: { value: systemPrompt },
        create: { key: 'ai_system_prompt', value: systemPrompt }
      })
    });

    console.log('✅ AI 설정 저장: QueryOptimizer 최적화 완료');
    const endTime = performance.now();
    console.log(`🎯 AI 설정 저장 완료: ${(endTime - startTime).toFixed(2)}ms (4개 설정)`);

    return NextResponse.json({ 
      success: true,
      message: "설정이 저장되었습니다.",
      responseTime: `${(endTime - startTime).toFixed(2)}ms`
    });
  } catch (error) {
    const endTime = performance.now();
    console.error(`⚠️ AI 설정 저장 실패: ${(endTime - startTime).toFixed(2)}ms`, error);
    return NextResponse.json({ error: "설정 저장에 실패했습니다." }, { status: 500 });
  }
} 