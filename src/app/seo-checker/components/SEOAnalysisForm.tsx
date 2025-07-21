"use client";

import React, { useState } from "react";

interface SEOAnalysisFormProps {
  onAnalyze: (url: string) => void;
}

const SEOAnalysisForm: React.FC<SEOAnalysisFormProps> = ({
  onAnalyze,
}) => {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const validateUrl = (inputUrl: string): boolean => {
    if (!inputUrl.trim()) {
      setUrlError("URL을 입력해주세요.");
      return false;
    }

    // URL 형식 검증
    let normalizedUrl = inputUrl.trim();
    
    // http:// 또는 https://가 없으면 https:// 추가
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
      setUrlError(null);
      return true;
    } catch {
      setUrlError("올바른 URL 형식을 입력해주세요.");
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateUrl(url)) {
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
        normalizedUrl = "https://" + normalizedUrl;
      }
      onAnalyze(normalizedUrl);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (urlError) {
      setUrlError(null);
    }
  };

  const handleExampleClick = (example: string) => {
    setUrl(example);
    setUrlError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* 메인 폼 카드 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-3xl sm:text-4xl animate-bounce">🔍</span>
              </div>
              <div className="text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  SEO 분석 도구
                </h2>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                  웹사이트의 SEO 성능을 종합적으로 분석합니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 폼 섹션 */}
        <div className="px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* URL 입력 필드 */}
            <div className="space-y-4">
              <label htmlFor="url" className="block text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                분석할 웹사이트 URL
              </label>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="예: example.com 또는 https://example.com"
                    className={`w-full px-6 sm:px-8 py-4 sm:py-6 text-lg sm:text-xl lg:text-2xl border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all bg-white/80 backdrop-blur-sm ${
                      urlError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-purple-500 focus:ring-purple-100 hover:border-gray-300"
                    }`}
                  />
                  <div className="absolute right-6 sm:right-8 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm sm:text-base">🌐</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 에러 메시지 */}
              {urlError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <p className="text-red-700 font-medium">{urlError}</p>
                </div>
              )}
              
              {/* 도움말 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl flex-shrink-0">💡</span>
                  <div>
                    <p className="text-blue-800 font-medium mb-2">입력 가이드</p>
                    <ul className="text-blue-700 text-sm sm:text-base space-y-1">
                      <li>• 도메인만 입력해도 됩니다 (예: google.com)</li>
                      <li>• https://는 자동으로 추가됩니다</li>
                      <li>• 분석에는 약 7초 정도 소요됩니다</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 분석 버튼 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <button
                type="submit"
                disabled={!url.trim()}
                className={`relative w-full py-4 sm:py-6 px-8 text-lg sm:text-xl lg:text-2xl font-bold rounded-2xl transition-all duration-300 transform ${
                  !url.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed scale-100"
                    : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
                }`}
              >
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <span className="text-2xl sm:text-3xl">🚀</span>
                  <span>SEO 분석 시작</span>
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* 하단 예시 섹션 */}
        <div className="bg-gray-50/80 backdrop-blur-sm px-6 sm:px-8 lg:px-12 py-6 sm:py-8 border-t border-gray-200">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">✨</span>
              <p className="text-gray-700 font-semibold text-base sm:text-lg">분석 예시</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {[
                { url: "google.com", label: "Google", icon: "🌟" },
                { url: "naver.com", label: "Naver", icon: "🔥" },
                { url: "daum.net", label: "Daum", icon: "⭐" }
              ].map((example) => (
                <button
                  key={example.url}
                  onClick={() => handleExampleClick(example.url)}
                  className="group relative overflow-hidden bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl sm:text-2xl group-hover:animate-bounce">{example.icon}</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">{example.label}</p>
                      <p className="text-xs sm:text-sm text-gray-600 font-mono">{example.url}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 sm:mt-12">
        {[
          {
            icon: "📊",
            title: "종합 SEO 분석",
            description: "메타 태그, 헤딩 구조, 이미지 최적화 등 모든 SEO 요소를 분석합니다.",
            color: "from-blue-500 to-cyan-500"
          },
          {
            icon: "⚡",
            title: "Core Web Vitals",
            description: "LCP, FID, CLS 등 Google의 핵심 성능 지표를 측정합니다.",
            color: "from-purple-500 to-pink-500"
          },
          {
            icon: "💡",
            title: "맞춤형 개선 팁",
            description: "분석 결과에 따른 구체적이고 실용적인 개선 방안을 제시합니다.",
            color: "from-green-500 to-teal-500"
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div 
              className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl ${feature.color}`}
            ></div>
            <div className="relative">
              <div className="text-4xl sm:text-5xl mb-4 group-hover:animate-bounce">{feature.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEOAnalysisForm; 