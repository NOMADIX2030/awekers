import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateProgress, resetProgress } from "@/lib/progress-manager";

// 🎯 모델별 토큰 한도 정의
const MODEL_TOKEN_LIMITS: Record<string, number> = {
  'gpt-3.5-turbo': 4096,
  'gpt-4': 8192,
  'gpt-4-turbo': 128000
};

// 🎯 토큰 사용량 추적
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

let totalTokenUsage: TokenUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0
};

// 🎯 대략적인 토큰 수 계산 함수 (한국어 기준)
function estimateTokens(text: string): number {
  // 한국어는 평균적으로 1단어당 1.3토큰 정도 사용
  const words = text.split(/\s+/).length;
  return Math.ceil(words * 1.3);
}

// 🎯 단계별 생성용 인터페이스
interface BlogOutline {
  title: string;
  summary: string;
  sections: {
    id: string;
    title: string;
    description: string;
    keywords: string[];
  }[];
  tag: string;
  image: string;
}

interface BlogSection {
  id: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

interface CompleteBlog {
  title: string;
  summary: string;
  content: string;
  tag: string;
  image: string;
}

// 🎯 JSON 파싱 유틸리티
function extractJson(text: string): string {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }
  return text;
}

function parseJsonSafely<T>(text: string): T {
  // 디버깅을 위한 로그 추가
  console.log('🔍 JSON 파싱 시도:', text.substring(0, 200) + '...');
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log('❌ 직접 파싱 실패, 정리 후 재시도...');

  const cleanedText = extractJson(text);
  try {
    return JSON.parse(cleanedText);
  } catch (e) {
      console.log('❌ 코드블록 제거 후 파싱 실패, 추가 정리 시도...');

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
          console.log('❌ JSON 부분 추출 후 파싱 실패');
    }
  }

      // 추가 시도: 앞뒤 불필요한 텍스트 제거
  const trimmedText = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
  try {
    return JSON.parse(trimmedText);
  } catch (e) {
        console.log('❌ 최종 정리 후 파싱 실패');
      }
      
      // 🎯 강화된 정리: 줄바꿈과 특수문자 처리
      const enhancedCleanText = text
        .replace(/\n/g, '\\n')  // 줄바꿈을 이스케이프
        .replace(/\r/g, '\\r')  // 캐리지 리턴을 이스케이프
        .replace(/\t/g, '\\t')  // 탭을 이스케이프
        .replace(/`/g, "'")     // 백틱을 작은따옴표로 변경
        .replace(/"/g, '\\"')   // 큰따옴표를 이스케이프 (필요시)
        .replace(/\\/g, '\\\\') // 백슬래시를 이스케이프
        .replace(/\s+/g, ' ')   // 연속된 공백을 하나로
    .trim();
  
  try {
        return JSON.parse(enhancedCleanText);
      } catch (e) {
        console.log('❌ 강화된 정리 후 파싱 실패');
      }
      
      // 🎯 최후의 수단: JSON 구조 복구
      try {
        const fixedJson = fixIncompleteJson(text);
        return JSON.parse(fixedJson);
  } catch (e) {
        console.log('❌ JSON 구조 복구 후 파싱 실패');
      }
      
      console.error('❌ 모든 JSON 파싱 시도 실패. 원본 텍스트:', text);
      throw new Error("JSON 파싱 실패");
    }
  }
}

// 🎯 불완전한 JSON 구조 복구 함수
function fixIncompleteJson(text: string): string {
  // JSON 객체의 기본 구조 확인
  if (!text.includes('"id"') || !text.includes('"title"') || !text.includes('"content"')) {
    throw new Error("필수 JSON 필드가 없습니다");
  }
  
  // content 필드가 잘린 경우 복구
  let fixedText = text;
  
  // content 필드의 끝을 찾아서 닫기
  const contentMatch = text.match(/"content":\s*"([^"]*(?:\\.[^"]*)*)"/);
  if (contentMatch && !text.includes('"subsections"')) {
    // content가 잘린 경우, 적절한 위치에서 닫기
    const lastQuoteIndex = text.lastIndexOf('"');
    if (lastQuoteIndex > 0) {
      fixedText = text.substring(0, lastQuoteIndex + 1) + '}';
    }
  }
  
  // subsections 배열이 잘린 경우 복구
  if (text.includes('"subsections"') && !text.includes(']')) {
    const subsectionsIndex = text.indexOf('"subsections"');
    const beforeSubsections = text.substring(0, subsectionsIndex);
    fixedText = beforeSubsections + '}';
  }
  
  // 최종 JSON 구조 확인
  if (!fixedText.endsWith('}')) {
    fixedText += '}';
  }
  
  return fixedText;
}

  // 🎯 1단계: 블로그 아웃라인 생성
  async function generateBlogOutline(prompt: string, apiKey: string, model: string): Promise<BlogOutline> {
    // 진행상황 업데이트
    updateProgress('outline', 'in-progress', '블로그 아웃라인 생성 중...');
  const systemPrompt = `너는 최고 수준의 전문 블로그 기획자야. SEO 최적화와 독자 경험을 모두 고려한 체계적인 블로그 아웃라인을 생성해.

다음 JSON 포맷으로만 응답해:
{
  "title": "SEO 친화적이고 매력적인 제목 (클릭률 최적화)",
  "summary": "독자 관심을 끄는 요약 (100자 내외, 핵심 가치 명시)",
  "sections": [
    {
      "id": "intro",
      "title": "섹션 제목 (검색 키워드 포함)",
      "description": "이 섹션에서 다룰 내용 설명 (실용적 가치 강조)",
      "keywords": ["주요키워드", "연관키워드", "롱테일키워드"]
    }
  ],
  "tag": "관련 태그들 (쉼표로 구분, 검색 최적화)",
  "image": "Unsplash 이미지 URL"
}

섹션은 정확히 5개로 구성하고, 각 섹션은 독립적으로 800-1200자 정도의 상세한 내용을 담을 수 있도록 설계해.
SEO 최적화, 실용성, 독자 가치를 모두 고려한 구조로 설계해.
섹션 구성: 소개(1개) + 본론(3개) + 결론(1개) 형태로 구성해.`;

  const userPrompt = `주제: ${prompt}

위 주제에 대한 블로그 아웃라인을 생성해주세요. 
각 섹션은 독립적으로 800-1200자 정도의 상세한 내용을 담을 수 있도록 설계해주세요.`;

  // 프롬프트 토큰 수 추정
  const promptTokens = estimateTokens(systemPrompt + userPrompt);
  console.log(`📝 아웃라인 프롬프트 토큰 추정: ${promptTokens} tokens`);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: Math.min(1500, MODEL_TOKEN_LIMITS[model] || 1500), // 토큰 비용 절약
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API 오류: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  
  // 토큰 사용량 추적
  if (data.usage) {
    totalTokenUsage.promptTokens += data.usage.prompt_tokens || 0;
    totalTokenUsage.completionTokens += data.usage.completion_tokens || 0;
    totalTokenUsage.totalTokens += data.usage.total_tokens || 0;
    console.log(`💰 아웃라인 생성 토큰 사용량: ${data.usage.total_tokens} tokens (총: ${totalTokenUsage.totalTokens})`);
  }
  
  // 진행상황 완료 업데이트
  updateProgress('outline', 'completed', '블로그 아웃라인 생성 완료');
  
  return parseJsonSafely<BlogOutline>(content);
}

  // 🎯 2단계: 개별 섹션 상세 생성
  async function generateSectionContent(
    section: BlogOutline['sections'][0], 
    prompt: string, 
    apiKey: string, 
    model: string
  ): Promise<BlogSection> {
    // 진행상황 업데이트
    const sectionNumber = section.id === 'intro' ? 1 : 
                         section.id === 'section1' ? 1 :
                         section.id === 'section2' ? 2 :
                         section.id === 'section3' ? 3 :
                         section.id === 'section4' ? 4 :
                         section.id === 'section5' ? 5 : 1;
    
    updateProgress(`section${sectionNumber}`, 'in-progress', `섹션 ${sectionNumber} 생성 중...`);
  const systemPrompt = `너는 최고 수준의 전문 블로그 작가야. SEO 최적화, 독자 가치, 실용성을 모두 고려한 고품질 내용을 작성해.

🚨 매우 중요한 규칙:
1. 반드시 아래 JSON 포맷만 반환해. 설명, 인사, 코드블록 없이 JSON만 반환해.
2. content 필드에 섹션 제목(# 또는 ##)을 포함하지 마세요
3. 하위 섹션 제목(###)도 content에 포함하지 마세요
4. 제목은 JSON의 title 필드에만 포함됩니다
5. content는 본문 내용만 포함해야 합니다
6. JSON을 반드시 완전히 닫아야 합니다 (마지막에 } 있어야 함)

📝 내용 요구사항:
1. 800-1200자 정도의 상세하고 유익한 내용
2. 실제 사례, 구체적 예시, 최신 데이터 포함
3. 독자가 쉽게 이해할 수 있는 명확한 설명
4. 마크다운 형식 사용 (목록, 강조, 인용, 표 등)
5. 실용적이고 즉시 실행 가능한 정보 제공
6. SEO 최적화 (키워드 자연스럽게 배치)
7. 독자 참여 유도 (질문, 액션 아이템)

🔧 기술적 요구사항:
- content 필드의 줄바꿈은 \\n으로 처리
- 코드 예시는 백틱(\`) 대신 작은따옴표(')를 사용
- JSON 문자열 내의 특수문자는 적절히 이스케이프
- JSON 구조가 완전해야 함

아래 JSON 포맷으로만 응답해:
{
  "id": "섹션ID",
  "title": "섹션 제목",
  "content": "상세한 마크다운 내용\\n\\n코드 예시: 'npm install -g typescript'\\n\\n세 번째 줄",
  "subsections": [
    {
      "title": "하위 섹션 제목",
      "content": "하위 섹션 내용"
    }
  ]
}`;

  const userPrompt = `주제: ${prompt}
섹션: ${section.title}
설명: ${section.description}
키워드: ${section.keywords.join(', ')}

위 섹션에 대한 상세하고 유익한 내용을 작성해주세요.`;

  // 프롬프트 토큰 수 추정
  const promptTokens = estimateTokens(systemPrompt + userPrompt);
  console.log(`📝 섹션 ${section.title} 프롬프트 토큰 추정: ${promptTokens} tokens`);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: Math.min(1500, MODEL_TOKEN_LIMITS[model] || 1500), // 섹션 생성 토큰 비용 절약
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API 오류: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  
  // 토큰 사용량 추적
  if (data.usage) {
    totalTokenUsage.promptTokens += data.usage.prompt_tokens || 0;
    totalTokenUsage.completionTokens += data.usage.completion_tokens || 0;
    totalTokenUsage.totalTokens += data.usage.total_tokens || 0;
    console.log(`💰 섹션 생성 토큰 사용량: ${data.usage.total_tokens} tokens (총: ${totalTokenUsage.totalTokens})`);
  }
  
  // 진행상황 완료 업데이트
  updateProgress(`section${sectionNumber}`, 'completed', `섹션 ${sectionNumber} 생성 완료`);
  
  return parseJsonSafely<BlogSection>(content);
}

// 🎯 3단계: 전체 블로그 조합
function combineBlogContent(outline: BlogOutline, sections: BlogSection[]): CompleteBlog {
  let fullContent = `# ${outline.title}\n\n`;
  
  sections.forEach((section, index) => {
    // 섹션 제목이 이미 content에 포함되어 있는지 확인
    const hasTitleInContent = section.content.includes(`# ${section.title}`) || 
                             section.content.includes(`## ${section.title}`);
    
    // 제목이 content에 없으면 추가
    if (!hasTitleInContent) {
      fullContent += `## ${section.title}\n\n`;
    }
    
    fullContent += section.content;
    
    // 하위 섹션 처리 (중복 제거)
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        // 하위 섹션 제목이 이미 content에 포함되어 있는지 확인
        const hasSubTitleInContent = section.content.includes(`### ${subsection.title}`) ||
                                   section.content.includes(`## ${subsection.title}`);
        
        if (!hasSubTitleInContent) {
          fullContent += `\n\n### ${subsection.title}\n\n`;
        }
        fullContent += subsection.content;
      });
    }
    
    if (index < sections.length - 1) {
      fullContent += '\n\n---\n\n';
    }
  });

  // FAQ 섹션 추가
  fullContent += `\n\n## ❓ 자주 묻는 질문 (FAQ)\n\n`;
  fullContent += `**Q: ${outline.title}에 대해 궁금한 점이 있나요?**\n\n`;
  fullContent += `A: 이 글에서 다룬 내용 외에 추가 질문이 있으시면 댓글로 문의해주세요!\n\n`;
  fullContent += `## 🎉 결론\n\n`;
  fullContent += `${outline.title}에 대한 포괄적인 가이드를 제공했습니다. 이 내용을 바탕으로 실제 적용해보시고, 궁금한 점이 있으시면 언제든 댓글로 문의해주세요!\n\n`;
  fullContent += `---\n\n*이 글은 AI가 생성한 내용입니다. 실제 사용 시에는 최신 정보로 보완해주세요.*`;

  return {
    title: outline.title,
    summary: outline.summary,
    content: fullContent,
    tag: outline.tag,
    image: outline.image,
  };
}

