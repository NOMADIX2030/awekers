# 관리자 UI/UX 프레임워크 가이드

## 📋 개요

이 프레임워크는 모든 관리자 페이지에서 일관된 UI/UX를 제공하기 위한 공통 컴포넌트 시스템입니다.

## 🎯 목표

- **일관된 폭**: 모든 페이지가 PC에서 1024px 고정 폭을 가짐
- **반응형 디자인**: iPad (768px-1366px) 및 iPhone 15 (393px-430px) 최적화
- **재사용성**: 새로운 관리자 페이지 추가 시 빠른 개발
- **유지보수성**: 중앙화된 디자인 시스템
- **중복 방지**: 레이아웃 구조의 중복을 방지하여 성능 최적화

## 🚨 주요 문제 해결

### 1. 관리자 패널 2개 출력 문제
**문제**: 관리자 페이지에서 사이드바가 2개 출력되는 현상
**원인**: `layout.tsx`와 `AdminLayout` 컴포넌트가 모두 레이아웃을 제공
**해결**: 
- `layout.tsx`: 사이드바와 메인 컨테이너만 담당
- `AdminLayout`: 페이지 헤더와 콘텐츠만 담당

### 2. 대시보드 데이터 로딩 실패
**문제**: 대시보드에서 데이터를 불러올 수 없음
**원인**: API 호출 시 Authorization 헤더 누락
**해결**: 모든 API 호출에 `'Authorization': 'Bearer admin-token'` 헤더 추가

### 3. 레이아웃 구조 개선
**이전**: 중복된 레이아웃 구조로 인한 성능 저하
**개선**: 명확한 책임 분리로 중복 제거

## 🏗️ 핵심 컴포넌트

### 1. AdminLayout (페이지 레이아웃)
각 관리자 페이지의 헤더와 콘텐츠를 담당하는 컴포넌트입니다.

```tsx
import AdminLayout from '../components/AdminLayout';

const MyAdminPage = () => {
  return (
    <AdminLayout 
      title="페이지 제목"
      description="페이지 설명"
    >
      {/* 페이지 콘텐츠 */}
    </AdminLayout>
  );
};
```

**Props:**
- `title`: 페이지 제목 (필수)
- `description`: 페이지 설명 (선택)

**특징:**
- 페이지 헤더만 담당 (사이드바는 `layout.tsx`에서 처리)
- 1024px 고정 폭은 `layout.tsx`에서 처리
- 중복 레이아웃 구조 방지

### 2. AdminCard
표준화된 카드 컴포넌트입니다.

```tsx
import AdminCard from '../components/AdminCard';

<AdminCard 
  title="카드 제목"
  description="카드 설명"
  padding="md"
  onClick={() => console.log('클릭')}
>
  {/* 카드 콘텐츠 */}
</AdminCard>
```

**Props:**
- `title`: 카드 제목 (선택)
- `description`: 카드 설명 (선택)
- `padding`: 패딩 크기 (`sm`, `md`, `lg`) - 기본값: `md`
- `onClick`: 클릭 이벤트 핸들러 (선택)
- `className`: 추가 CSS 클래스 (선택)

### 3. AdminGrid
반응형 그리드 시스템입니다.

```tsx
import AdminGrid from '../components/AdminGrid';

<AdminGrid cols={4} gap="md">
  <div>아이템 1</div>
  <div>아이템 2</div>
  <div>아이템 3</div>
  <div>아이템 4</div>
</AdminGrid>
```

**Props:**
- `cols`: 그리드 컬럼 수 (1-6) - 기본값: 1
- `gap`: 간격 크기 (`sm`, `md`, `lg`) - 기본값: `md`
- `className`: 추가 CSS 클래스 (선택)

**반응형 동작:**
- `cols={1}`: `grid-cols-1`
- `cols={2}`: `grid-cols-1 sm:grid-cols-2`
- `cols={3}`: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- `cols={4}`: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

### 4. StatCard
통계 데이터 전용 카드입니다.

```tsx
import { StatCard } from '../components/AdminCard';

<StatCard
  title="총 방문자"
  value={1234}
  icon="👥"
  trend="up"
  change={12.5}
/>
```

**Props:**
- `title`: 통계 제목
- `value`: 통계 값
- `icon`: 아이콘 (이모지 또는 텍스트)
- `trend`: 트렌드 방향 (`up`, `down`, `neutral`) - 선택
- `change`: 변화율 (%) - 선택

## 🏛️ 레이아웃 구조

### Next.js App Router 구조
```
src/app/admin/
├── layout.tsx              # 전체 관리자 레이아웃 (사이드바 + 1024px 컨테이너)
├── components/
│   ├── AdminLayout.tsx     # 페이지 헤더 컴포넌트
│   ├── AdminSidebar.tsx    # 사이드바 컴포넌트
│   ├── AdminCard.tsx       # 카드 컴포넌트
│   └── AdminGrid.tsx       # 그리드 컴포넌트
├── dashboard/
│   └── page.tsx           # 대시보드 페이지
├── users/
│   └── page.tsx           # 사용자 관리 페이지
└── ...
```

### 레이아웃 계층 구조
1. **`layout.tsx`**: 전체 관리자 레이아웃 (사이드바 + 메인 영역)
2. **`AdminLayout`**: 페이지별 헤더와 콘텐츠 래퍼
3. **페이지 컴포넌트**: 실제 페이지 콘텐츠

### 중복 방지 설계
- **이전**: `AdminLayout` 컴포넌트가 사이드바와 레이아웃을 모두 담당
- **개선**: `layout.tsx`가 사이드바와 1024px 컨테이너를 담당, `AdminLayout`은 헤더만 담당
- **결과**: 중복된 사이드바 출력 문제 해결, 성능 향상

