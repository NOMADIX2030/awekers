"use client";

import React, { useState, useEffect } from "react";
import './styles.css';

interface SEOAnalysisLoadingScreenProps {
  url: string;
}

const SEOAnalysisLoadingScreen: React.FC<SEOAnalysisLoadingScreenProps> = ({ url }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const analysisSteps = [
    {
      id: 1,
      title: "웹사이트 연결",
      description: "서버 응답 시간 및 접근성 확인",
      icon: "🌐",
      duration: 800,
      details: ["DNS 조회", "SSL 인증서", "서버 응답"]
    },
    {
      id: 2,
      title: "HTML 구조",
      description: "페이지 구조 및 마크업 검사",
      icon: "📝",
      duration: 600,
      details: ["DOCTYPE", "시맨틱 태그", "메타 태그"]
    },
    {
      id: 3,
      title: "메타데이터",
      description: "SEO 메타데이터 분석",
      icon: "🏷️",
      duration: 700,
      details: ["Title 태그", "Description", "OG 태그"]
    },
    {
      id: 4,
      title: "헤딩 구조",
      description: "H1~H6 계층 구조 검사",
      icon: "📋",
      duration: 500,
      details: ["H1 태그", "계층 구조", "키워드 밀도"]
    },
    {
      id: 5,
      title: "이미지 최적화",
      description: "이미지 SEO 및 성능 검사",
      icon: "🖼️",
      duration: 900,
      details: ["Alt 텍스트", "압축률", "WebP 지원"]
    },
    {
      id: 6,
      title: "기술적 SEO",
      description: "크롤링 및 인덱싱 최적화",
      icon: "⚙️",
      duration: 800,
      details: ["Robots.txt", "Sitemap", "Canonical"]
    },
    {
      id: 7,
      title: "성능 지표",
      description: "Core Web Vitals 측정",
      icon: "⚡",
      duration: 1000,
      details: ["LCP", "FID", "CLS"]
    },
    {
      id: 8,
      title: "모바일 최적화",
      description: "반응형 및 모바일 친화성",
      icon: "📱",
      duration: 600,
      details: ["뷰포트", "터치 타겟", "반응형"]
    },
    {
      id: 9,
      title: "구조화된 데이터",
      description: "스키마 마크업 검증",
      icon: "🏗️",
      duration: 700,
      details: ["JSON-LD", "스키마", "Rich Snippets"]
    },
    {
      id: 10,
      title: "최종 점수 계산",
      description: "종합 SEO 점수 산출",
      icon: "🎯",
      duration: 400,
      details: ["가중치 적용", "점수 계산", "개선 방안"]
    }
  ];

  const totalDuration = analysisSteps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    // 컴포넌트 마운트 시 페이드 인 효과
    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    let currentTime = 0;
    let stepIndex = 0;

    const runAnalysis = () => {
      if (stepIndex < analysisSteps.length) {
        const step = analysisSteps[stepIndex];
        setCurrentStep(step.id);

        // 단계별 세부 항목 순차 표시
        step.details.forEach((detail, index) => {
          setTimeout(() => {
            // 세부 항목 표시 로직 (UI에서 활용 가능)
          }, (step.duration / step.details.length) * index);
        });

        setTimeout(() => {
          setCompletedSteps(prev => [...prev, step.id]);
          stepIndex++;
          currentTime += step.duration;
          
          // 진행률 업데이트
          setProgress((currentTime / totalDuration) * 100);
          
          runAnalysis();
        }, step.duration);
      }
    };

    // 진행률 애니메이션 (더 부드럽게)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + 0.5, 100);
      });
    }, 35); // 35ms 간격으로 더 부드러운 애니메이션

    runAnalysis();

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-white relative overflow-hidden transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
    }`}>
      {/* 메인 컨테이너 - 반응형 패딩과 최대 너비 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          
          {/* 헤더 섹션 - 반응형 레이아웃 + 애니메이션 */}
          <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl lg:text-4xl animate-bounce">🔍</span>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2">SEO 분석 진행 중</h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">빠른 속도로 분석하고 있습니다</p>
              </div>
            </div>
            
            {/* URL 표시 카드 - 반응형 디자인 + 애니메이션 */}
            <div className={`bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm max-w-4xl mx-auto transition-all duration-1000 ease-out delay-500 ${
              isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'
            }`}>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg font-medium mb-2">분석 중인 URL</p>
              <p className="text-blue-600 font-mono text-base sm:text-lg lg:text-xl xl:text-2xl break-all font-semibold">{url}</p>
            </div>
          </div>

          {/* 진행률 바 섹션 - 반응형 디자인 + 애니메이션 */}
          <div className={`mb-8 sm:mb-12 lg:mb-16 max-w-4xl mx-auto transition-all duration-1000 ease-out delay-700 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'
          }`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-gray-800 font-semibold text-base sm:text-lg lg:text-xl">전체 진행률</span>
              <span className="text-blue-600 font-mono text-lg sm:text-xl lg:text-2xl font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 lg:h-6 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 loading-progress rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>

          {/* 분석 단계 그리드 - 반응형 그리드 + 스태거드 애니메이션 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
            {analysisSteps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isPending = step.id > currentStep;

              return (
                <div
                  key={step.id}
                  className={`relative p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border transition-all duration-500 transform ${
                    isCompleted
                      ? "bg-green-50 border-green-200 shadow-md shadow-green-100 scale-100"
                      : isActive
                      ? "bg-blue-50 border-blue-200 shadow-md shadow-blue-100 scale-105 lg:scale-110"
                      : "bg-gray-50 border-gray-200 scale-95 opacity-70"
                  } ${
                    isVisible 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{
                    transitionDelay: `${900 + index * 100}ms`
                  }}
                >
                  {/* 상태 아이콘 */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl ${
                      isCompleted
                        ? "bg-green-100 text-green-600 border-2 border-green-200"
                        : isActive
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-200 animate-pulse"
                        : "bg-gray-100 text-gray-500 border-2 border-gray-200"
                    }`}>
                      {isCompleted ? "✅" : isActive ? step.icon : step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-sm sm:text-base lg:text-lg truncate ${
                        isCompleted ? "text-green-700" : isActive ? "text-blue-700" : "text-gray-600"
                      }`}>
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <p className={`text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 line-clamp-2 ${
                    isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {step.description}
                  </p>

                  {/* 세부 항목들 */}
                  <div className="space-y-1 sm:space-y-2">
                    {step.details.map((detail, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-xs sm:text-sm transition-all duration-300 ${
                          isCompleted
                            ? "text-green-600"
                            : isActive
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0 ${
                          isCompleted
                            ? "bg-green-500"
                            : isActive
                            ? "bg-blue-500 animate-pulse"
                            : "bg-gray-300"
                        }`}></div>
                        <span className="truncate">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* 로딩 애니메이션 */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-blue-300 animate-ping opacity-50"></div>
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    </>
                  )}

                  {/* 완료 체크 */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-md">
                        <span className="text-white text-xs sm:text-sm font-bold">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 하단 정보 - 반응형 레이아웃 + 애니메이션 */}
          <div className={`text-center transition-all duration-1000 ease-out delay-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'
          }`}>
            <div className="inline-flex items-center gap-3 sm:gap-4 bg-white rounded-full px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 border border-gray-200 shadow-sm mb-4 sm:mb-6">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-800 text-sm sm:text-base lg:text-lg font-semibold">
                {completedSteps.length}/{analysisSteps.length} 단계 완료
              </span>
            </div>
            
            {/* 추가 정보 카드들 - 태블릿과 PC에서만 표시 + 스태거드 애니메이션 */}
            <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
              {[
                { icon: "⚡", title: "고속 분석", desc: "7초 내 완료" },
                { icon: "🎯", title: "정확한 분석", desc: "10개 항목 검사" },
                { icon: "📊", title: "상세 리포트", desc: "개선방안 제시" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl p-4 lg:p-6 border border-gray-200 shadow-sm transition-all duration-700 ease-out ${
                    isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'
                  }`}
                  style={{
                    transitionDelay: `${1200 + index * 150}ms`
                  }}
                >
                  <div className="text-2xl lg:text-3xl mb-2">{item.icon}</div>
                  <p className="text-gray-800 text-sm lg:text-base font-semibold">{item.title}</p>
                  <p className="text-gray-600 text-xs lg:text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <p className={`text-gray-600 text-xs sm:text-sm lg:text-base mt-4 sm:mt-6 max-w-2xl mx-auto transition-all duration-1000 ease-out delay-1500 ${
              isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'
            }`}>
              잠시만 기다려주세요. 곧 상세한 분석 결과를 확인하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOAnalysisLoadingScreen; 