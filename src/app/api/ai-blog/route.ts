import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 모델별 토큰 한도
const MODEL_TOKEN_LIMITS: Record<string, number> = {
  "gpt-3.5-turbo": 4096,
  "gpt-4": 8192,
  "gpt-4o": 8192,
};

function extractJson(text: string): string {
  // 코드블록(````json ... ````) 제거
  const codeBlockMatch = text.match(/```json([\s\S]*?)```/i);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  // 코드블록(```` ... ````) 제거
  const codeBlockAny = text.match(/```([\s\S]*?)```/i);
  if (codeBlockAny) {
    return codeBlockAny[1].trim();
  }
  // 앞뒤 공백 제거
  return text.trim();
}

// JSON 파싱 시도 (여러 방법으로 시도)
function parseJsonSafely(text: string): any {
  // 1. 직접 파싱 시도
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("직접 파싱 실패, 정리 후 재시도...");
  }

  // 2. 코드블록 제거 후 파싱 시도
  const cleanedText = extractJson(text);
  try {
    return JSON.parse(cleanedText);
  } catch (e) {
    console.log("코드블록 제거 후 파싱 실패, 추가 정리 시도...");
  }

  // 3. JSON 부분만 추출 시도
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.log("JSON 부분 추출 후 파싱 실패");
    }
  }

  // 4. 마지막 시도: 앞뒤 불필요한 텍스트 제거
  const trimmedText = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
  try {
    return JSON.parse(trimmedText);
  } catch (e) {
    console.log("최종 정리 후 파싱 실패");
  }

  // 5. 추가 시도: 줄바꿈과 공백 정리
  const normalizedText = text
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  try {
    return JSON.parse(normalizedText);
  } catch (e) {
    console.log("정규화 후 파싱 실패");
  }

  throw new Error("모든 JSON 파싱 시도 실패");
}

// POST: AI 블로그 생성 (OpenAI 연동)
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
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
      maxTokens: 4096,
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

    // 모델별 토큰 한도 적용
    const modelLimit = MODEL_TOKEN_LIMITS[aiSettings.model] || 4096;
    const safeMaxTokens = Math.min(aiSettings.maxTokens, modelLimit);

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
        max_tokens: safeMaxTokens, // 모델별 한도 적용
      }),
    });
    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return NextResponse.json({ error: `OpenAI API 오류: ${err}` }, { status: 500 });
    }
    const openaiData = await openaiRes.json();
    
    // 응답에서 JSON 파싱
    let blogData = {};
    const rawContent = openaiData.choices?.[0]?.message?.content || "";
    
    try {
      blogData = parseJsonSafely(rawContent);
    } catch (err) {
      console.error("AI 응답 파싱 실패:", err);
      console.error("원본 응답:", rawContent);
      
      // 파싱 실패 시 더 나은 fallback 데이터 생성
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
        rawResponse: rawContent.slice(0, 500) // 디버깅용 원본 응답 일부
      }, { status: 500 });
    }
    
    return NextResponse.json(blogData);
  } catch (e) {
    console.error("AI 블로그 생성 오류:", e);
    return NextResponse.json({ 
      error: "AI 블로그 생성 중 서버 오류가 발생했습니다.",
      details: e instanceof Error ? e.message : "알 수 없는 오류"
    }, { status: 500 });
  }
} 