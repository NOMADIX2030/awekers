import { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'AI 상담 챗봇 | AWEKERS - 24시간 똑똑한 고객응대 AI 챗봇',
  description: 'AWEKERS AI 상담 챗봇으로 고객 문의를 24시간 자동 응대하세요. 실시간 학습, 다국어 지원, 맞춤형 응답으로 고객 만족도를 높이고 상담 비용은 90% 절감합니다.',
  keywords: ['AI 챗봇', '상담 챗봇', '고객응대', '자동상담', '고객센터 자동화', 'AWEKERS'],
  openGraph: {
    title: 'AI 상담 챗봇 | AWEKERS',
    description: '24시간 똑똑한 AI가 고객 문의에 즉시 응답하는 차세대 상담 챗봇 서비스',
    url: 'https://awekers.com/ai-chatbot',
    siteName: 'AWEKERS',
    images: [
      {
        url: '/images/ai-chatbot-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AWEKERS AI 상담 챗봇',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 상담 챗봇 | AWEKERS',
    description: '24시간 똑똑한 AI가 고객 문의에 즉시 응답하는 차세대 상담 챗봇',
    images: ['/images/ai-chatbot-twitter.jpg'],
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
      "@id": "https://awekers.com/ai-chatbot#service",
      "name": "AWEKERS AI 상담 챗봇",
      "provider": {
        "@id": "https://awekers.com/#organization"
      },
      "description": "24시간 고객 문의를 자동으로 응대하는 인공지능 상담 챗봇 서비스",
      "applicationCategory": "Customer Service Software",
      "operatingSystem": "Web Browser",
      "offers": [
        {
          "@type": "Offer",
          "name": "베이직 챗봇",
          "description": "월 1,000건 자동 응답 기본형 챗봇",
          "price": "390000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer", 
          "name": "스마트 챗봇",
          "description": "월 5,000건 + AI 학습 기능 고급형 챗봇",
          "price": "790000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        {
          "@type": "Offer",
          "name": "프리미엄 챗봇", 
          "description": "무제한 응답 + 전담 관리자 + 맞춤 개발",
          "price": "1490000",
          "priceCurrency": "KRW",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        }
      ],
      "featureList": [
        "24/7 무중단 자동 응답",
        "실시간 AI 학습",
        "다국어 지원 (한/영/일/중)",
        "맞춤형 응답 생성",
        "고객 데이터 분석",
        "CRM 시스템 연동",
        "실시간 상담원 연결"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://awekers.com/ai-chatbot#webpage", 
      "url": "https://awekers.com/ai-chatbot",
      "name": "AI 상담 챗봇 | AWEKERS",
      "isPartOf": {
        "@id": "https://awekers.com/#website"
      },
      "about": {
        "@id": "https://awekers.com/ai-chatbot#service"
      },
      "description": "AWEKERS AI 상담 챗봇으로 고객 문의를 24시간 자동 응대하세요. 실시간 학습, 다국어 지원, 맞춤형 응답으로 고객 만족도를 높이고 상담 비용은 90% 절감합니다."
    }
  ]
}

export default function AIChatbotPage() {
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
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-700 mb-6 sm:mb-8">
                <span className="relative mr-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                24시간 실시간 고객응대
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
                <span className="text-emerald-600">AI</span>가 대답하는
                <br className="hidden sm:block" />
                <span className="block mt-2">똑똑한 상담사</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
                <strong>AWEKERS AI 상담 챗봇</strong><br className="sm:hidden" />
                고객 문의 즉시 응답, 상담 비용 90% 절감
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-emerald-50 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">24/7 무중단</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-blue-50 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a3 3 0 01-3-3V6a3 3 0 013-3h6a3 3 0 013 3v2z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">즉시 응답</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-purple-50 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">AI 학습</span>
                  </div>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center px-4 py-3 bg-orange-50 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">다국어 지원</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#demo" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300"
                  aria-label="AI 챗봇 체험해보기"
                >
                  체험해보기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </a>
                <a 
                  href="#features" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  aria-label="AI 챗봇 기능 살펴보기"
                >
                  기능 살펴보기
                </a>
              </div>
            </div>
          </div>
          
          {/* Background Animation */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10" aria-hidden="true">
            <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-100 rounded-full opacity-20 animate-bounce background-animation-bounce-3s"></div>
            <div className="absolute top-40 right-16 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-bounce background-animation-bounce-3s-delay-1s"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-100 rounded-full opacity-20 animate-bounce background-animation-bounce-3s-delay-2s"></div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="py-12 sm:py-16 bg-gray-50" aria-labelledby="demo-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 id="demo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-emerald-600">실제로</span> 대화해보세요
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                AWEKERS AI 챗봇이 어떻게 고객과 대화하는지 직접 체험해보세요
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">AWEKERS 상담 AI</div>
                      <div className="text-emerald-200 text-sm flex items-center">
                        <span className="w-2 h-2 bg-green-300 rounded-full mr-1 animate-pulse"></span>
                        온라인
                      </div>
                    </div>
                  </div>
                  <button className="text-emerald-200 hover:text-white" aria-label="채팅창 최소화">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                </div>

                {/* Chat Body */}
                <div className="h-96 p-6 space-y-4 overflow-y-auto bg-gray-50">
                  {/* AI Welcome Message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      AI
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 shadow-sm max-w-xs">
                      <p className="text-gray-800">안녕하세요! AWEKERS 상담 AI입니다. 어떤 도움이 필요하신가요?</p>
                      <span className="text-xs text-gray-500">방금 전</span>
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-emerald-600 text-white rounded-lg px-4 py-2 max-w-xs">
                      <p>홈페이지 제작 비용이 궁금합니다</p>
                      <span className="text-xs text-emerald-200">방금 전</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                      👤
                    </div>
                  </div>

                  {/* AI Response with Typing Animation */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      AI
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 shadow-sm max-w-sm">
                      <p className="text-gray-800 mb-2">홈페이지 제작 비용은 다음과 같습니다:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• 기본형: 200만원~</li>
                        <li>• 표준형: 500만원~</li>
                        <li>• 프리미엄: 1,000만원~</li>
                      </ul>
                      <p className="text-sm text-gray-600 mt-2">더 자세한 견적을 원하시면 담당자 연결을 도와드릴까요?</p>
                      <span className="text-xs text-gray-500">방금 전</span>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      AI
                    </div>
                    <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce chat-animation-delay-01s"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce chat-animation-delay-02s"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="text" 
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      disabled
                    />
                    <button className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-300" disabled aria-label="메시지 전송">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="stats-heading" className="sr-only">AI 챗봇 성과 통계</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">90%</div>
                <div className="text-sm sm:text-base text-gray-600">상담 비용 절감</div>
                <div className="text-xs text-gray-500 mt-1">평균 기준</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">3초</div>
                <div className="text-sm sm:text-base text-gray-600">평균 응답 시간</div>
                <div className="text-xs text-gray-500 mt-1">즉시 대답</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">95%</div>
                <div className="text-sm sm:text-base text-gray-600">문의 해결률</div>
                <div className="text-xs text-gray-500 mt-1">자동 처리</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">4개</div>
                <div className="text-sm sm:text-base text-gray-600">지원 언어</div>
                <div className="text-xs text-gray-500 mt-1">한/영/일/중</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 bg-gray-50" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="features-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-emerald-600">6가지</span> 핵심 기능
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                고객 만족도를 높이고 상담 업무를 자동화하는 똑똑한 AI 기능들
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { 
                  title: '24/7 무중단 서비스', 
                  desc: '밤낮없이 고객 문의에 즉시 응답하여 만족도 향상', 
                  icon: '🕒', 
                  color: 'emerald',
                  bgColor: 'emerald-50'
                },
                { 
                  title: '실시간 AI 학습', 
                  desc: '고객 대화를 통해 지속적으로 학습하고 답변 품질 개선', 
                  icon: '🧠', 
                  color: 'blue',
                  bgColor: 'blue-50'
                },
                { 
                  title: '다국어 자동 번역', 
                  desc: '한국어, 영어, 일본어, 중국어 실시간 번역 지원', 
                  icon: '🌏', 
                  color: 'purple',
                  bgColor: 'purple-50'
                },
                { 
                  title: '맞춤형 응답 생성', 
                  desc: '고객별 맞춤 정보와 상황에 적합한 답변 제공', 
                  icon: '🎯', 
                  color: 'orange',
                  bgColor: 'orange-50'
                },
                { 
                  title: '상담원 즉시 연결', 
                  desc: 'AI가 해결 불가한 복잡한 문의는 전문 상담원에게 즉시 전달', 
                  icon: '👥', 
                  color: 'pink',
                  bgColor: 'pink-50'
                },
                { 
                  title: '고객 데이터 분석', 
                  desc: '문의 패턴 분석으로 서비스 개선 인사이트 제공', 
                  icon: '📊', 
                  color: 'indigo',
                  bgColor: 'indigo-50'
                },
              ].map((item, index) => (
                <article key={index} className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-${item.color}-500`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${item.bgColor} rounded-lg mb-4`}>
                    <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
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
                규모에 맞는 <span className="text-emerald-600">AI 챗봇</span> 선택
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                소규모 쇼핑몰부터 대기업 고객센터까지, 필요에 딱 맞는 챗봇 서비스
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Basic Plan */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-emerald-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">베이직 챗봇</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩390,000</div>
                  <div className="text-gray-600">월 1,000건 응답</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">💡 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 소규모 쇼핑몰</li>
                    <li>• 개인 서비스업</li>
                    <li>• 스타트업</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🤖 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">기본 자동 응답 (월 1,000건)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">한국어 기본 지원</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">웹사이트 통합</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">이메일 지원</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300" aria-label="베이직 챗봇 선택하기">
                  베이직 선택하기
                </button>
              </article>

              {/* Smart Plan - Popular */}
              <article className="relative bg-white border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">인기</span>
                </div>
                
                <header className="mb-6">
                  <div className="text-sm font-medium text-emerald-600 mb-2">스마트 챗봇</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩790,000</div>
                  <div className="text-gray-600">월 5,000건 응답</div>
                  <div className="text-sm text-green-600 font-medium">(건당 ₩158)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">🎯 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 중소기업</li>
                    <li>• 온라인 쇼핑몰</li>
                    <li>• 서비스 회사</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-4">🚀 포함 기능</div>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 자동 응답 (월 5,000건)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">4개국어 지원 (한/영/일/중)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">실시간 AI 학습</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">상담원 연결 기능</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고객 데이터 분석</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">우선순위 지원</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-300" aria-label="스마트 챗봇 선택하기">
                  스마트 선택하기
                </button>
              </article>

              {/* Premium Plan */}
              <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-yellow-300 transition-all duration-300">
                <header className="mb-6">
                  <div className="text-sm font-medium text-yellow-600 mb-2">프리미엄 챗봇</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">₩1,490,000</div>
                  <div className="text-gray-600">무제한 응답</div>
                  <div className="text-sm text-green-600 font-medium">(전담 매니저 포함)</div>
                </header>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-700 mb-3">👑 이런 분께 추천</div>
                  <ul className="text-sm text-gray-600 space-y-1" role="list">
                    <li>• 대기업 고객센터</li>
                    <li>• 금융/보험사</li>
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
                      <span className="text-sm text-gray-600">무제한 자동 응답</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">맞춤형 AI 모델 개발</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">전담 매니저 배정</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">CRM 시스템 연동</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">고급 분석 대시보드</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">24/7 전화 지원</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-300" aria-label="프리미엄 챗봇 선택하기">
                  프리미엄 선택하기
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
                AWEKERS <span className="text-emerald-600">AI 챗봇</span>의 차별점
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                단순한 자동응답이 아닌, 진짜 상담사처럼 똑똑하게 대답하는 AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">3초 초고속 응답</h3>
                  <p className="text-gray-600 leading-relaxed">
                    고객이 질문하면 3초 안에 정확한 답변을 제공하여 대기시간을 최소화합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">지속 학습하는 AI</h3>
                  <p className="text-gray-600 leading-relaxed">
                    매일 고객과의 대화를 학습하여 답변 정확도와 자연스러움이 계속 향상됩니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">완벽한 다국어 지원</h3>
                  <p className="text-gray-600 leading-relaxed">
                    한국어, 영어, 일본어, 중국어를 실시간 번역하여 글로벌 고객도 완벽하게 응대합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">스마트 상담원 연결</h3>
                  <p className="text-gray-600 leading-relaxed">
                    복잡한 문의는 AI가 판단하여 적절한 전문 상담원에게 자동으로 연결합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-emerald-600 to-teal-600" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              고객 응대, 이제 AI에게 맡기세요
            </h2>
            <p className="text-lg sm:text-xl text-emerald-100 mb-8 leading-relaxed">
              24시간 지치지 않는 AI 상담사가<br className="sm:hidden" />
              고객 만족도를 높이고 비용은 90% 절감합니다
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a 
                href="#packages" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="AI 챗봇 무료 체험 시작하기"
              >
                무료 체험 시작하기
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </a>
              <a 
                href="tel:02-1234-5678" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                aria-label="전화상담 02-1234-5678"
              >
                📞 02-1234-5678
              </a>
            </div>

            <div className="text-emerald-100 text-sm">
              ✅ 14일 무료 체험 ✅ 설정비 무료 ✅ 언제든 해지 가능
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 