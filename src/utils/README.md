# 🎯 도메인/URL 표준화 가이드

## 📋 개요

이 문서는 AWEKERS 프로젝트에서 도메인과 URL을 다루는 표준화된 방법을 정의합니다.

## 🚀 권장 함수

### 1. `getSiteUrl()` - **권장 함수**

```typescript
import { getSiteUrl } from '@/utils/domain';

// ✅ 권장 사용법
const siteUrl = getSiteUrl();
// 개발환경: "http://localhost:3000"
// 프로덕션: "https://awekers.vercel.app"
// Vercel: "https://awekers-git-main.vercel.app"
```

**사용 사례:**
- SEO 메타데이터 생성
- Open Graph URL 설정
- 정규 URL (canonical) 설정
- API 엔드포인트 생성

### 2. `getDomain()` - 도메인만 필요할 때

```typescript
import { getDomain } from '@/utils/domain';

// ✅ 도메인만 필요한 경우
const domain = getDomain();
// "awekers.vercel.app"
```

**사용 사례:**
- 로그 출력
- 설정 파일
- 도메인 기반 로직

## ❌ 비권장 함수

### `getCurrentDomain()` - **사용 금지**

```typescript
// ❌ 사용 금지 (deprecated)
import { getCurrentDomain } from '@/utils/domain';
const url = getCurrentDomain(); // 경고 발생
```

**이유:**
- 함수명이 너무 길고 구체적
- 표준 네이밍 컨벤션에 부합하지 않음
- 향후 제거 예정

## 🔧 환경변수 설정

### 표준 환경변수명

```bash
# ✅ 권장 환경변수명
NEXT_PUBLIC_SITE_URL="https://awekers.com"           # 최우선순위
NEXT_PUBLIC_DEFAULT_SITE_URL="https://awekers.com"   # 프로덕션 기본값
NEXT_PUBLIC_API_URL="https://api.awekers.com"
NEXT_PUBLIC_APP_NAME="AWEKERS"

# ❌ 비권장 환경변수명
SITE_URL="https://awekers.com"           # NEXT_PUBLIC_ 접두사 없음
APP_DOMAIN="awekers.com"                 # 표준 패턴 아님
WEBSITE_URL="https://awekers.com"        # 너무 구체적
```

### 환경별 설정

```bash
# .env.local (개발환경)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# .env.production (프로덕션)
NEXT_PUBLIC_SITE_URL="https://awekers.com"
NEXT_PUBLIC_DEFAULT_SITE_URL="https://awekers.com"  # 안전장치

# Vercel 환경변수 (자동 설정)
VERCEL_URL="awekers-git-main.vercel.app"
```

## 📝 사용 예시

### 1. SEO 메타데이터

```typescript
import { getSiteUrl } from '@/utils/domain';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  
  return {
    metadataBase: new URL(siteUrl),
    openGraph: {
      url: `${siteUrl}/blog`,
      siteName: 'AWEKERS',
    },
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
  };
}
```

### 2. API 응답

```typescript
import { getSiteUrl } from '@/utils/domain';

export async function GET() {
  const siteUrl = getSiteUrl();
  
  return Response.json({
    success: true,
    data: {
      siteUrl,
      timestamp: new Date().toISOString(),
    },
  });
}
```

### 3. 로그 출력

```typescript
import { getDomain } from '@/utils/domain';

const domain = getDomain();
console.log(`🚀 서버 시작: ${domain}`);
```

## 🎯 우선순위 규칙

1. **1순위**: `NEXT_PUBLIC_SITE_URL` 환경변수
2. **2순위**: `VERCEL_URL` 환경변수 (Vercel 자동 제공)
3. **3순위**: `NEXT_PUBLIC_DEFAULT_SITE_URL` 환경변수 (프로덕션 안전장치)
4. **4순위**: 개발환경 기본값 (`http://localhost:3000`)
5. **에러**: 프로덕션에서 환경변수 미설정 시 에러 발생

## 🔄 마이그레이션 가이드

### 기존 코드 → 새로운 코드

```typescript
// ❌ 기존 코드
import { getCurrentDomain } from '@/utils/domain';
const url = getCurrentDomain();

// ✅ 새로운 코드
import { getSiteUrl } from '@/utils/domain';
const url = getSiteUrl();
```

### 일괄 변경 명령어

```bash
# 프로젝트 전체에서 getCurrentDomain을 getSiteUrl로 변경
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/getCurrentDomain/getSiteUrl/g'
```

## 📊 성능 고려사항

- **캐싱**: 함수 호출 결과를 캐싱하여 중복 계산 방지
- **메모이제이션**: React 컴포넌트에서 useMemo 사용
- **정적 생성**: 빌드 타임에 값이 결정되면 정적 생성 활용

```typescript
// ✅ 성능 최적화 예시
import { useMemo } from 'react';
import { getSiteUrl } from '@/utils/domain';

function MyComponent() {
  const siteUrl = useMemo(() => getSiteUrl(), []);
  
  return <div>사이트: {siteUrl}</div>;
}
```

## 🛡️ 에러 처리

```typescript
import { getSiteUrl, getDomain } from '@/utils/domain';

try {
  const siteUrl = getSiteUrl();
  const domain = getDomain();
  
  // 정상 처리
} catch (error) {
  // 에러 처리
  console.error('도메인 감지 실패:', error);
}
```

---

**마지막 업데이트**: 2025년 1월 21일  
**버전**: 1.0.0  
**담당자**: AWEKERS 개발팀 