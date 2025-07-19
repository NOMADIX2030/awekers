# awekers

아커스 블로그 홈페이지 - Next.js 기반의 현대적인 블로그 플랫폼

## 🚀 프로젝트 소개

awekers는 Next.js 15와 Prisma를 활용한 현대적인 블로그 플랫폼입니다. SEO 최적화, 관리자 대시보드, 실시간 분석 기능을 제공합니다.

## ✨ 주요 기능

- 📝 **블로그 포스팅**: 마크다운 지원 블로그 작성
- 🔍 **SEO 최적화**: 메타 태그, 구조화된 데이터 지원
- 📊 **관리자 대시보드**: 사용자 관리, 통계 분석
- 🎨 **반응형 디자인**: 모바일 우선 디자인
- 🔐 **인증 시스템**: 관리자 로그인
- 📈 **실시간 분석**: 페이지 방문 통계

## 🛠 기술 스택

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL, Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (예정)

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
# .env 파일에서 데이터베이스 정보 설정
```

### 4. 데이터베이스 설정
```bash
npx prisma generate
npx prisma db push
```

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
awekers/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # 관리자 페이지
│   │   ├── api/            # API 라우트
│   │   ├── blog/           # 블로그 페이지
│   │   └── components/     # 공통 컴포넌트
│   ├── lib/                # 유틸리티 함수
│   └── prisma/             # 데이터베이스 스키마
├── public/                 # 정적 파일
└── scripts/                # 배포 스크립트
```

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

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
