import { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'AI 자동생성 블로그 | AWEKERS - AI가 쓰는 완벽한 블로그 콘텐츠',
  description: 'AWEKERS AI 블로그는 인공지능이 SEO 최적화된 고품질 콘텐츠를 자동으로 생성합니다. 키워드 기반 글 작성, 정기 포스팅, 이미지 자동 삽입까지 모든 것이 자동화됩니다.',
  keywords: ['AI 블로그', '자동 블로그 생성', 'AI 콘텐츠', '자동 포스팅', 'SEO 블로그', 'AWEKERS'],
  openGraph: {
    title: 'AI 자동생성 블로그 | AWEKERS',
    description: 'AI가 SEO 최적화된 고품질 블로그 콘텐츠를 자동으로 생성하는 혁신적인 서비스',
    url: 'https://awekers.com/ai-blog',
    siteName: 'AWEKERS',
    images: [
      {
        url: '/images/ai-blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AWEKERS AI 자동생성 블로그',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 자동생성 블로그 | AWEKERS',
    description: 'AI가 SEO 최적화된 고품질 블로그 콘텐츠를 자동으로 생성',
    images: ['/images/ai-blog-twitter.jpg'],
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
      "@id": "https://awekers.com/ai-blog#service",
      "name": "AWEKERS AI 자동생성 블로그",
      "provider": {
        "@id": "https://awekers.com/#organization"
      },
      "description": "인공지능이 SEO 최적화된 고품질 블로그 콘텐츠를 자동으로 생성하는 서비스",
      "applicationCategory": "Content Management System",
      "operatingSystem": "Web Browser",
      "offers": [
        {
          "@type": "Offer",
          "name": "스타터 플랜",
          "description": "월 20개 AI 블로그 자동생성",
          "price": "290000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer", 
          "name": "프로 플랜",
          "description": "월 50개 AI 블로그 자동생성 + 고급 기능",
          "price": "590000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer",
          "name": "엔터프라이즈 플랜", 
          "description": "무제한 AI 블로그 + 전담 매니저",
          "price": "1190000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        }
      ],
      "featureList": [
        "AI 기반 콘텐츠 자동생성",
        "SEO 최적화된 글 작성",
        "키워드 기반 포스팅",
        "이미지 자동 삽입",
        "정기 포스팅 스케줄링",
        "다국어 지원",
        "성과 분석 리포팅"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://awekers.com/ai-blog#webpage", 
      "url": "https://awekers.com/ai-blog",
      "name": "AI 자동생성 블로그 | AWEKERS",
      "isPartOf": {
        "@id": "https://awekers.com/#website"
      },
      "about": {
        "@id": "https://awekers.com/ai-blog#service"
      },
      "description": "AWEKERS AI 블로그는 인공지능이 SEO 최적화된 고품질 콘텐츠를 자동으로 생성합니다. 키워드 기반 글 작성, 정기 포스팅, 이미지 자동 삽입까지 모든 것이 자동화됩니다."
    }
  ]
}

export default function AIBlogPage() {
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
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-sm font-medium text-purple-700 mb-6 sm:mb-8">
                <span className="relative mr-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                AI 기술로 블로그 자동화
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
                <span className="text-purple-600">AI</span>가 쓰는
                <br className="hidden sm:block" />
                <span className="block mt-2">완벽한 블로그</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
                <strong>AWEKERS AI 자동생성 블로그</strong><br className="sm:hidden" />
                키워드만 입력하면, 나머지는 AI가 알아서
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-blue-50 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">자동 글 작성</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-green-50 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">SEO 최적화</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-yellow-50 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">정기 포스팅</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-purple-50 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">이미지 자동삽입</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#demo" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
                  aria-label="AI 블로그 무료 체험하기"
                >
                  무료 체험하기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </a>
                <a 
                  href="#process" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  aria-label="AI 블로그 작동 원리 보기"
                >
                  작동 원리 보기
                </a>
              </div>
            </div>
          </div>
          
          {/* Background Animation */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10" aria-hidden="true">
            <div className="absolute top-20 left-10 w-32 h-32 bg-purple-100 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-16 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse background-animation-pulse-delay-1s"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-100 rounded-full opacity-20 animate-pulse background-animation-pulse-delay-2s"></div>
          </div>
        </section>

        {/* AI Demo Section */}
        <section id="demo" className="py-12 sm:py-16 bg-gray-50" aria-labelledby="demo-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 id="demo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-purple-600">AI</span>가 실시간으로 만드는 블로그
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                키워드 하나로 완벽한 블로그 포스트가 탄생합니다
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                {/* Demo Interface */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <div className="text-sm text-gray-500 ml-4">AWEKERS AI Blog Generator</div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      <span className="text-xl font-semibold text-gray-900">키워드 입력</span>
                    </div>
                    
                    <div className="max-w-md mx-auto mb-4">
                      <input 
                        type="text" 
                        placeholder="예: 홈페이지 제작 트렌드"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        readOnly
                        value="홈페이지 제작 트렌드"
                      />
                    </div>
                    
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300" disabled>
                      AI 글 생성하기
                    </button>
                  </div>
                </div>

                {/* Generated Content Preview */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-3"></div>
                    <span className="text-sm font-medium text-purple-600">AI가 글을 작성중입니다...</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">2025년 홈페이지 제작 트렌드: 사용자 경험을 혁신하는 5가지 핵심 요소</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      디지털 시대의 급속한 발전과 함께 홈페이지 제작 분야도 지속적으로 진화하고 있습니다. 2025년을 맞이하면서 사용자들의 기대치는 더욱 높아졌고, 기업들은 더 나은 온라인 경험을 제공하기 위해...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">홈페이지제작</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">웹디자인</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">사용자경험</span>
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
            <h2 id="stats-heading" className="sr-only">AI 블로그 성과 통계</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">10초</div>
                <div className="text-sm sm:text-base text-gray-600">1000자 글 생성 시간</div>
                <div className="text-xs text-gray-500 mt-1">평균 기준</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-sm sm:text-base text-gray-600">SEO 점수</div>
                <div className="text-xs text-gray-500 mt-1">자동 최적화</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-sm sm:text-base text-gray-600">자동 포스팅</div>
                <div className="text-xs text-gray-500 mt-1">무중단 운영</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">150+</div>
                <div className="text-sm sm:text-base text-gray-600">지원 업종</div>
                <div className="text-xs text-gray-500 mt-1">전 산업 대응</div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-16 sm:py-20 bg-gray-50" aria-labelledby="process-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="process-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-purple-600">5단계</span> 자동화 프로세스
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                복잡한 블로그 운영, 이제 AI가 모든 것을 자동으로 처리합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { step: '01', title: '키워드 분석', desc: 'AI가 트렌딩 키워드와 검색량을 자동 분석', icon: '🔍', color: 'blue' },
                { step: '02', title: '콘텐츠 생성', desc: 'GPT 기반 고품질 글 자동 작성', icon: '✍️', color: 'green' },
                { step: '03', title: 'SEO 최적화', desc: '메타태그, 구조화 데이터 자동 적용', icon: '🎯', color: 'purple' },
                { step: '04', title: '이미지 삽입', desc: '주제에 맞는 이미지 자동 선택 및 삽입', icon: '🖼️', color: 'yellow' },
                { step: '05', title: '자동 발행', desc: '설정된 스케줄에 따라 자동 포스팅', icon: '🚀', color: 'red' },
              ].map((item, index) => (
                <article key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start mb-4">
                    <div className="text-3xl mr-4" aria-hidden="true">{item.icon}</div>
                    <div>
                      <div className={`text-sm font-medium text-${item.color}-600 mb-1`}>STEP {item.step}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
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
                비즈니스에 맞는 <span className="text-purple-600">AI 블로그</span> 플랜
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                소규모 스타트업부터 대기업까지, 모든 규모의 비즈니스를 위한 맞춤형 요금제
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Starter Plan */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-purple-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">스타터 플랜</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩290,000</div>
                  <div className="text-gray-600">월 20개 포스트</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">💡 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 개인 블로거</li>
                    <li>• 소규모 스타트업</li>
                    <li>• 블로그 마케팅 입문자</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">📝 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">AI 글 자동생성 (월 20개)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">기본 SEO 최적화</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">이미지 자동 삽입</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">이메일 지원</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300" aria-label="스타터 플랜 선택하기">
                  스타터 선택하기
                </button>
              </article>

              {/* Pro Plan - Popular */}
              <article className="relative bg-white border-2 border-purple-500 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">인기</span>
                </div>
                
                <header className="mb-6">
                  <div className="text-sm font-medium text-purple-600 mb-2">프로 플랜</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩590,000</div>
                  <div className="text-gray-600">월 50개 포스트</div>
                  <div className="text-sm text-green-600 font-medium">(개당 ₩11,800)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">🎯 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 중소기업</li>
                    <li>• 마케팅 에이전시</li>
                    <li>• 전문 블로거</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🚀 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">AI 글 자동생성 (월 50개)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 SEO 최적화</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">프리미엄 이미지 사용</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">자동 스케줄링</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">성과 분석 리포트</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">우선순위 지원</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300" aria-label="프로 플랜 선택하기">
                  프로 선택하기
                </button>
              </article>

              {/* Enterprise Plan */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-yellow-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-yellow-600 mb-2">엔터프라이즈 플랜</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩1,190,000</div>
                  <div className="text-gray-600">무제한 포스트</div>
                  <div className="text-sm text-green-600 font-medium">(전담 매니저 포함)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">👑 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 대기업</li>
                    <li>• 미디어 회사</li>
                    <li>• 대규모 커머스</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">⭐ 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">무제한 AI 글 생성</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">커스텀 AI 모델 튜닝</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">전담 매니저</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">실시간 대시보드</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">API 연동 지원</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">24/7 전화 지원</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-300" aria-label="엔터프라이즈 플랜 선택하기">
                  엔터프라이즈 선택하기
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="features-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                AWEKERS <span className="text-purple-600">AI 블로그</span>만의 특별함
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                일반 블로그 도구와는 차원이 다른 인공지능 기술력을 경험하세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">초고속 생성 엔진</h3>
                  <p className="text-gray-600 leading-relaxed">
                    독자적 AI 엔진으로 10초 만에 1000자 이상의 완성도 높은 블로그 포스트를 생성합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">완벽한 SEO 자동화</h3>
                  <p className="text-gray-600 leading-relaxed">
                    메타태그, 제목 최적화, 내부링크까지 검색엔진에 최적화된 구조로 자동 생성됩니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">스마트 이미지 매칭</h3>
                  <p className="text-gray-600 leading-relaxed">
                    AI가 글 내용을 분석하여 가장 적합한 고품질 이미지를 자동으로 선택하고 삽입합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">지능형 발행 스케줄링</h3>
                  <p className="text-gray-600 leading-relaxed">
                    타겟 독자의 온라인 활동 패턴을 분석하여 최적의 시간에 자동으로 포스팅합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-600 to-blue-600" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              블로그 운영, 이제 AI에게 맡기세요
            </h2>
            <p className="text-lg sm:text-xl text-purple-100 mb-8 leading-relaxed">
              매일 고민하던 콘텐츠 제작부터 SEO 최적화까지<br className="sm:hidden" />
              AWEKERS AI가 모든 것을 자동으로 처리합니다
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a 
                href="#packages" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="AI 블로그 무료 체험 시작하기"
              >
                무료 체험 시작하기
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </a>
              <a 
                href="tel:02-1234-5678" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="전화상담 02-1234-5678"
              >
                📞 02-1234-5678
              </a>
            </div>

            <div className="text-purple-100 text-sm">
              ✅ 7일 무료 체험 ✅ 설정비 무료 ✅ 언제든 해지 가능
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 