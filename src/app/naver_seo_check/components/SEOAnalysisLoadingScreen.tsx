'use client';

import { useState, useEffect } from 'react';

export function SEOAnalysisLoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: '웹페이지 크롤링 중...', description: '페이지 HTML과 리소스를 수집합니다' },
    { label: '메타태그 분석 중...', description: 'title, description 등 기본 메타태그를 검사합니다' },
    { label: '구조화 데이터 검사 중...', description: 'JSON-LD, 스키마 마크업을 분석합니다' },
    { label: '콘텐츠 품질 평가 중...', description: '콘텐츠 길이, 키워드, 중복성을 검사합니다' },
    { label: '기술적 최적화 검사 중...', description: 'SSL, 응답코드, 리디렉션을 확인합니다' },
    { label: '모바일 성능 분석 중...', description: '로딩 속도, 모바일 최적화를 측정합니다' },
    { label: '리포트 생성 중...', description: '종합 분석 결과와 개선안을 준비합니다' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 3;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }

        // 단계별 진행률에 따라 currentStep 업데이트
        const stepProgress = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepProgress, steps.length - 1));

        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-naver-green rounded-full mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            네이버 SEO 검사 진행 중
          </h3>
          <p className="text-gray-600">
            50개 항목을 체계적으로 분석하고 있습니다
          </p>
        </div>

        {/* 진행률 바 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">전체 진행률</span>
            <span className="text-sm font-medium text-naver-green">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-naver-green to-green-400 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 현재 단계 */}
        <div className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-naver-green rounded-full animate-pulse mr-3"></div>
              <h4 className="font-semibold text-gray-900">{steps[currentStep]?.label}</h4>
            </div>
            <p className="text-gray-600 text-sm ml-6">{steps[currentStep]?.description}</p>
          </div>
        </div>

        {/* 검사 단계 목록 */}
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900 mb-4">검사 단계</h5>
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                index < currentStep 
                  ? 'bg-green-50 border border-green-200' 
                  : index === currentStep
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                index < currentStep
                  ? 'bg-green-500'
                  : index === currentStep
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}>
                {index < currentStep ? (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : index === currentStep ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                ) : (
                  <span className="text-xs font-medium text-white">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </div>
                <div className={`text-xs ${
                  index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 팁 섹션 */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h6 className="font-medium text-blue-900 mb-1">분석 중 알아두세요</h6>
              <p className="text-sm text-blue-700">
                검사 결과는 네이버 웹마스터 가이드라인을 기준으로 하며, 
                실제 검색 순위는 다양한 요소의 영향을 받습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 