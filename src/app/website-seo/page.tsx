import { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'SEO 최적화 홈페이지 제작 | AWEKERS - 검색 1위를 위한 웹사이트 개발',
  description: 'AWEKERS가 제작하는 SEO 최적화 홈페이지로 검색 상위 노출을 보장합니다. 반응형 디자인, 빠른 로딩 속도, 모바일 최적화로 완벽한 비즈니스 웹사이트를 제작합니다.',
  keywords: ['홈페이지 제작', 'SEO 최적화', '웹사이트 개발', '반응형 홈페이지', '모바일 웹사이트', 'AWEKERS'],
  openGraph: {
    title: 'SEO 최적화 홈페이지 제작 | AWEKERS',
    description: '검색 1위를 위한 SEO 최적화 홈페이지 제작 서비스. 반응형 디자인과 빠른 성능으로 완벽한 비즈니스 웹사이트',
    url: 'https://awekers.com/website-seo',
    siteName: 'AWEKERS',
    images: [
      {
        url: '/images/website-seo-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AWEKERS SEO 최적화 홈페이지 제작',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO 최적화 홈페이지 제작 | AWEKERS',
    description: '검색 1위를 위한 SEO 최적화 홈페이지 제작 서비스',
    images: ['/images/website-seo-twitter.jpg'],
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
      "@type": "Service",
      "@id": "https://awekers.com/website-seo#service",
      "name": "AWEKERS SEO 최적화 홈페이지 제작",
      "provider": {
        "@id": "https://awekers.com/#organization"
      },
      "description": "검색 상위 노출을 보장하는 SEO 최적화 홈페이지 제작 서비스",
      "serviceType": "Website Development Service",
      "areaServed": "KR",
      "offers": [
        {
          "@type": "Offer",
          "name": "베이직 홈페이지",
          "description": "소규모 비즈니스를 위한 기본형 SEO 최적화 웹사이트",
          "price": "2900000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer", 
          "name": "스탠다드 홈페이지",
          "description": "중소기업을 위한 전문적인 SEO 최적화 웹사이트 + CMS",
          "price": "4900000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer",
          "name": "프리미엄 홈페이지", 
          "description": "대기업 수준의 맞춤형 SEO 최적화 웹사이트 + 관리시스템",
          "price": "7900000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "홈페이지 제작 서비스",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "반응형 웹 디자인"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "SEO 최적화"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "모바일 최적화"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "성능 최적화"
            }
          }
        ]
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://awekers.com/website-seo#webpage", 
      "url": "https://awekers.com/website-seo",
      "name": "SEO 최적화 홈페이지 제작 | AWEKERS",
      "isPartOf": {
        "@id": "https://awekers.com/#website"
      },
      "about": {
        "@id": "https://awekers.com/website-seo#service"
      },
      "description": "AWEKERS가 제작하는 SEO 최적화 홈페이지로 검색 상위 노출을 보장합니다. 반응형 디자인, 빠른 로딩 속도, 모바일 최적화로 완벽한 비즈니스 웹사이트를 제작합니다."
    }
  ]
}

