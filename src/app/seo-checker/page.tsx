"use client";

import React, { useState } from "react";
import SEOAnalysisForm from "./components/SEOAnalysisForm";
import SEOAnalysisResult from "./components/SEOAnalysisResult";
import SEOAnalysisLoadingScreen from "./components/SEOAnalysisLoadingScreen";
import { SEOAnalysisData } from "./types";

const SEOCheckerPage: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<SEOAnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingUrl, setAnalyzingUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnalysis = async (url: string) => {
    setIsAnalyzing(true);
    setAnalyzingUrl(url);
    setError(null);
    setShowResult(false);
    
    // 분석 시작 시간 기록
    const startTime = Date.now();
    // 최소 로딩 시간 설정 (7초 - 빠른 분석 과정 시연)
    const minLoadingTime = 7000;
    
    try {
      // API 호출과 최소 로딩 시간을 병렬로 처리
      const [apiResponse] = await Promise.all([
        fetch("/api/seo-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }),
        // 최소 로딩 시간 보장
        new Promise(resolve => {
          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, minLoadingTime - elapsed);
          setTimeout(resolve, remainingTime);
        })
      ]);

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      setAnalysisData(data);
      
      // 로딩 완료 후 부드러운 전환을 위한 딜레이
      setTimeout(() => {
        setShowResult(true);
      }, 300);
    } catch (error) {
      console.error("SEO 분석 중 오류 발생:", error);
      setError(
        error instanceof Error 
          ? error.message 
          : "SEO 분석 중 오류가 발생했습니다."
      );
    } finally {
      // 로딩 화면 페이드아웃을 위한 딜레이
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 500);
    }
  };

  const handleNewAnalysis = () => {
    setShowResult(false);
    // 페이드아웃 후 데이터 리셋
    setTimeout(() => {
      setAnalysisData(null);
      setError(null);
    }, 300);
  };

  // 로딩 화면 - 페이드 인/아웃 효과
  if (isAnalyzing) {
    return (
      <div className={`transition-all duration-500 ease-in-out ${
        isAnalyzing ? 'opacity-100' : 'opacity-0'
      }`}>
        <SEOAnalysisLoadingScreen url={analyzingUrl} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 - 애니메이션 추가 */}
          <div className={`text-center mb-12 transition-all duration-700 ease-out ${
            analysisData && showResult 
              ? 'transform -translate-y-4 scale-95 opacity-80' 
              : 'transform translate-y-0 scale-100 opacity-100'
          }`}>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🔍</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                SEO 분석 도구
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              웹사이트의 SEO 성능을 종합적으로 분석하고 개선 방안을 제시합니다
            </p>
          </div>

          {/* 에러 메시지 - 슬라이드 애니메이션 */}
          {error && (
            <div className={`max-w-2xl mx-auto mb-8 transition-all duration-500 ease-out transform ${
              error 
                ? 'translate-y-0 opacity-100 scale-100' 
                : '-translate-y-4 opacity-0 scale-95'
            }`}>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">분석 오류</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 메인 콘텐츠 영역 - 부드러운 전환 */}
          <div className="relative">
            {/* 분석 폼 */}
            <div className={`transition-all duration-700 ease-in-out transform ${
              !analysisData 
                ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' 
                : '-translate-y-8 opacity-0 scale-95 pointer-events-none absolute inset-0'
            }`}>
              <SEOAnalysisForm onAnalyze={handleAnalysis} />
            </div>

            {/* 분석 결과 */}
            {analysisData && (
              <div className={`transition-all duration-700 ease-in-out transform delay-200 ${
                showResult 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-8 opacity-0 scale-95'
              }`}>
                <SEOAnalysisResult data={analysisData} onReset={handleNewAnalysis} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOCheckerPage; 