## 🔧 API 호출 가이드

### 인증 헤더 추가
모든 관리자 API 호출에는 Authorization 헤더를 포함해야 합니다:

```tsx
const fetchData = async () => {
  try {
    const response = await fetch('/api/admin/dashboard', {
      headers: {
        'Authorization': 'Bearer admin-token'
      }
    });
    const data = await response.json();
    // 데이터 처리
  } catch (error) {
    console.error('API 호출 오류:', error);
  }
};
```

### 일반적인 API 패턴
```tsx
// GET 요청
const response = await fetch('/api/admin/endpoint', {
  headers: { 'Authorization': 'Bearer admin-token' }
});

// POST 요청
const response = await fetch('/api/admin/endpoint', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer admin-token'
  },
  body: JSON.stringify(data)
});

// PUT/PATCH 요청
const response = await fetch('/api/admin/endpoint', {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer admin-token'
  },
  body: JSON.stringify(data)
});

// DELETE 요청
const response = await fetch('/api/admin/endpoint', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer admin-token' }
});
```

## 📱 반응형 디자인

### 브레이크포인트
- **모바일**: 393px-430px (iPhone 15)
- **태블릿**: 768px-1366px (iPad)
- **데스크톱**: 1024px 고정 폭

### 반응형 클래스
```tsx
// 패딩
className="p-3 sm:p-4 lg:p-6"

// 텍스트 크기
className="text-sm sm:text-base lg:text-lg"

// 그리드
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"

// 간격
className="gap-4 sm:gap-6 lg:gap-8"
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: `blue-600`, `blue-700`
- **Success**: `green-600`, `green-700`
- **Warning**: `yellow-600`, `yellow-700`
- **Error**: `red-600`, `red-700`
- **Neutral**: `gray-50`, `gray-100`, `gray-200`, `gray-600`, `gray-900`

### 타이포그래피
- **제목**: `text-2xl sm:text-3xl font-bold`
- **부제목**: `text-lg sm:text-xl font-semibold`
- **본문**: `text-sm sm:text-base`
- **설명**: `text-xs sm:text-sm text-gray-600`

### 간격 시스템
- **XS**: `space-y-2`, `gap-2`
- **SM**: `space-y-3`, `gap-3`
- **MD**: `space-y-4`, `gap-4`
- **LG**: `space-y-6`, `gap-6`
- **XL**: `space-y-8`, `gap-8`

## 📝 사용 예시

### 기본 페이지 구조
```tsx
"use client";
import React from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminCard from '../components/AdminCard';
import AdminGrid from '../components/AdminGrid';

const MyAdminPage: React.FC = () => {
  return (
    <AdminLayout 
      title="내 관리자 페이지" 
      description="페이지 설명"
    >
      {/* 페이지 콘텐츠 */}
      <AdminCard title="카드 제목">
        카드 내용
      </AdminCard>
    </AdminLayout>
  );
};
```

### 통계 페이지 예시
```tsx
"use client";
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminCard, { StatCard } from '../components/AdminCard';
import AdminGrid from '../components/AdminGrid';

const StatsPage: React.FC = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <AdminLayout title="통계" description="사이트 통계를 확인하세요">
      <AdminGrid cols={4}>
        <StatCard title="총 방문자" value={data?.visitors || 0} icon="👥" />
        <StatCard title="총 게시글" value={data?.posts || 0} icon="📄" />
        <StatCard title="총 댓글" value={data?.comments || 0} icon="💬" />
        <StatCard title="총 사용자" value={data?.users || 0} icon="👤" />
      </AdminGrid>
    </AdminLayout>
  );
};
```

## 🚀 새로운 페이지 추가 가이드

### 1. 페이지 파일 생성
```tsx
// src/app/admin/my-page/page.tsx
"use client";
import React from 'react';
import AdminLayout from '../components/AdminLayout';

const MyPage: React.FC = () => {
  return (
    <AdminLayout 
      title="내 페이지" 
      description="페이지 설명"
    >
      {/* 페이지 콘텐츠 */}
    </AdminLayout>
  );
};

export default MyPage;
```

### 2. 사이드바 메뉴 추가
`src/app/admin/components/AdminSidebar.tsx`에서 메뉴 항목 추가:

```tsx
const menuItems = [
  // ... 기존 메뉴
  {
    label: "내 페이지",
    href: "/admin/my-page",
    icon: "📄"
  }
];
```

### 3. API 라우트 생성 (필요시)
```tsx
// src/app/api/admin/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 인증 확인
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  // 데이터 처리
  return NextResponse.json({ data: '응답 데이터' });
}
```

## 🔍 문제 해결

### 일반적인 문제들

1. **사이드바가 2개 출력됨**
   - 해결: `AdminLayout`에서 사이드바 관련 코드 제거
   - 확인: `layout.tsx`만 사이드바를 렌더링하는지 확인

2. **API 데이터가 로딩되지 않음**
   - 해결: Authorization 헤더 추가
   - 확인: 브라우저 개발자 도구에서 네트워크 탭 확인

3. **레이아웃이 깨짐**
   - 해결: AdminLayout 컴포넌트 사용
   - 확인: 1024px 고정 폭이 적용되었는지 확인

4. **반응형이 작동하지 않음**
   - 해결: Tailwind CSS 반응형 클래스 사용
   - 확인: `sm:`, `lg:` 접두사 사용

## 📚 추가 리소스

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [React Hooks 문서](https://react.dev/reference/react/hooks) 
 
 