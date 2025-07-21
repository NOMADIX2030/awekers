'use client';

import { useState } from 'react';
import { SEOAnalysisForm } from './components/SEOAnalysisForm';
import { SEOAnalysisResult as SEOAnalysisResultComponent } from './components/SEOAnalysisResult';
import { SEOAnalysisLoadingScreen } from './components/SEOAnalysisLoadingScreen';
import { CrawlingErrorDisplay } from './components/CrawlingErrorDisplay';
import { SEOAnalysisResult } from './types';

export default function NaverSEOCheckPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SEOAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentUrl(url);

    try {
      const response = await fetch('/api/naver-seo-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('분석 중 오류가 발생했습니다.');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setAnalysisResult(result.data);
      } else {
        throw new Error(result.error || '분석 결과를 받을 수 없습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setCurrentUrl('');
  };

  const handleRetry = () => {
    if (currentUrl) {
      handleAnalyze(currentUrl);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-8 sm:pb-12 md:pb-16">
        {/* 인트로 섹션 */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
            네이버 검색 최적화 검사
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto px-2 sm:px-0">
            웹사이트의 네이버 SEO 상태를 50개 항목으로 종합 분석하고
            <br className="hidden sm:block" />
            개선 방안을 제시해드립니다.
          </p>
        </div>

        {/* 메인 콘텐츠 */}
        {!analysisResult && !isAnalyzing && !error && (
          <SEOAnalysisForm onAnalyze={handleAnalyze} error={null} />
        )}

        {isAnalyzing && <SEOAnalysisLoadingScreen />}

        {error && (
          <CrawlingErrorDisplay
            error={error}
            url={currentUrl}
            onRetry={handleRetry}
            onReset={handleReset}
          />
        )}

        {analysisResult && (
          <SEOAnalysisResultComponent 
            data={analysisResult} 
            onReset={handleReset}
          />
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12 sm:mt-16 md:mt-20 lg:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">네이버SEO검사</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                네이버 검색 최적화를 위한 종합 분석 도구입니다.
                50개 항목을 체크하여 개선점을 찾아드립니다.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">주요 기능</h3>
              <ul className="text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2">
                <li>• 메타태그 최적화 검사</li>
                <li>• 구조화 데이터 분석</li>
                <li>• 모바일 최적화 검사</li>
                <li>• 페이지 속도 분석</li>
              </ul>
            </div>
            <div className="text-center sm:text-left sm:col-span-2 md:col-span-1">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">검사 항목</h3>
              <ul className="text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2">
                <li>• 기본 SEO 요소 (15개)</li>
                <li>• 기술적 최적화 (12개)</li>
                <li>• 콘텐츠 품질 (13개)</li>
                <li>• 성능 최적화 (10개)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 sm:mt-8 md:mt-10 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              © 2024 네이버SEO검사. 무료로 제공되는 SEO 분석 도구입니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 