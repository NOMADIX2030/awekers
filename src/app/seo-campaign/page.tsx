import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '검색엔진최적화 캠페인 | AWEKERS - 검색 1위 올리는 전문 SEO 서비스',
  description: 'AWEKERS 전문 SEO 엔지니어가 체계적으로 진행하는 검색엔진최적화 캠페인. 1개월/3개월/6개월 맞춤 패키지로 검색 순위 1위 달성을 보장합니다.',
  keywords: ['SEO 캠페인', '검색엔진최적화', '구글 상위노출', 'SEO 전문회사', 'AWEKERS'],
  openGraph: {
    title: '검색엔진최적화 캠페인 | AWEKERS',
    description: '전문 SEO 엔지니어의 체계적 분석으로 검색 1위 달성을 보장하는 SEO 캠페인 서비스',
    url: 'https://awekers.com/seo-campaign',
    siteName: 'AWEKERS',
    images: [
      {
        url: '/images/seo-campaign-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AWEKERS 검색엔진최적화 캠페인',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '검색엔진최적화 캠페인 | AWEKERS',
    description: '전문 SEO 엔지니어의 체계적 분석으로 검색 1위 달성',
    images: ['/images/seo-campaign-twitter.jpg'],
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
      "description": "검색엔진최적화(SEO), 홈페이지 제작, AI 챗봇, AI 블로그를 전문으로 하는 웹앱개발과 마케팅 서비스 IT 솔루션 회사",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KR",
        "addressLocality": "서울"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+82-2-1234-5678",
        "contactType": "customer service",
        "availableLanguage": "Korean"
      }
    },
    {
      "@type": "Service",
      "@id": "https://awekers.com/seo-campaign#service",
      "name": "검색엔진최적화 캠페인",
      "provider": {
        "@id": "https://awekers.com/#organization"
      },
      "description": "전문 SEO 엔지니어가 체계적으로 진행하는 검색엔진최적화 캠페인 서비스",
      "serviceType": "SEO Campaign Service",
      "offers": [
        {
          "@type": "Offer",
          "name": "베이직 캠페인",
          "description": "1개월 기본 SEO 최적화 패키지",
          "price": "890000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer",
          "name": "스탠다드 캠페인",
          "description": "3개월 종합 SEO 최적화 패키지",
          "price": "2390000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer",
          "name": "프리미엄 캠페인",
          "description": "6개월 고급 SEO 최적화 패키지",
          "price": "4490000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://awekers.com/seo-campaign#webpage",
      "url": "https://awekers.com/seo-campaign",
      "name": "검색엔진최적화 캠페인 | AWEKERS",
      "isPartOf": {
        "@id": "https://awekers.com/#website"
      },
      "about": {
        "@id": "https://awekers.com/seo-campaign#service"
      },
      "description": "AWEKERS 전문 SEO 엔지니어가 체계적으로 진행하는 검색엔진최적화 캠페인. 1개월/3개월/6개월 맞춤 패키지로 검색 순위 1위 달성을 보장합니다."
    }
  ]
}

export default function SEOCampaignPage() {
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
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 mb-6 sm:mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2" aria-hidden="true"></span>
                전문 SEO 엔지니어가 직접 관리
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
                검색 <span className="text-blue-600">1위</span>로 올라서는
                <br className="hidden sm:block" />
                <span className="block mt-2">확실한 방법</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
                AWEKERS <strong>검색엔진최적화 캠페인</strong>
              </p>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-blue-50 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">전문 SEO 엔지니어</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-green-50 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">맞춤 캠페인 패키지</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-purple-50 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">성과 보장 시스템</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#packages" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                  aria-label="SEO 캠페인 패키지 선택하기"
                >
                  패키지 선택하기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </a>
                <a 
                  href="#process" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                  aria-label="SEO 캠페인 진행 과정 보기"
                >
                  진행 과정 보기
                </a>
              </div>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10" aria-hidden="true">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20"></div>
            <div className="absolute top-32 right-10 w-16 h-16 bg-green-100 rounded-full opacity-20"></div>
            <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-purple-100 rounded-full opacity-20"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="stats-heading" className="sr-only">SEO 캠페인 성과 통계</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">50%</div>
                <div className="text-sm sm:text-base text-gray-600">평균 순위 향상</div>
                <div className="text-xs text-gray-500 mt-1">3개월 내</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">200%</div>
                <div className="text-sm sm:text-base text-gray-600">트래픽 증가율</div>
                <div className="text-xs text-gray-500 mt-1">6개월 내</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">98%</div>
                <div className="text-sm sm:text-base text-gray-600">고객 만족도</div>
                <div className="text-xs text-gray-500 mt-1">재계약률</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-sm sm:text-base text-gray-600">실시간 모니터링</div>
                <div className="text-xs text-gray-500 mt-1">순위 추적</div>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="py-16 sm:py-20" aria-labelledby="packages-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="packages-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                목표에 맞는 <span className="text-blue-600">SEO 캠페인</span> 선택
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                사업 규모와 목표에 따라 최적화된 3가지 패키지를 제공합니다
              </p>
            </div>

            {/* Package Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Basic Package */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-blue-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">베이직 캠페인</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩890,000</div>
                  <div className="text-gray-600">1개월 패키지</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">💡 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 소규모 사업자</li>
                    <li>• 신규 웹사이트 운영자</li>
                    <li>• SEO 기초 진단 필요시</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">📋 포함 서비스</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">종합 SEO 감사 리포트</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">키워드 리서치 (50개)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">기본 온페이지 최적화</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">월간 성과 리포트</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300" aria-label="베이직 캠페인 선택하기">
                  베이직 선택하기
                </button>
              </article>

              {/* Standard Package - Popular */}
              <article className="relative bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">인기</span>
                </div>
                
                <header className="mb-6">
                  <div className="text-sm font-medium text-blue-600 mb-2">스탠다드 캠페인</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩2,390,000</div>
                  <div className="text-gray-600">3개월 패키지</div>
                  <div className="text-sm text-green-600 font-medium">(월 ₩797,000)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">🎯 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 중소기업 대표</li>
                    <li>• 경쟁이 있는 시장</li>
                    <li>• 본격적인 SEO 필요시</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🚀 포함 서비스</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">심화 경쟁사 분석</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">키워드 리서치 (100개)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">온페이지 + 기술적 SEO</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">콘텐츠 최적화 (월 4개)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">기본 링크빌딩</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300" aria-label="스탠다드 캠페인 선택하기">
                  스탠다드 선택하기
                </button>
              </article>

              {/* Premium Package */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-purple-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-purple-600 mb-2">프리미엄 캠페인</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩4,490,000</div>
                  <div className="text-gray-600">6개월 패키지</div>
                  <div className="text-sm text-green-600 font-medium">(월 ₩748,000)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">👑 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 대기업/스타트업</li>
                    <li>• 전국적 서비스</li>
                    <li>• 최고 수준 SEO 필요시</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">⭐ 포함 서비스</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">종합 디지털 마케팅 전략</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">키워드 리서치 (200개)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 기술적 SEO</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">콘텐츠 마케팅 (월 8개)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고품질 링크빌딩</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">월간 컨설팅 미팅</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300" aria-label="프리미엄 캠페인 선택하기">
                  프리미엄 선택하기
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-16 sm:py-20 bg-gray-50" aria-labelledby="process-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="process-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-blue-600">9단계</span> 전문 프로세스
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                체계적이고 검증된 프로세스로 확실한 SEO 성과를 보장합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { step: '01', title: '사전 분석', desc: '현재 웹사이트 상태 정밀 진단', icon: '🔍' },
                { step: '02', title: '키워드 전략', desc: '타겟 키워드 선정 및 우선순위 설정', icon: '🎯' },
                { step: '03', title: '경쟁사 분석', desc: '시장 포지셔닝 및 기회 발굴', icon: '📊' },
                { step: '04', title: '기술적 최적화', desc: '사이트 구조 및 성능 개선', icon: '⚙️' },
                { step: '05', title: '콘텐츠 최적화', desc: '검색 친화적 콘텐츠 제작', icon: '✍️' },
                { step: '06', title: '링크빌딩', desc: '권위성 구축 및 백링크 확보', icon: '🔗' },
                { step: '07', title: '성과 모니터링', desc: '실시간 순위 추적 및 분석', icon: '📈' },
                { step: '08', title: '지속적 개선', desc: '알고리즘 변화 대응 및 최적화', icon: '🔄' },
                { step: '09', title: '최종 리포팅', desc: '성과 분석 및 향후 전략 제안', icon: '📋' },
              ].map((item, index) => (
                <article key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start mb-4">
                    <div className="text-3xl mr-4" aria-hidden="true">{item.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 mb-1">STEP {item.step}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="features-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                AWEKERS만의 <span className="text-blue-600">특별한</span> 차별점
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                다른 SEO 회사와는 다른 AWEKERS만의 경쟁력을 확인하세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI 기반 키워드 분석</h3>
                  <p className="text-gray-600 leading-relaxed">
                    최신 AI 도구와 빅데이터를 활용하여 경쟁사보다 앞선 키워드를 발굴하고 전략을 수립합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 순위 추적</h3>
                  <p className="text-gray-600 leading-relaxed">
                    24시간 실시간 모니터링 시스템으로 순위 변동을 즉시 파악하고 신속하게 대응합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">투명한 진행상황</h3>
                  <p className="text-gray-600 leading-relaxed">
                    주간 진행 리포트와 상세한 작업 내역을 제공하여 SEO 진행 과정을 투명하게 공개합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">성과 보장</h3>
                  <p className="text-gray-600 leading-relaxed">
                    약정 기간 내 목표 달성을 보장하며, 미달성 시 추가 서비스 또는 환불 정책을 운영합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              검색 1위, 이제 현실로 만들어보세요
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              AWEKERS 전문 SEO 엔지니어와 함께<br className="sm:hidden" />
              확실한 검색엔진 최적화 성과를 경험하세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a 
                href="#packages" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="무료 SEO 진단 신청하기"
              >
                무료 SEO 진단 받기
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </a>
              <a 
                href="tel:02-1234-5678" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="전화상담 02-1234-5678"
              >
                📞 02-1234-5678
              </a>
            </div>

            <div className="text-blue-100 text-sm">
              ✅ 무료 상담 ✅ 맞춤 전략 제안 ✅ 투명한 견적 제공
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 