// POST: 단계별 AI 블로그 생성
export async function POST(req: NextRequest) {
  try {
    const { prompt, mode = 'step-by-step' } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "프롬프트를 입력하세요." }, { status: 400 });
    }
    
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI API 키가 설정되어 있지 않습니다." }, { status: 500 });
    }

    // AI 설정 불러오기
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['ai_model', 'ai_max_tokens', 'ai_style', 'ai_system_prompt']
        }
      }
    });

    const defaultSettings = {
      model: 'gpt-3.5-turbo',
      maxTokens: 1500, // 기본 토큰 수를 1500으로 제한하여 비용 절약
      style: '트렌디',
      systemPrompt: '너는 최신 트렌드에 밝은 한국어 블로그 작가야. 사용자가 입력한 주제에 대해 상세하고 유익한 블로그 글을 생성해.'
    };

    const aiSettings = { ...defaultSettings };
    
    settings.forEach(setting => {
      switch (setting.key) {
        case 'ai_model':
          aiSettings.model = setting.value;
          break;
        case 'ai_max_tokens':
          aiSettings.maxTokens = parseInt(setting.value);
          break;
        case 'ai_style':
          aiSettings.style = setting.value;
          break;
        case 'ai_system_prompt':
          aiSettings.systemPrompt = setting.value;
          break;
      }
    });

    if (mode === 'step-by-step') {
      console.log('🚀 단계별 블로그 생성 시작:', prompt);
      console.log('💰 토큰 사용량 추적 시작...');
      
      // 토큰 사용량 초기화
      totalTokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
      
      // 진행상황 초기화
      resetProgress();
      
      // 1단계: 블로그 아웃라인 생성
      console.log('📋 1단계: 블로그 아웃라인 생성 중...');
      const outline = await generateBlogOutline(prompt, apiKey, aiSettings.model);
      
      // 2단계: 각 섹션 상세 생성
      console.log('📝 2단계: 섹션별 상세 내용 생성 중...');
      const sections: BlogSection[] = [];
      
      for (let i = 0; i < outline.sections.length; i++) {
        const section = outline.sections[i];
        console.log(`📝 섹션 ${i + 1}/${outline.sections.length}: ${section.title} 생성 중...`);
        
        try {
          const sectionContent = await generateSectionContent(section, prompt, apiKey, aiSettings.model);
          sections.push(sectionContent);
          console.log(`✅ 섹션 ${i + 1} 생성 완료`);
        } catch (error) {
          console.error(`❌ 섹션 ${i + 1} 생성 실패:`, error);
          
          // 실패한 섹션에 대한 fallback 생성
          const fallbackSection: BlogSection = {
            id: section.id,
            title: section.title,
            content: `## ${section.title}\n\n이 섹션에서는 ${section.description}에 대해 다룹니다.\n\n### 주요 내용\n\n- ${section.keywords.join('\n- ')}\n\n### 상세 설명\n\n${section.description}에 대한 상세한 내용을 제공합니다. 이 주제에 대해 더 자세한 정보가 필요하시면 댓글로 문의해주세요.\n\n### 실용적인 팁\n\n- 실제 적용 시 주의사항\n- 성공 사례 분석\n- 문제 해결 방법\n\n이 섹션은 AI 생성 중 오류가 발생하여 기본 구조로 제공됩니다. 필요시 수동으로 내용을 보완해주세요.`,
            subsections: []
          };
          sections.push(fallbackSection);
          console.log(`🔄 섹션 ${i + 1} fallback 생성 완료`);
        }
      }
      
      // 3단계: 전체 내용 조합
      console.log('🔗 3단계: 전체 내용 조합 중...');
      updateProgress('combine', 'in-progress', '전체 내용 조합 중...');
      const completeBlog = combineBlogContent(outline, sections);
      updateProgress('combine', 'completed', '전체 내용 조합 완료');
      
      // 최종 토큰 사용량 리포트
      console.log('📊 최종 토큰 사용량 리포트:');
      console.log(`   - 프롬프트 토큰: ${totalTokenUsage.promptTokens}`);
      console.log(`   - 완성 토큰: ${totalTokenUsage.completionTokens}`);
      console.log(`   - 총 토큰: ${totalTokenUsage.totalTokens}`);
      console.log(`   - 예상 비용: $${((totalTokenUsage.promptTokens * 0.0015 + totalTokenUsage.completionTokens * 0.002) / 1000).toFixed(4)}`);
      
      // 토큰 사용량 정보 계산
      const estimatedCost = ((totalTokenUsage.promptTokens * 0.0015 + totalTokenUsage.completionTokens * 0.002) / 1000).toFixed(4);
      
      console.log('✅ 단계별 블로그 생성 완료!');
      
      // 토큰 사용량 정보와 함께 응답
      return NextResponse.json({
        ...completeBlog,
        tokenUsage: {
          promptTokens: totalTokenUsage.promptTokens,
          completionTokens: totalTokenUsage.completionTokens,
          totalTokens: totalTokenUsage.totalTokens,
          estimatedCost: `$${estimatedCost}`
        }
      });
      
      // 토큰 사용량 초기화
      totalTokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    }

    // 기존 단일 생성 모드 (backward compatibility)
    console.log('🎯 기존 단일 생성 모드 실행');

    // 모델별 토큰 한도 적용
    const modelLimit = MODEL_TOKEN_LIMITS[aiSettings.model] || 4096;
    const safeMaxTokens = Math.min(aiSettings.maxTokens, modelLimit, 2500); // 더 보수적인 토큰 제한

    // OpenAI API 호출
    const systemPrompt = `${aiSettings.systemPrompt}

다음 요구사항을 반드시 지켜줘:
1. 반드시 아래 JSON 포맷만 반환해. 설명, 인사, 코드블록 없이 JSON만 반환해.
2. 본문은 최소 4000자 이상으로 매우 상세하게 작성 (현재의 2배 이상)
3. 실제 사례, 예시, 데이터, 통계를 포함하여 신뢰성 있는 내용 제공
4. 독자가 쉽게 이해할 수 있도록 단계별 설명과 구체적인 방법론 포함
5. 마크다운 형식 사용 (제목, 목록, 강조, 인용 등)
6. 실용적이고 실행 가능한 정보와 팁 제공
7. 각 섹션별로 상세한 설명과 예시 포함
8. 독자 질문과 답변 형태의 FAQ 섹션 포함
9. 스타일: ${aiSettings.style}

아래 JSON 포맷으로만 응답해:
{
  "title": "매력적이고 SEO 친화적인 블로그 제목",
  "summary": "독자의 관심을 끌 수 있는 한줄 요약 (100자 내외)",
  "content": "상세한 본문 내용 (마크다운 형식, 최소 4000자, 섹션별 구분, FAQ 포함)",
  "tag": "관련 태그들을 쉼표로 구분",
  "image": "주제와 관련된 Unsplash 이미지 URL"
}`;
    const userPrompt = `주제: ${prompt}

위 주제에 대해 매우 상세하고 포괄적인 블로그 글을 작성해주세요. 

다음 구조로 작성해주세요:
1. **도입부**: 주제 소개와 중요성
2. **본론**: 3-4개의 주요 섹션으로 나누어 상세 설명
3. **실제 사례**: 구체적인 예시와 적용 방법
4. **단계별 가이드**: 실행 가능한 단계별 방법론
5. **FAQ 섹션**: 독자들이 궁금해할 만한 질문과 답변
6. **결론**: 요약과 다음 단계 제안

각 섹션은 충분히 상세하고 독자에게 실질적인 가치를 제공하는 내용으로 구성해주세요.`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: aiSettings.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: safeMaxTokens,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return NextResponse.json({ error: `OpenAI API 오류: ${err}` }, { status: 500 });
    }

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content || "";
    
    // 단일 생성 모드에서도 토큰 사용량 추적
    if (openaiData.usage) {
      totalTokenUsage.promptTokens += openaiData.usage.prompt_tokens || 0;
      totalTokenUsage.completionTokens += openaiData.usage.completion_tokens || 0;
      totalTokenUsage.totalTokens += openaiData.usage.total_tokens || 0;
      console.log(`💰 단일 생성 토큰 사용량: ${openaiData.usage.total_tokens} tokens (총: ${totalTokenUsage.totalTokens})`);
    }
    
    try {
      const blogData = parseJsonSafely(rawContent);
      
      // 토큰 사용량 정보 계산
      const estimatedCost = ((totalTokenUsage.promptTokens * 0.0015 + totalTokenUsage.completionTokens * 0.002) / 1000).toFixed(4);
      
      // 토큰 사용량 정보와 함께 응답
      const response = {
        title: (blogData as any).title,
        summary: (blogData as any).summary,
        content: (blogData as any).content,
        tag: (blogData as any).tag,
        image: (blogData as any).image,
        tokenUsage: {
          promptTokens: totalTokenUsage.promptTokens,
          completionTokens: totalTokenUsage.completionTokens,
          totalTokens: totalTokenUsage.totalTokens,
          estimatedCost: `$${estimatedCost}`
        }
      };
      
      // 토큰 사용량 초기화
      totalTokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
      
      return NextResponse.json(response);
    } catch (err) {
      console.error("AI 응답 파싱 실패:", err);
      
      const fallbackData = {
        title: `${prompt}에 대한 완전 가이드`,
        summary: `${prompt}에 대한 상세한 분석과 실용적인 정보를 제공하는 포괄적인 가이드입니다.`,
        content: `# ${prompt}에 대한 완전 가이드

## 📋 개요

${prompt}에 대한 포괄적인 가이드를 제공합니다. 이 글에서는 ${prompt}의 기본 개념부터 실제 적용 방법까지 단계별로 설명합니다.

## 🎯 주요 내용

### 1. ${prompt}의 기본 이해
- ${prompt}의 정의와 중요성
- 현재 트렌드와 동향
- 기대 효과와 장점

### 2. 실제 적용 방법
- 단계별 구현 가이드
- 주의사항과 팁
- 성공 사례 분석

### 3. 고급 활용 기법
- 최적화 방법
- 문제 해결 가이드
- 향후 발전 방향

## ❓ 자주 묻는 질문 (FAQ)

**Q: ${prompt}를 언제 사용해야 하나요?**
A: ${prompt}는 [구체적인 상황]에서 가장 효과적입니다.

**Q: 초보자도 쉽게 따라할 수 있나요?**
A: 네, 이 가이드를 따라하시면 충분히 가능합니다.

## 🎉 결론

${prompt}에 대한 이해를 바탕으로 실제 적용해보시기 바랍니다. 궁금한 점이 있으시면 언제든 댓글로 문의해주세요!

---

*이 내용은 AI가 생성한 기본 구조입니다. 실제 사용 시에는 더 구체적인 정보와 최신 데이터로 보완해주세요.*`,
        tag: `${prompt}, 가이드, 튜토리얼, 팁`,
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop"
      };
      
      return NextResponse.json({ 
        error: "AI 응답 파싱에 실패했습니다. 기본 구조로 반환합니다.",
        data: fallbackData,
        rawResponse: rawContent.slice(0, 500)
      }, { status: 500 });
    }
    
  } catch (e) {
    console.error("AI 블로그 생성 오류:", e);
    return NextResponse.json({ 
      error: "AI 블로그 생성 중 서버 오류가 발생했습니다.",
      details: e instanceof Error ? e.message : "알 수 없는 오류"
    }, { status: 500 });
  }
} 