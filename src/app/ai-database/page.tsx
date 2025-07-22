import { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'AI 데이터베이스 커스텀 개발 | AWEKERS - 지능형 데이터 분석 자동화 서비스',
  description: 'AWEKERS AI 데이터베이스로 비즈니스 인사이트를 자동화하세요. 데이터 분석, 예측 모델링, 실시간 알림까지 모든 업종 맞춤형 AI DB 솔루션을 제공합니다.',
  keywords: ['AI 데이터베이스', '데이터 분석 자동화', 'AI 예측 모델', '커스텀 DB 개발', 'AWEKERS'],
  openGraph: {
    title: 'AI 데이터베이스 커스텀 개발 | AWEKERS',
    description: 'AI가 데이터를 지능으로 변환합니다. 자동 분석, 예측, 알림까지 모든 것이 가능한 맞춤형 DB',
    url: 'https://awekers.com/ai-database',
    siteName: 'AWEKERS',
    images: [
      {
        url: '/images/ai-database-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AWEKERS AI 데이터베이스 커스텀 개발 서비스',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 데이터베이스 커스텀 개발 | AWEKERS',
    description: 'AI가 데이터를 지능으로 변환합니다. 분석, 예측, 자동화까지 모든 것이 가능',
    images: ['/images/ai-database-twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// JSON-LD 구조화 데이터
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://awekers.com/#organization",
      "name": "AWEKERS",
      "url": "https://awekers.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://awekers.com/logo.png",
        "width": 400,
        "height": 100
      },
      "description": "검색엔진최적화(SEO), 홈페이지 제작, AI 챗봇, AI 블로그를 전문으로 하는 웹앱개발과 마케팅 서비스 IT 솔루션 회사"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://awekers.com/ai-database#service",
      "name": "AWEKERS AI 데이터베이스 커스텀 개발",
      "provider": {
        "@id": "https://awekers.com/#organization"
      },
      "description": "AI 기반 데이터 분석, 예측 모델링, 실시간 알림을 통해 비즈니스 데이터를 지능으로 변환하는 맞춤형 데이터베이스 솔루션",
      "applicationCategory": "Database Management Software",
      "operatingSystem": "Web Browser",
      "offers": [
        {
          "@type": "Offer",
          "name": "스타트업 DB 솔루션",
          "description": "소규모 데이터를 위한 기본 AI 분석 및 자동화",
          "price": "790000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer", 
          "name": "비즈니스 DB 솔루션",
          "description": "중규모 데이터를 위한 고급 AI 분석 및 예측",
          "price": "1490000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer",
          "name": "엔터프라이즈 DB 솔루션", 
          "description": "대규모 데이터를 위한 완전 맞춤형 AI DB 시스템",
          "price": "2990000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        }
      ],
      "featureList": [
        "AI 데이터 요약 리포트 자동 생성",
        "트렌드 및 이상 탐지",
        "자연어 쿼리 → SQL 변환",
        "데이터 클렌징 및 정규화",
        "누락 데이터 예측 보완",
        "매출/수요 예측 모델링",
        "실시간 알림 시스템",
        "API 및 대시보드 제공"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://awekers.com/ai-database#webpage", 
      "url": "https://awekers.com/ai-database",
      "name": "AI 데이터베이스 커스텀 개발 | AWEKERS",
      "isPartOf": {
        "@id": "https://awekers.com/#website"
      },
      "about": {
        "@id": "https://awekers.com/ai-database#service"
      },
      "description": "AWEKERS AI 데이터베이스로 비즈니스 인사이트를 자동화하세요. 데이터 분석, 예측 모델링, 실시간 알림까지 모든 업종 맞춤형 AI DB 솔루션을 제공합니다."
    }
  ]
}

export default function AIDatabasePage() {
  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 text-sm font-medium text-cyan-700 mb-6 sm:mb-8">
                <span className="relative mr-2">
                  <span className="animate-pulse absolute inline-flex h-2 w-2 rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                업종별 맞춤형 AI DB 솔루션
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
                데이터를 <span className="text-cyan-600">지능</span>으로
                <br className="hidden sm:block" />
                <span className="block mt-2">변환하는 AI</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
                <strong>AWEKERS AI 데이터베이스</strong><br className="sm:hidden" />
                분석•예측•자동화, 모든 것이 가능한 맞춤형 DB
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-3 py-2 bg-cyan-50 rounded-lg">
                    <svg className="w-4 h-4 text-cyan-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <span className="text-xs font-medium text-gray-700">자동 분석</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-3 py-2 bg-teal-50 rounded-lg">
                    <svg className="w-4 h-4 text-teal-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span className="text-xs font-medium text-gray-700">AI 예측</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-3 py-2 bg-blue-50 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1H5.5a3 3 0 00-2.121.879l-.707-.707zM15 6h4v4"></path>
                    </svg>
                    <span className="text-xs font-medium text-gray-700">실시간 알림</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-3 py-2 bg-indigo-50 rounded-lg">
                    <svg className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                    <span className="text-xs font-medium text-gray-700">대시보드</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#demo" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-cyan-600 text-white text-lg font-semibold rounded-lg hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-300"
                  aria-label="AI 데이터베이스 체험해보기"
                >
                  무료 체험하기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </a>
                <a 
                  href="#features" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  aria-label="AI DB 기능 살펴보기"
                >
                  기능 살펴보기
                </a>
              </div>
            </div>
          </div>
          
          {/* Background Animation */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10" aria-hidden="true">
            <div className="absolute top-16 left-8 w-32 h-32 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full opacity-20 animate-spin background-animation-spin-12s"></div>
            <div className="absolute top-32 right-12 w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-20 animate-spin background-animation-spin-12s-delay-3s"></div>
            <div className="absolute bottom-24 left-1/4 w-40 h-40 bg-gradient-to-br from-teal-100 to-indigo-100 rounded-full opacity-20 animate-spin background-animation-spin-12s-delay-6s"></div>
          </div>
        </section>

        {/* 5가지 핵심 기능 데모 */}
        <section id="demo" className="py-12 sm:py-16 bg-gray-50" aria-labelledby="demo-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 id="demo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-cyan-600">5가지</span> AI 데이터 처리 기능
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                복잡한 데이터를 AI가 지능적으로 분석하고 처리하는 과정을 확인하세요
              </p>
            </div>

            <div className="space-y-8 lg:space-y-12">
              {/* 1. 데이터 분석 및 요약 자동화 */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">📊 데이터 분석 및 요약 자동화</h3>
                    <p className="text-gray-600 text-sm mt-1">AI가 대량의 데이터를 분석하여 핵심 인사이트를 자동 추출</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">🧠 AI 데이터 요약 리포트</div>
                      <div className="text-xs text-gray-600">매일/매주 DB 분석 → GPT 기반 자연어 리포트</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">📈 트렌드 및 이상 탐지</div>
                      <div className="text-xs text-gray-600">매출 급감, 사용자 이탈 증가 등 자동 감지</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">🔎 자연어 쿼리 → SQL 변환</div>
                      <div className="text-xs text-gray-600">&quot;최근 매출이 높은 상품은?&quot; → 자동 SQL 생성</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">🔁 주기적 요약 메일 발송</div>
                      <div className="text-xs text-gray-600">신규/이탈 고객 수 등 요약 메일 자동 전송</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6">
                    <div className="text-sm font-medium text-cyan-800 mb-3">💻 실시간 분석 예시</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span className="text-gray-700">총 주문 건수 (오늘)</span>
                        <span className="font-bold text-green-600">+124건 ↗</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span className="text-gray-700">신규 고객 (이번주)</span>
                        <span className="font-bold text-blue-600">87명</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span className="text-gray-700">이탈률 변화</span>
                        <span className="font-bold text-red-600">+2.1% ⚠️</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-cyan-100 rounded-lg">
                      <div className="text-xs text-cyan-800 font-medium">🤖 AI 요약</div>
                      <div className="text-xs text-cyan-700 mt-1">&quot;이탈률이 평소보다 높아졌습니다. 고객 만족도 조사를 권장합니다.&quot;</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. AI 기반 데이터 처리 자동화 */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">🤖 AI 기반 데이터 처리 자동화</h3>
                    <p className="text-gray-600 text-sm mt-1">머신러닝으로 데이터를 지능적으로 정제하고 보완</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">📤 데이터 클렌징/정규화</div>
                      <div className="text-xs text-gray-600">주소/이름/번호 등 비정형 필드 자동 정규화</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">🧮 누락 데이터 예측 보완</div>
                      <div className="text-xs text-gray-600">배송시간 예측, 고객 등급 추정 등</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">🧠 AI 추천/분류 태깅</div>
                      <div className="text-xs text-gray-600">상품/회원/문의글 등에 자동 분류 태그 부여</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">🔄 ETL 자동화 + AI 보정</div>
                      <div className="text-xs text-gray-600">원시데이터 → AI 가공 후 자동 테이블 갱신</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6">
                    <div className="text-sm font-medium text-teal-800 mb-3">⚙️ 처리 과정 시뮬레이션</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-700">데이터 수집</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">완료</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-700">AI 정제</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">완료</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-xs text-gray-700">누락 데이터 예측</span>
                        </div>
                        <span className="text-xs text-yellow-600 font-medium">진행중...</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-500">자동 분류</span>
                        </div>
                        <span className="text-xs text-gray-500">대기</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 알림 및 트리거 기반 자동 처리 */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1H5.5a3 3 0 00-2.121.879l-.707-.707zM15 6h4v4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">📬 알림 및 트리거 기반 자동 처리</h3>
                    <p className="text-gray-600 text-sm mt-1">실시간 모니터링으로 중요한 변화를 즉시 감지하고 대응</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">🛎 이상 상황 알림</div>
                      <div className="text-xs text-gray-600">Slack, 카톡 등으로 실시간 관리자 알림</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">📅 스케줄 기반 자동 실행</div>
                      <div className="text-xs text-gray-600">매일 오전 6시 리포트 생성 → PDF 저장</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">🔔 조건 기반 알림 트리거</div>
                      <div className="text-xs text-gray-600">주문 수 100건 도달 시 알림 + 등급 변경</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="text-sm font-medium text-blue-800 mb-3">🔔 실시간 알림 센터</div>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-red-700">매출 급감 감지</div>
                          <div className="text-xs text-red-600">서울 지역 매출 -15% (2시간 전)</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-yellow-700">재고 부족 예상</div>
                          <div className="text-xs text-yellow-600">인기상품 A 재고 &lt; 10개</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-green-700">목표 달성</div>
                          <div className="text-xs text-green-600">월간 주문 목표 100% 달성</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="stats-heading" className="sr-only">AI 데이터베이스 성과 통계</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-600 mb-2">99.2%</div>
                <div className="text-sm sm:text-base text-gray-600">데이터 정확도</div>
                <div className="text-xs text-gray-500 mt-1">AI 분석 기준</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-600 mb-2">15초</div>
                <div className="text-sm sm:text-base text-gray-600">평균 처리 시간</div>
                <div className="text-xs text-gray-500 mt-1">10만 행 기준</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-600 mb-2">24/7</div>
                <div className="text-sm sm:text-base text-gray-600">실시간 모니터링</div>
                <div className="text-xs text-gray-500 mt-1">연중무휴</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-600 mb-2">85%</div>
                <div className="text-sm sm:text-base text-gray-600">업무 효율 향상</div>
                <div className="text-xs text-gray-500 mt-1">고객 평균</div>
              </div>
            </div>
          </div>
        </section>

        {/* 업종별 활용 사례 */}
        <section id="features" className="py-16 sm:py-20 bg-gray-50" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="features-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-cyan-600">업종별</span> AI DB 활용 사례
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                각 업종의 특성에 맞게 최적화된 AI 데이터베이스 솔루션을 확인하세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { 
                  industry: "쇼핑몰", 
                  icon: "🛍", 
                  features: ["인기 상품 트렌드 자동 분석", "재고 예측 시스템", "AI 상품 추천 엔진"],
                  example: "실시간 재고 최적화로 매출 20% 증가",
                  color: "pink"
                },
                { 
                  industry: "교육기관", 
                  icon: "🧑‍🏫", 
                  features: ["학생 활동 패턴 분석", "성적 추세 예측", "이상 학습자 조기 탐지"],
                  example: "학습 부진 학생을 3주 앞서 예측",
                  color: "purple"
                },
                { 
                  industry: "병원/의료", 
                  icon: "🏥", 
                  features: ["환자 수 패턴 분석", "질병 트렌드 예측", "대기시간 최적화"],
                  example: "환자 대기시간 40% 단축",
                  color: "red"
                },
                { 
                  industry: "금융/회계", 
                  icon: "🏦", 
                  features: ["거래 이상 탐지", "분기별 재무 자동 요약", "투자 리스크 분석"],
                  example: "이상 거래 탐지율 99.8% 달성",
                  color: "green"
                },
                { 
                  industry: "SaaS 플랫폼", 
                  icon: "💻", 
                  features: ["고객 행동 기반 알림", "유입 경로 자동 분석", "이탈 예측 모델"],
                  example: "고객 이탈률 35% 감소",
                  color: "blue"
                },
                { 
                  industry: "제조업", 
                  icon: "🏭", 
                  features: ["생산량 예측", "품질 이상 탐지", "설비 가동률 분석"],
                  example: "불량률 60% 감소",
                  color: "gray"
                },
              ].map((item, index) => (
                <article key={item.industry} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-cyan-500">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3" aria-hidden="true">{item.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900">{item.industry}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">🚀 AI 기능</div>
                    <ul className="text-sm text-gray-600 space-y-1" role="list">
                      {item.features.map((feature, idx) => (
                        <li key={`${item.industry}-feature-${idx}`} className="flex items-start">
                          <svg className="w-3 h-3 text-cyan-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <div className="text-xs text-cyan-800 font-medium mb-1">📈 성과 사례</div>
                    <div className="text-sm text-gray-700">{item.example}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 기술 스택 섹션 */}
        <section className="py-16 sm:py-20" aria-labelledby="tech-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="tech-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-cyan-600">검증된</span> 기술 스택
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                업계 최고 수준의 AI/ML 기술과 안정적인 인프라로 완성된 솔루션
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* AI/ML 기술 */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">🧠 AI/ML 엔진</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">OpenAI GPT-4</span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">최신</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">LangChain</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Pro</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">sklearn, Prophet</span>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">ML</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">TensorFlow</span>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">DL</span>
                  </div>
                </div>
              </div>

              {/* 데이터베이스 */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">🗄️ 데이터베이스</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">MySQL</span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">관계형</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">PostgreSQL</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">고급</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">MongoDB</span>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">NoSQL</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">Firebase</span>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">실시간</span>
                  </div>
                </div>
              </div>

              {/* 개발/배포 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">⚙️ 개발/배포</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">Next.js + Python</span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">풀스택</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">FastAPI</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">고성능</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">Chart.js</span>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">시각화</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-700">AWS / Vercel</span>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">클라우드</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 패키지 섹션 */}
        <section id="packages" className="py-16 sm:py-20 bg-gray-50" aria-labelledby="packages-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="packages-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                데이터 규모에 맞는 <span className="text-cyan-600">AI DB</span> 플랜
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                스타트업부터 엔터프라이즈까지, 데이터 규모와 요구사항에 최적화된 솔루션
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Startup Package */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-cyan-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">스타트업 DB 솔루션</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩790,000</div>
                  <div className="text-gray-600">월 10만 행 처리</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">💡 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 초기 스타트업</li>
                    <li>• 소규모 데이터</li>
                    <li>• AI 분석 첫 도입</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🤖 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">AI 데이터 요약 리포트</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">기본 트렌드 분석</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">주간 리포트 메일</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">기본 대시보드</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300" aria-label="스타트업 DB 솔루션 선택하기">
                  스타트업 선택하기
                </button>
              </article>

              {/* Business Package - Popular */}
              <article className="relative bg-white border-2 border-cyan-500 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium">인기</span>
                </div>
                
                <header className="mb-6">
                  <div className="text-sm font-medium text-cyan-600 mb-2">비즈니스 DB 솔루션</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩1,490,000</div>
                  <div className="text-gray-600">월 100만 행 처리</div>
                  <div className="text-sm text-green-600 font-medium">(행당 ₩1.49)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">🎯 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 성장 중인 기업</li>
                    <li>• 중규모 데이터</li>
                    <li>• 본격적 AI 활용</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🚀 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 AI 분석 + 예측</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">실시간 이상 탐지</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">자연어 쿼리 지원</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">API 제공</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 대시보드</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">Slack/카톡 알림</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-4 focus:ring-cyan-300" aria-label="비즈니스 DB 솔루션 선택하기">
                  비즈니스 선택하기
                </button>
              </article>

              {/* Enterprise Package */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-indigo-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-indigo-600 mb-2">엔터프라이즈 DB 솔루션</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩2,990,000</div>
                  <div className="text-gray-600">무제한 처리</div>
                  <div className="text-sm text-green-600 font-medium">(맞춤형 AI 모델 포함)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">👑 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 대기업/공공기관</li>
                    <li>• 대규모 데이터</li>
                    <li>• 완전 맞춤 개발</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">⭐ 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">맞춤형 AI 모델 개발</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">무제한 데이터 처리</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">전담 기술팀 배정</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">온프레미스 배포 지원</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">24/7 전담 지원</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 보안 인증</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300" aria-label="엔터프라이즈 DB 솔루션 선택하기">
                  엔터프라이즈 선택하기
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-20" aria-labelledby="benefits-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="benefits-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                AWEKERS <span className="text-cyan-600">AI 데이터베이스</span>만의 차별점
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                단순한 데이터 저장이 아닌, AI가 만드는 지능형 비즈니스 인사이트
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI 자동 분석</h3>
                  <p className="text-gray-600 leading-relaxed">
                    GPT-4 기반 AI가 데이터를 자동 분석하여 사람이 놓칠 수 있는 숨겨진 패턴과 인사이트를 발견합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 예측</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Prophet, LSTM 등 최신 ML 알고리즘으로 매출, 수요, 고객 행동을 정확하게 예측합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">자연어 처리</h3>
                  <p className="text-gray-600 leading-relaxed">
                    복잡한 SQL 없이 &quot;이번 달 매출이 높은 상품은?&quot;과 같은 자연어로 데이터를 조회할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">업종별 특화</h3>
                  <p className="text-gray-600 leading-relaxed">
                    쇼핑몰, 교육, 의료 등 각 업종의 특성을 이해하는 맞춤형 AI 모델로 더 정확한 분석을 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-cyan-600 to-blue-600" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              데이터가 말하는 미래를 지금 만나보세요
            </h2>
            <p className="text-lg sm:text-xl text-cyan-100 mb-8 leading-relaxed">
              AWEKERS AI 데이터베이스로 숨겨진 비즈니스 기회를 발견하고<br className="sm:hidden" />
              데이터 기반의 정확한 의사결정을 시작하세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a 
                href="#packages" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-cyan-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="AI 데이터베이스 무료 체험 시작하기"
              >
                무료 데이터 분석 체험
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </a>
              <a 
                href="tel:02-1234-5678" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-cyan-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="전화상담 02-1234-5678"
              >
                📞 02-1234-5678
              </a>
            </div>

            <div className="text-cyan-100 text-sm">
              ✅ 무료 데이터 진단 ✅ 맞춤 AI 모델 개발 ✅ 30일 무료 체험
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 