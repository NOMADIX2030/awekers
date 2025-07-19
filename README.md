# Awekers - 현대적인 블로그 플랫폼

[![Version](https://img.shields.io/badge/version-v0.1.0-blue.svg)](https://github.com/NOMADIX2030/awekers/releases/tag/v0.1.0)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

아커스 블로그 홈페이지 - Next.js 15 기반의 현대적인 블로그 플랫폼

**현재 버전**: v0.1.0 (2025-01-25)

## 🚀 프로젝트 개요

Awekers는 Next.js 15, React 19, TypeScript, Prisma를 활용한 현대적인 블로그 플랫폼입니다. SEO 최적화, 실시간 분석, AI 기반 콘텐츠 생성, 관리자 대시보드 등 다양한 기능을 제공합니다.

## ✨ 주요 기능

### 📝 콘텐츠 관리
- **블로그 포스팅**: 마크다운 지원 블로그 작성 및 편집
- **AI 블로그 생성**: AI를 활용한 자동 블로그 포스팅 생성
- **이미지 관리**: Unsplash API 연동으로 고품질 이미지 자동 삽입
- **태그 시스템**: 카테고리별 블로그 분류 및 필터링

### 🔍 SEO 최적화
- **메타 태그 자동 생성**: 제목, 설명, 키워드 자동 설정
- **구조화된 데이터**: 검색엔진 최적화를 위한 스키마 마크업
- **SERP 분석**: 검색엔진 결과 페이지 성과 분석
- **사이트맵**: 자동 사이트맵 생성

### 📊 분석 및 통계
- **실시간 방문자 추적**: 페이지별 방문자 통계
- **사용자 행동 분석**: 체류시간, 이탈률, 페이지뷰 분석
- **트래픽 소스 분석**: 유입 경로별 통계
- **키워드 성과 분석**: 검색 키워드별 성과 추적

### 🔐 관리자 시스템
- **관리자 대시보드**: 종합적인 사이트 현황 모니터링
- **사용자 관리**: 회원 관리 및 권한 설정
- **댓글 관리**: 댓글 승인, 숨김, 삭제 기능
- **신고 시스템**: 부적절한 댓글 신고 및 처리

### 🎨 사용자 인터페이스
- **반응형 디자인**: 모바일 우선 반응형 레이아웃
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 변경
- **접근성**: WCAG 가이드라인 준수
- **성능 최적화**: Next.js 15의 최신 기능 활용

## 🛠 기술 스택

### Frontend
- **Next.js 15.4.1**: App Router 기반 서버 사이드 렌더링
- **React 19.1.0**: 최신 React 기능 활용
- **TypeScript 5**: 타입 안정성 보장
- **Tailwind CSS 4**: 유틸리티 퍼스트 CSS 프레임워크

### Backend & Database
- **Prisma 6.12.0**: 타입 안전한 데이터베이스 ORM
- **MySQL**: 관계형 데이터베이스
- **PlanetScale**: 클라우드 데이터베이스 호스팅

### 외부 API & 서비스
- **OpenAI API**: AI 기반 콘텐츠 생성
- **Unsplash API**: 고품질 이미지 제공
- **Google Analytics**: 웹 분석 서비스
- **Vercel Analytics**: 실시간 성능 모니터링

### 개발 도구
- **ESLint**: 코드 품질 관리
- **Turbopack**: 빠른 개발 서버
- **bcrypt**: 비밀번호 암호화

## 📁 프로젝트 구조

```
awekers/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── admin/                    # 관리자 페이지
│   │   │   ├── dashboard/            # 대시보드
│   │   │   ├── blog/                 # 블로그 관리
│   │   │   ├── blog-write/           # 블로그 작성
│   │   │   ├── users/                # 사용자 관리
│   │   │   ├── comments/             # 댓글 관리
│   │   │   ├── site-settings/        # 사이트 설정
│   │   │   ├── ai-settings/          # AI 설정
│   │   │   ├── serp-analysis/        # SERP 분석
│   │   │   └── components/           # 관리자 전용 컴포넌트
│   │   ├── api/                      # API 라우트
│   │   │   ├── admin/                # 관리자 API
│   │   │   ├── blog/                 # 블로그 API
│   │   │   ├── analytics/            # 분석 API
│   │   │   ├── ai-blog/              # AI 블로그 API
│   │   │   ├── auth/                 # 인증 API
│   │   │   └── tag-stats/            # 태그 통계 API
│   │   ├── blog/                     # 블로그 페이지
│   │   ├── tag/                      # 태그별 페이지
│   │   ├── login/                    # 로그인 페이지
│   │   ├── components/               # 공통 컴포넌트
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   ├── page.tsx                  # 홈페이지
│   │   └── globals.css               # 전역 스타일
│   ├── lib/                          # 유틸리티 함수
│   │   ├── prisma.ts                 # Prisma 클라이언트
│   │   └── google-analytics.ts       # Google Analytics 설정
│   └── prisma/                       # 데이터베이스 스키마
│       ├── schema.prisma             # Prisma 스키마
│       └── seed.ts                   # 초기 데이터
├── public/                           # 정적 파일
├── scripts/                          # 배포 스크립트
├── package.json                      # 프로젝트 설정
├── next.config.ts                    # Next.js 설정
├── tailwind.config.js                # Tailwind CSS 설정
├── tsconfig.json                     # TypeScript 설정
├── eslint.config.mjs                 # ESLint 설정
└── vercel.json                       # Vercel 배포 설정
```

## 🗄️ 데이터베이스 스키마

### 핵심 모델
- **Blog**: 블로그 포스트 정보
- **User**: 사용자 계정 정보
- **Comment**: 댓글 시스템
- **SiteSetting**: 사이트 설정

### 분석 모델
- **PageVisit**: 페이지 방문 기록
- **DailyStats**: 일별 통계
- **HourlyStats**: 시간별 통계
- **TrafficSource**: 트래픽 소스 분석
- **SearchKeyword**: 검색 키워드 분석
- **PagePerformance**: 페이지 성과 분석
- **SERPInsights**: SERP 인사이트

### 관리 모델
- **CommentLike**: 댓글 좋아요
- **CommentReport**: 댓글 신고
- **GoogleAnalyticsConfig**: Google Analytics 설정

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/NOMADIX2030/awekers.git
cd awekers
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
```bash
cp .env.example .env
```

필요한 환경변수:
```env
# 데이터베이스
DATABASE_URL="mysql://..."

# AI 서비스
AI_API_KEY="sk-..."

# 이미지 서비스
UNSPLASH_ACCESS_KEY="..."
UNSPLASH_SECRET_KEY="..."
UNSPLASH_APP_ID="..."

# 사이트 설정
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. 데이터베이스 설정
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📊 주요 API 엔드포인트

### 블로그 관련
- `GET /api/blog` - 블로그 목록 조회
- `GET /api/blog/[id]` - 특정 블로그 조회
- `POST /api/blog` - 새 블로그 작성
- `POST /api/blog/[id]/view` - 조회수 증가

### 관리자 관련
- `GET /api/admin/dashboard` - 대시보드 데이터
- `GET /api/admin/users` - 사용자 목록
- `POST /api/admin/reports` - 신고 처리

### 분석 관련
- `POST /api/analytics/track` - 방문자 추적
- `GET /api/tag-stats` - 태그별 통계
- `GET /api/admin/serp-analysis` - SERP 분석

### AI 관련
- `POST /api/ai-blog` - AI 블로그 생성
- `GET /api/blog/unsplash` - Unsplash 이미지 검색

## 🎯 주요 기능 상세

### AI 블로그 생성
- OpenAI API를 활용한 자동 블로그 포스팅
- 제목, 요약, 본문 자동 생성
- Unsplash API 연동으로 관련 이미지 자동 삽입
- 태그 자동 분류 및 설정

### 실시간 분석
- 페이지별 방문자 추적
- 사용자 행동 패턴 분석
- 트래픽 소스별 성과 분석
- 실시간 대시보드 업데이트

### SEO 최적화
- 메타 태그 자동 생성
- Open Graph 및 Twitter Card 지원
- 구조화된 데이터 마크업
- 사이트맵 자동 생성

### 관리자 대시보드
- 종합적인 사이트 현황 모니터링
- 사용자 관리 및 권한 설정
- 댓글 관리 및 신고 처리
- 사이트 설정 관리

## 🔧 개발 가이드

### 코드 스타일
- TypeScript 엄격 모드 사용
- ESLint 규칙 준수
- 컴포넌트 기반 아키텍처
- 함수형 프로그래밍 패러다임

### 성능 최적화
- Next.js 15의 최신 기능 활용
- 이미지 최적화 및 lazy loading
- 코드 스플리팅 및 번들 최적화
- 서버 사이드 렌더링 활용

### 보안
- bcrypt를 통한 비밀번호 암호화
- API 라우트 보안 검증
- SQL 인젝션 방지 (Prisma ORM)
- XSS 공격 방지

## 🚀 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### 환경변수 설정
Vercel 대시보드에서 다음 환경변수를 설정하세요:
- `DATABASE_URL`
- `AI_API_KEY`
- `UNSPLASH_ACCESS_KEY`
- `UNSPLASH_SECRET_KEY`
- `UNSPLASH_APP_ID`

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💻 개발자

**NOMADIX2030** - [GitHub](https://github.com/NOMADIX2030)

## 📞 지원

프로젝트에 대한 문의사항이나 버그 리포트는 GitHub Issues를 통해 제출해주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
