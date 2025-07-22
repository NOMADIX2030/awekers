"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SliderSection() {
  const [activeSlide, setActiveSlide] = useState(1);

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev % 3) + 1);
    }, 6000); // 6초마다 자동 전환

    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (slideNumber: number) => {
    setActiveSlide(slideNumber);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-900 via-green-800 to-green-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white text-green-800 text-sm font-medium rounded-full mb-6 shadow-lg">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI 솔루션
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            완전 자동화된
            <br className="hidden md:block" />
            SEO 솔루션
          </h2>
          <p className="text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            AI 기술로 검색엔진 최적화 과정을 자동화하고 효율화하는 
            <br className="hidden md:block" />
            종합 솔루션을 경험하세요
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Slider Navigation - 이미지 스타일 적용 */}
          <div className="flex justify-center mb-16">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 bg-green-800/50 backdrop-blur-sm rounded-2xl p-2">
              <button 
                className={`slider-nav-btn px-6 py-4 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeSlide === 1 
                    ? 'bg-white text-green-800 shadow-xl' 
                    : 'bg-green-700 text-white hover:bg-green-600'
                }`}
                onClick={() => handleSlideChange(1)}
              >
                1. BLOGØ 솔루션
              </button>
              <button 
                className={`slider-nav-btn px-6 py-4 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeSlide === 2 
                    ? 'bg-white text-green-800 shadow-xl' 
                    : 'bg-green-700 text-white hover:bg-green-600'
                }`}
                onClick={() => handleSlideChange(2)}
              >
                2. OPTI SEO 서비스
              </button>
              <button 
                className={`slider-nav-btn px-6 py-4 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeSlide === 3 
                    ? 'bg-white text-green-800 shadow-xl' 
                    : 'bg-green-700 text-white hover:bg-green-600'
                }`}
                onClick={() => handleSlideChange(3)}
              >
                3. 통합 대시보드
              </button>
            </div>
          </div>

          {/* Slide 1: BLOGØ Solution */}
          <div className={`slide-content transition-all duration-700 ease-in-out ${
            activeSlide === 1 ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Product Info */}
              <div className="text-white space-y-8">
                <div>
                  <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                    BLOG<span className="text-green-300">Ø</span>
                  </h3>
                  <div className="space-y-3 text-xl md:text-2xl">
                    <p className="text-green-100 font-medium">국내 최초 SEO 최적화</p>
                    <p className="text-green-100 font-medium">블로그 솔루션</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-6 group">
                    <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-8 h-8 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold">테크니컬 SEO 룰</p>
                      <p className="text-green-200 text-lg">20여개 적용</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 group">
                    <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-8 h-8 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold">ChatGPT 통합</p>
                      <p className="text-green-200 text-lg">자동 글작성</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 group">
                    <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-8 h-8 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold">지속적인 기능</p>
                      <p className="text-green-200 text-lg">업그레이드</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/ai-blog" 
                  className="inline-flex items-center px-8 py-4 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  자세히 보기 →
                </Link>
              </div>
              
              {/* Right: Blog Editor Interface */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="space-y-6">
                    {/* Title Bar */}
                    <div className="space-y-4">
                      <div className="h-5 bg-green-400 rounded-lg w-4/5"></div>
                      <div className="h-5 bg-green-400 rounded-lg w-3/5"></div>
                    </div>
                    
                    {/* Formatting Tools */}
                    <div className="flex space-x-3">
                      <div className="flex space-x-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold hover:bg-gray-300 transition-colors">Bb</div>
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold hover:bg-gray-300 transition-colors">Aa</div>
                      </div>
                    </div>
                    
                    {/* Content Lines */}
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    
                    {/* Image Placeholder */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center hover:border-green-400 transition-colors">
                      <div className="flex items-center space-x-3 text-gray-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">이미지 추가</span>
                      </div>
                    </div>
                    
                    {/* ChatGPT Integration */}
                    <div className="bg-green-400 rounded-xl p-4 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <span className="text-white font-bold text-lg">Chat GPT</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2: OPTI SEO Service */}
          <div className={`slide-content transition-all duration-700 ease-in-out ${
            activeSlide === 2 ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Service Info */}
              <div className="text-white space-y-8">
                <div>
                  <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                    OPTI <span className="text-green-300">SEO</span>
                  </h3>
                  <div className="space-y-3 text-xl md:text-2xl">
                    <p className="text-green-100 font-medium">국내최초 OPTI SEO 서비스</p>
                    <p className="text-green-100 font-medium">최적화 자동화 서비스</p>
                  </div>
                </div>
                
                <p className="text-lg md:text-xl text-green-100 leading-relaxed">
                  검색엔진 최적화 과정을 자동화하고 효율화하는 
                  <br className="hidden md:block" />
                  종합 솔루션
                </p>
                
                <Link 
                  href="/seo-checker" 
                  className="inline-flex items-center px-8 py-4 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  자세히 보기 →
                </Link>
              </div>
              
              {/* Right: Circular Service Diagram */}
              <div className="relative">
                <div className="relative w-96 h-96 mx-auto">
                  {/* Central Hub */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                    <span className="text-green-800 font-bold text-xl">OPTI SEO</span>
                    <span className="text-green-600 text-sm text-center mt-1">최적화 자동화</span>
                  </div>
                  
                  {/* Service Modules */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-sm text-green-800 font-bold">챗 GPT 글작성</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/4 right-0 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <p className="text-sm text-green-800 font-bold">링크 관리</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-1/4 right-0 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-sm text-green-800 font-bold">랭킹 분석</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-sm text-green-800 font-bold">SEO 분석</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-1/4 left-0 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-sm text-green-800 font-bold">콘텐츠 분석</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/4 left-0 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-sm text-green-800 font-bold">글작성 자동화</p>
                    </div>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 384 384">
                    <defs>
                      <marker id="arrowhead" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
                        <polygon points="0 0, 12 4, 0 8" fill="#10b981" />
                      </marker>
                    </defs>
                    <path d="M192 96 Q 240 120 240 192 Q 240 264 192 288" stroke="#10b981" strokeWidth="4" fill="none" markerEnd="url(#arrowhead)" />
                    <path d="M240 192 Q 264 240 288 192" stroke="#10b981" strokeWidth="4" fill="none" markerEnd="url(#arrowhead)" />
                    <path d="M192 288 Q 144 264 144 192 Q 144 120 192 96" stroke="#10b981" strokeWidth="4" fill="none" markerEnd="url(#arrowhead)" />
                    <path d="M144 192 Q 120 240 96 192" stroke="#10b981" strokeWidth="4" fill="none" markerEnd="url(#arrowhead)" />
                    <path d="M96 192 Q 120 144 144 192" stroke="#10b981" strokeWidth="4" fill="none" markerEnd="url(#arrowhead)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3: Integrated Dashboard */}
          <div className={`slide-content transition-all duration-700 ease-in-out ${
            activeSlide === 3 ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Dashboard Info */}
              <div className="text-white space-y-8">
                <div>
                  <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                    통합 <span className="text-green-300">대시보드</span>
                  </h3>
                  <div className="space-y-3 text-xl md:text-2xl">
                    <p className="text-green-100 font-medium">실시간 모니터링</p>
                    <p className="text-green-100 font-medium">AI 기반 인사이트</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-6 group">
                    <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-8 h-8 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold">실시간 분석</p>
                      <p className="text-green-200 text-lg">24/7 성능 모니터링</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 group">
                    <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-8 h-8 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold">AI 인사이트</p>
                      <p className="text-green-200 text-lg">자동 최적화 제안</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 group">
                    <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-8 h-8 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold">보안 강화</p>
                      <p className="text-green-200 text-lg">데이터 보호 및 백업</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/admin/dashboard" 
                  className="inline-flex items-center px-8 py-4 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  대시보드 보기 →
                </Link>
              </div>
              
              {/* Right: Dashboard Interface */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-green-800">AWEKERS 대시보드</h4>
                      <div className="flex space-x-2">
                        <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                        <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                        <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-xl p-6 hover:bg-green-100 transition-colors">
                        <div className="text-3xl font-bold text-green-800">99%</div>
                        <div className="text-sm text-green-600 font-medium">성공률</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-6 hover:bg-blue-100 transition-colors">
                        <div className="text-3xl font-bold text-blue-800">1,234</div>
                        <div className="text-sm text-blue-600 font-medium">방문자</div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-6 hover:bg-purple-100 transition-colors">
                        <div className="text-3xl font-bold text-purple-800">567</div>
                        <div className="text-sm text-purple-600 font-medium">페이지뷰</div>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-6 hover:bg-orange-100 transition-colors">
                        <div className="text-3xl font-bold text-orange-800">89</div>
                        <div className="text-sm text-orange-600 font-medium">순위</div>
                      </div>
                    </div>
                    
                    {/* Chart */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-gray-700">트래픽 추이</span>
                        <span className="text-xs text-green-600 font-bold">+12.5%</span>
                      </div>
                      <div className="flex items-end space-x-2 h-20">
                        <div className="w-5 bg-green-400 rounded-t-lg" style={{height: '40%'}}></div>
                        <div className="w-5 bg-green-400 rounded-t-lg" style={{height: '60%'}}></div>
                        <div className="w-5 bg-green-400 rounded-t-lg" style={{height: '80%'}}></div>
                        <div className="w-5 bg-green-400 rounded-t-lg" style={{height: '100%'}}></div>
                        <div className="w-5 bg-green-400 rounded-t-lg" style={{height: '70%'}}></div>
                        <div className="w-5 bg-green-400 rounded-t-lg" style={{height: '90%'}}></div>
                        <div className="w-5 bg-green-400 rounded-t-lg" style={{height: '85%'}}></div>
                      </div>
                    </div>
                    
                    {/* AI Status */}
                    <div className="bg-green-100 rounded-xl p-4 flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-green-800">AI 최적화 진행 중...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 