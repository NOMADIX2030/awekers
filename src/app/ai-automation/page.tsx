import { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'AI 비즈니스 자동화 솔루션 | AWEKERS - 보고서/견적/문서 자동생성 서비스',
  description: 'AWEKERS AI 자동화로 업무 효율성을 극대화하세요. 커스텀 AI 보고서, 실시간 견적 자동화, 스마트 문서양식으로 업무 시간을 90% 단축시킵니다.',
  keywords: ['AI 보고서', '견적 자동화', 'AI 문서양식', '업무 자동화', '비즈니스 효율화', 'AWEKERS'],
  openGraph: {
    title: 'AI 비즈니스 자동화 솔루션 | AWEKERS',
    description: 'AI가 업무를 자동화합니다. 보고서 작성, 견적 계산, 문서 생성까지 모든 것을 AI가 처리',
    url: 'https://awekers.com/ai-automation',
    siteName: 'AWEKERS',
    images: [
      {
        url: '/images/ai-automation-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AWEKERS AI 비즈니스 자동화 솔루션',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 비즈니스 자동화 솔루션 | AWEKERS',
    description: 'AI가 업무를 자동화합니다. 보고서, 견적, 문서까지 모든 것을 자동 생성',
    images: ['/images/ai-automation-twitter.jpg'],
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
      "@id": "https://awekers.com/ai-automation#service",
      "name": "AWEKERS AI 비즈니스 자동화 솔루션",
      "provider": {
        "@id": "https://awekers.com/#organization"
      },
      "description": "커스텀 AI 보고서, 견적 자동화, 문서양식 자동생성으로 비즈니스 효율성을 극대화하는 통합 솔루션",
      "applicationCategory": "Business Automation Software",
      "operatingSystem": "Web Browser",
      "offers": [
        {
          "@type": "Offer",
          "name": "스타터 오토메이션",
          "description": "소규모 기업을 위한 기본 자동화 솔루션",
          "price": "490000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer", 
          "name": "프로페셔널 오토메이션",
          "description": "중소기업을 위한 고급 자동화 솔루션",
          "price": "990000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer",
          "name": "엔터프라이즈 오토메이션", 
          "description": "대기업을 위한 맞춤형 통합 자동화 솔루션",
          "price": "1990000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        }
      ],
      "featureList": [
        "업종별 맞춤 AI 보고서 생성",
        "실시간 견적 자동 계산",
        "스마트 문서양식 자동화",
        "다양한 템플릿 제공",
        "API 연동 지원",
        "클라우드 기반 처리",
        "실시간 협업 기능"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://awekers.com/ai-automation#webpage", 
      "url": "https://awekers.com/ai-automation",
      "name": "AI 비즈니스 자동화 솔루션 | AWEKERS",
      "isPartOf": {
        "@id": "https://awekers.com/#website"
      },
      "about": {
        "@id": "https://awekers.com/ai-automation#service"
      },
      "description": "AWEKERS AI 자동화로 업무 효율성을 극대화하세요. 커스텀 AI 보고서, 실시간 견적 자동화, 스마트 문서양식으로 업무 시간을 90% 단축시킵니다."
    }
  ]
}

export default function AIAutomationPage() {
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
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-sm font-medium text-amber-700 mb-6 sm:mb-8">
                <span className="relative mr-2">
                  <span className="animate-spin absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                업무 시간 90% 단축 보장
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
                <span className="text-amber-600">AI</span>가 처리하는
                <br className="hidden sm:block" />
                <span className="block mt-2">모든 업무</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
                <strong>AWEKERS AI 비즈니스 자동화</strong><br className="sm:hidden" />
                보고서•견적•문서, 모든 것이 자동으로
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-amber-50 rounded-lg">
                    <svg className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">AI 보고서</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-orange-50 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">견적 자동화</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-yellow-50 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">문서 자동화</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#demo" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-amber-600 text-white text-lg font-semibold rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-300"
                  aria-label="AI 자동화 체험해보기"
                >
                  체험해보기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </a>
                <a 
                  href="#solutions" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  aria-label="자동화 솔루션 살펴보기"
                >
                  솔루션 살펴보기
                </a>
              </div>
            </div>
          </div>
          
          {/* Background Animation */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10" aria-hidden="true">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-20 animate-spin background-animation-spin-8s"></div>
            <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full opacity-20 animate-spin background-animation-spin-8s-delay-2s"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-orange-100 to-red-100 rounded-full opacity-20 animate-spin background-animation-spin-8s-delay-4s"></div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="py-12 sm:py-16 bg-gray-50" aria-labelledby="demo-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 id="demo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-amber-600">3가지</span> 핵심 자동화 기능
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                복잡한 업무를 AI가 몇 초 만에 처리하는 과정을 직접 확인하세요
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* AI Report Demo */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">AI 보고서 생성</h3>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">업종 선택</div>
                    <div className="text-sm font-medium text-gray-900">🏭 제조업</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">보고서 유형</div>
                    <div className="text-sm font-medium text-gray-900">📊 월간 매출 분석</div>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                    <span className="ml-2 text-sm text-amber-600 font-medium">AI 분석 중...</span>
                  </div>
                  <div className="text-xs text-gray-500 text-center">데이터 수집 및 분석 완료</div>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-3">
                  <div className="text-xs text-amber-800 font-medium mb-1">✅ 생성 완료 (3.2초)</div>
                  <div className="text-sm text-gray-700">15페이지 상세 분석 보고서</div>
                </div>
              </div>

              {/* AI Quote Demo */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">AI 견적 계산</h3>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">프로젝트</div>
                    <div className="text-sm font-medium text-gray-900">🏢 사무실 인테리어</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">면적</div>
                    <div className="text-sm font-medium text-gray-900">120㎡</div>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-orange-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    </div>
                    <span className="ml-2 text-sm text-orange-600 font-medium">견적 계산 중...</span>
                  </div>
                  <div className="text-xs text-gray-500 text-center">시장가격 분석 및 계산</div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-orange-800 font-medium mb-1">💰 견적 완료 (1.8초)</div>
                  <div className="text-lg font-bold text-gray-900">₩24,500,000</div>
                  <div className="text-sm text-gray-600">상세 견적서 자동 생성</div>
                </div>
              </div>

              {/* AI Document Demo */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">문서 자동 생성</h3>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">문서 유형</div>
                    <div className="text-sm font-medium text-gray-900">📝 계약서</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">템플릿</div>
                    <div className="text-sm font-medium text-gray-900">용역 계약서</div>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-8 bg-yellow-400 rounded animate-pulse document-animation-delay-0s"></div>
                      <div className="w-2 h-8 bg-yellow-400 rounded animate-pulse document-animation-delay-01s"></div>
                      <div className="w-2 h-8 bg-yellow-400 rounded animate-pulse document-animation-delay-02s"></div>
                    </div>
                    <span className="ml-2 text-sm text-yellow-600 font-medium">문서 작성 중...</span>
                  </div>
                  <div className="text-xs text-gray-500 text-center">법적 검토 및 양식 적용</div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-xs text-yellow-800 font-medium mb-1">📄 생성 완료 (2.5초)</div>
                  <div className="text-sm text-gray-700">12페이지 완성된 계약서</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="stats-heading" className="sr-only">AI 자동화 성과 통계</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-600 mb-2">90%</div>
                <div className="text-sm sm:text-base text-gray-600">업무시간 단축</div>
                <div className="text-xs text-gray-500 mt-1">평균 기준</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-600 mb-2">3초</div>
                <div className="text-sm sm:text-base text-gray-600">평균 처리 시간</div>
                <div className="text-xs text-gray-500 mt-1">보고서 기준</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-600 mb-2">50+</div>
                <div className="text-sm sm:text-base text-gray-600">지원 업종</div>
                <div className="text-xs text-gray-500 mt-1">전 산업 대응</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-600 mb-2">99.8%</div>
                <div className="text-sm sm:text-base text-gray-600">정확도</div>
                <div className="text-xs text-gray-500 mt-1">AI 분석 기준</div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-16 sm:py-20 bg-gray-50" aria-labelledby="solutions-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="solutions-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-amber-600">업종별</span> 맞춤 자동화 솔루션
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                어떤 업종이든 AI가 완벽하게 맞춤 처리해드립니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { 
                  industry: "제조업", 
                  icon: "🏭", 
                  features: ["생산 현황 보고서", "품질 관리 견적", "안전점검 문서"],
                  example: "월간 생산성 분석 보고서 자동 생성",
                  color: "blue"
                },
                { 
                  industry: "금융", 
                  icon: "🏦", 
                  features: ["투자 분석 보고서", "대출 견적 계산", "계약서 자동화"],
                  example: "포트폴리오 성과 분석 보고서",
                  color: "green"
                },
                { 
                  industry: "의료", 
                  icon: "🏥", 
                  features: ["환자 케어 보고서", "치료비 견적", "진료 동의서"],
                  example: "월간 진료 통계 분석 보고서",
                  color: "red"
                },
                { 
                  industry: "교육", 
                  icon: "🎓", 
                  features: ["학습 성과 보고서", "교육비 견적", "입학 서류"],
                  example: "학생별 성취도 분석 보고서",
                  color: "purple"
                },
                { 
                  industry: "부동산", 
                  icon: "🏢", 
                  features: ["시장 분석 보고서", "매매 견적", "임대차 계약서"],
                  example: "지역별 부동산 시장 동향 보고서",
                  color: "indigo"
                },
                { 
                  industry: "유통•판매", 
                  icon: "🛒", 
                  features: ["매출 분석 보고서", "상품 견적", "공급계약서"],
                  example: "월간 매출 및 재고 분석 보고서",
                  color: "pink"
                },
              ].map((item, index) => (
                <article key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-amber-500">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3" aria-hidden="true">{item.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900">{item.industry}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">🚀 자동화 기능</div>
                    <ul className="text-sm text-gray-600 space-y-1" role="list">
                      {item.features.map((feature, idx) => (
                        <li key={`${item.industry}-${idx}-${feature}`} className="flex items-center">
                          <svg className="w-3 h-3 text-amber-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-3">
                    <div className="text-xs text-amber-800 font-medium mb-1">💡 활용 예시</div>
                    <div className="text-sm text-gray-700">{item.example}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="py-16 sm:py-20" aria-labelledby="packages-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="packages-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                규모에 맞는 <span className="text-amber-600">자동화</span> 플랜
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                소규모 스타트업부터 대기업까지, 필요한 만큼만 선택하는 합리적 요금제
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Starter Package */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-amber-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">스타터 오토메이션</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩490,000</div>
                  <div className="text-gray-600">월 50건 처리</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">💡 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 소규모 스타트업</li>
                    <li>• 개인 사업자</li>
                    <li>• 자동화 도입 초기</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🤖 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">AI 보고서 생성 (월 20건)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">견적 자동화 (월 20건)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">문서 자동화 (월 10건)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">기본 템플릿 10개</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300" aria-label="스타터 오토메이션 선택하기">
                  스타터 선택하기
                </button>
              </article>

              {/* Professional Package - Popular */}
              <article className="relative bg-white border-2 border-amber-500 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium">인기</span>
                </div>
                
                <header className="mb-6">
                  <div className="text-sm font-medium text-amber-600 mb-2">프로페셔널 오토메이션</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩990,000</div>
                  <div className="text-gray-600">월 150건 처리</div>
                  <div className="text-sm text-green-600 font-medium">(건당 ₩6,600)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">🎯 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 중소기업</li>
                    <li>• 전문 서비스업</li>
                    <li>• 본격 자동화 운영</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🚀 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">AI 보고서 생성 (월 60건)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">견적 자동화 (월 60건)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">문서 자동화 (월 30건)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">프리미엄 템플릿 50개</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">API 연동 지원</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">실시간 협업 기능</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors focus:outline-none focus:ring-4 focus:ring-amber-300" aria-label="프로페셔널 오토메이션 선택하기">
                  프로페셔널 선택하기
                </button>
              </article>

              {/* Enterprise Package */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-orange-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-orange-600 mb-2">엔터프라이즈 오토메이션</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩1,990,000</div>
                  <div className="text-gray-600">무제한 처리</div>
                  <div className="text-sm text-green-600 font-medium">(전담 매니저 포함)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">👑 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 대기업</li>
                    <li>• 대규모 조직</li>
                    <li>• 맞춤 개발 필요</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">⭐ 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">무제한 AI 처리</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">맞춤형 AI 모델 개발</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">전용 템플릿 무제한</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">전담 매니저 + 기술지원</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 분석 대시보드</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">24/7 우선 지원</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300" aria-label="엔터프라이즈 오토메이션 선택하기">
                  엔터프라이즈 선택하기
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="benefits-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="benefits-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                AWEKERS <span className="text-amber-600">AI 자동화</span>만의 차별점
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                단순한 자동화가 아닌, 진짜 업무 혁신을 만들어내는 차세대 AI 솔루션
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">업계 최고 속도</h3>
                  <p className="text-gray-600 leading-relaxed">
                    평균 3초 만에 복잡한 보고서를 완성하며, 기존 수작업 대비 300배 빠른 처리 속도를 자랑합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">업종별 전문 AI</h3>
                  <p className="text-gray-600 leading-relaxed">
                    50개 이상 업종별로 특화된 AI 모델을 운영하여 각 분야의 전문성과 정확도를 보장합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">완벽한 보안 체계</h3>
                  <p className="text-gray-600 leading-relaxed">
                    금융권 수준의 암호화와 데이터 보호 시스템으로 중요한 기업 정보를 안전하게 관리합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">직관적 사용 경험</h3>
                  <p className="text-gray-600 leading-relaxed">
                    IT 전문 지식이 없어도 누구나 쉽게 사용할 수 있는 직관적인 인터페이스를 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-amber-600 to-orange-600" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              반복 업무는 AI에게, 창조적 업무에 집중하세요
            </h2>
            <p className="text-lg sm:text-xl text-amber-100 mb-8 leading-relaxed">
              AWEKERS AI 자동화로 업무 효율성을 극대화하고<br className="sm:hidden" />
              정말 중요한 일에만 시간을 투자하세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a 
                href="#packages" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-amber-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="AI 자동화 무료 체험 시작하기"
              >
                무료 체험 시작하기
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </a>
              <a 
                href="tel:02-1234-5678" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-amber-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="전화상담 02-1234-5678"
              >
                📞 02-1234-5678
              </a>
            </div>

            <div className="text-amber-100 text-sm">
              ✅ 30일 무료 체험 ✅ 맞춤 설정 지원 ✅ 언제든 해지 가능
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 