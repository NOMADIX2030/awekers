import { NextRequest, NextResponse } from 'next/server';
import { SEOAnalysisEngine } from '../../naver_seo_check/engines/SEOAnalysisEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, options = {} } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL이 필요합니다.' },
        { status: 400 }
      );
    }

    // URL 유효성 검사
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: '올바른 URL 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // SEO 분석 엔진 초기화
    const analysisEngine = new SEOAnalysisEngine();
    
    // 분석 실행
    const analysisResult = await analysisEngine.analyze(url);

    return NextResponse.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('SEO Analysis Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'POST 메소드만 지원됩니다.' 
    },
    { status: 405 }
  );
} 