export default function WebsiteSEOPage() {
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
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-sm font-medium text-indigo-700 mb-6 sm:mb-8">
                <span className="relative mr-2">
                  <span className="animate-pulse absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                SEO가 내장된 전문 홈페이지
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
                검색 <span className="text-indigo-600">1위</span>를 위한
                <br className="hidden sm:block" />
                <span className="block mt-2">완벽한 웹사이트</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
                <strong>AWEKERS SEO 최적화 홈페이지</strong><br className="sm:hidden" />
                검색노출부터 고객전환까지, 한 번에 해결
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-indigo-50 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">SEO 내장</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-green-50 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">반응형</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-yellow-50 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">빠른 속도</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-purple-50 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">보안 강화</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#portfolio" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
                  aria-label="홈페이지 제작 포트폴리오 보기"
                >
                  포트폴리오 보기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                </a>
                <a 
                  href="#process" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  aria-label="홈페이지 제작 과정 보기"
                >
                  제작 과정 보기
                </a>
              </div>
            </div>
          </div>
          
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10" aria-hidden="true">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-20 animate-pulse background-animation-pulse-4s"></div>
            <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-20 animate-pulse background-animation-pulse-4s-delay-1s"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 animate-pulse background-animation-pulse-4s-delay-2s"></div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-12 sm:py-16 bg-gray-50" aria-labelledby="portfolio-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 id="portfolio-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-indigo-600">검증된</span> 제작 실력
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                다양한 업종의 성공적인 홈페이지 제작 사례를 확인하세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-12">
              {[
                { category: "IT 서비스", title: "클라우드 솔루션 회사", desc: "검색 순위 3위→1위 달성", image: "💻", color: "blue" },
                { category: "제조업", title: "정밀기계 제조사", desc: "월 문의량 300% 증가", image: "🏭", color: "green" },
                { category: "의료", title: "피부과 전문병원", desc: "온라인 예약 500% 증가", image: "🏥", color: "purple" },
                { category: "교육", title: "온라인 교육 플랫폼", desc: "수강생 등록 200% 증가", image: "📚", color: "orange" },
                { category: "쇼핑몰", title: "패션 브랜드 쇼핑몰", desc: "매출 250% 성장", image: "👗", color: "pink" },
                { category: "금융", title: "부동산 투자 회사", desc: "상담 신청 400% 증가", image: "🏢", color: "indigo" },
              ].map((item, index) => (
                <article key={index} className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 bg-${item.color}-100 text-${item.color}-800 text-xs font-medium rounded-full`}>
                      {item.category}
                    </span>
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                      {item.image}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-green-600 text-sm font-semibold mb-3">✅ {item.desc}</p>
                  <div className="flex items-center text-indigo-600 text-sm font-medium">
                    <span>자세히 보기</span>
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="stats-heading" className="sr-only">홈페이지 제작 성과 통계</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">300+</div>
                <div className="text-sm sm:text-base text-gray-600">제작 완료</div>
                <div className="text-xs text-gray-500 mt-1">누적 프로젝트</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">98%</div>
                <div className="text-sm sm:text-base text-gray-600">고객 만족도</div>
                <div className="text-xs text-gray-500 mt-1">재계약율 기준</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">2초</div>
                <div className="text-sm sm:text-base text-gray-600">평균 로딩 속도</div>
                <div className="text-xs text-gray-500 mt-1">성능 최적화</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                <div className="text-sm sm:text-base text-gray-600">기술 지원</div>
                <div className="text-xs text-gray-500 mt-1">무중단 서비스</div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-16 sm:py-20 bg-gray-50" aria-labelledby="process-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="process-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-indigo-600">7단계</span> 체계적 제작 과정
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                기획부터 런칭까지, 검증된 프로세스로 완벽한 웹사이트를 제작합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {[
                { step: '01', title: '비즈니스 분석', desc: '목표 고객과 비즈니스 모델을 심층 분석', icon: '📋', color: 'blue' },
                { step: '02', title: '기획 & 설계', desc: '사용자 경험을 고려한 사이트 구조 설계', icon: '🎯', color: 'green' },
                { step: '03', title: 'UI/UX 디자인', desc: '브랜드 아이덴티티를 반영한 디자인', icon: '🎨', color: 'purple' },
                { step: '04', title: '개발 & 코딩', desc: '최신 기술과 SEO 최적화 코딩', icon: '💻', color: 'orange' },
                { step: '05', title: '콘텐츠 제작', desc: 'SEO 친화적인 고품질 콘텐츠 작성', icon: '✍️', color: 'pink' },
                { step: '06', title: '테스트 & 검수', desc: '다양한 환경에서 철저한 품질 검증', icon: '🔍', color: 'indigo' },
                { step: '07', title: '런칭 & 운영', desc: '안정적 서비스 오픈 및 지속 관리', icon: '🚀', color: 'red' },
              ].map((item, index) => (
                <article key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                  <div className="flex items-start mb-4">
                    <div className="text-3xl mr-4" aria-hidden="true">{item.icon}</div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium text-${item.color}-600 mb-1`}>STEP {item.step}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  
                  {/* Progress Line (except last item) */}
                  {index < 6 && (
                    <div className={`hidden xl:block absolute top-12 -right-4 w-8 h-0.5 bg-${item.color}-200`}></div>
                  )}
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
                비즈니스에 딱 맞는 <span className="text-indigo-600">홈페이지</span> 패키지
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                규모와 목적에 따라 선택할 수 있는 3가지 맞춤형 제작 패키지
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Basic Package */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-indigo-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">베이직 홈페이지</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩2,900,000</div>
                  <div className="text-gray-600">소규모 비즈니스용</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">💡 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 개인 사업자</li>
                    <li>• 소규모 스타트업</li>
                    <li>• 간단한 회사 소개</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🌐 포함 내용</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">메인 페이지 + 3개 서브페이지</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">반응형 디자인</span>
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
                      <span className="text-sm text-gray-600">3개월 무료 유지보수</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300" aria-label="베이직 홈페이지 패키지 선택하기">
                  베이직 선택하기
                </button>
              </article>

              {/* Standard Package - Popular */}
              <article className="relative bg-white border-2 border-indigo-500 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">인기</span>
                </div>
                
                <header className="mb-6">
                  <div className="text-sm font-medium text-indigo-600 mb-2">스탠다드 홈페이지</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩4,900,000</div>
                  <div className="text-gray-600">중소기업용</div>
                  <div className="text-sm text-green-600 font-medium">(가장 인기있는 선택)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">🎯 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 중소기업 대표</li>
                    <li>• 전문 서비스업</li>
                    <li>• 제품 판매업</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🚀 포함 내용</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">메인 페이지 + 7개 서브페이지</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 반응형 디자인</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">전문 SEO 최적화</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">CMS 관리 시스템</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">문의 폼 + 갤러리</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">6개월 무료 유지보수</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300" aria-label="스탠다드 홈페이지 패키지 선택하기">
                  스탠다드 선택하기
                </button>
              </article>

              {/* Premium Package */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-yellow-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-yellow-600 mb-2">프리미엄 홈페이지</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩7,900,000</div>
                  <div className="text-gray-600">대기업/맞춤형</div>
                  <div className="text-sm text-green-600 font-medium">(전담 매니저 배정)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">👑 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 대기업</li>
                    <li>• 대규모 쇼핑몰</li>
                    <li>• 특수 기능 필요</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">⭐ 포함 내용</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">무제한 페이지 + 맞춤 기능</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">프리미엄 맞춤 디자인</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">최고급 SEO + 속도 최적화</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 CMS + 회원시스템</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">API 연동 + 외부 시스템</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">1년 무료 유지보수</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-300" aria-label="프리미엄 홈페이지 패키지 선택하기">
                  프리미엄 선택하기
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
                AWEKERS만의 <span className="text-indigo-600">차별화된</span> 기술력
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                단순한 홈페이지가 아닌, 비즈니스 성장을 위한 강력한 도구를 제작합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">검색엔진 최적화 내장</h3>
                  <p className="text-gray-600 leading-relaxed">
                    구글, 네이버 등 주요 검색엔진 알고리즘을 분석하여 검색 상위 노출에 최적화된 구조로 제작합니다.
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3">초고속 로딩 성능</h3>
                  <p className="text-gray-600 leading-relaxed">
                    최신 웹 기술과 CDN을 활용하여 평균 2초 이내 로딩을 보장하며, 사용자 이탈률을 최소화합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">완벽한 모바일 최적화</h3>
                  <p className="text-gray-600 leading-relaxed">
                    모든 디바이스에서 완벽하게 작동하는 반응형 디자인으로 모바일 사용자 경험을 극대화합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">엔터프라이즈급 보안</h3>
                  <p className="text-gray-600 leading-relaxed">
                    SSL 인증서, 해킹 방지, 정기 보안 업데이트 등 기업 수준의 보안 시스템을 기본 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-purple-600" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              성공하는 비즈니스의 시작점
            </h2>
            <p className="text-lg sm:text-xl text-indigo-100 mb-8 leading-relaxed">
              AWEKERS와 함께 검색 1위를 차지하고<br className="sm:hidden" />
              더 많은 고객을 만나보세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a 
                href="#packages" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="홈페이지 제작 무료 상담 신청하기"
              >
                무료 상담 신청하기
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </a>
              <a 
                href="tel:02-1234-5678" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="전화상담 02-1234-5678"
              >
                📞 02-1234-5678
              </a>
            </div>

            <div className="text-indigo-100 text-sm">
              ✅ 무료 기획 상담 ✅ 맞춤 견적 제공 ✅ 포트폴리오 제공
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 