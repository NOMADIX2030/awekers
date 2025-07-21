"use client";

import React from "react";
import './styles.css';
import { SEOAnalysisData } from "../types";

interface SEOScoreHistogramProps {
  data: SEOAnalysisData;
}

interface ScoreCategory {
  label: string;
  score: number;
  maxScore: number;
  weight: number;
  color: string;
  bgColor: string;
  description: string;
}

const SEOScoreHistogram: React.FC<SEOScoreHistogramProps> = ({ data }) => {
  // Google SEO 기준 5가지 핵심 카테고리 (총 100점)
  const categories: ScoreCategory[] = [
    {
      label: "콘텐츠 품질",
      score: Math.round(
        (data.contentQuality.readability.score + 
         data.contentQuality.keywordDensity.score + 
         data.contentQuality.contentStructure.score + 
         data.contentQuality.multimedia.score + 
         data.contentQuality.freshness.score) / 5
      ),
      maxScore: 100,
      weight: 30,
      color: "#6B7280",
      bgColor: "#10B981",
      description: "가독성, 키워드, 구조, 멀티미디어"
    },
    {
      label: "기술적 SEO",
      score: Math.round(
        (data.technical.sslSupport.score * 0.4 +
         data.technical.robotsTxt.score * 0.25 +
         data.technical.sitemapXml.score * 0.25 +
         data.technical.canonicalUrl.score * 0.1) * 1.0
      ),
      maxScore: 100,
      weight: 25,
      color: "#6B7280",
      bgColor: "#3B82F6",
      description: "SSL, robots.txt, sitemap, canonical"
    },
    {
      label: "사용자 경험",
      score: Math.round(
        (data.performance.score * 0.6 +
         data.mobile.score * 0.4) * 1.0
      ),
      maxScore: 100,
      weight: 20,
      color: "#6B7280",
      bgColor: "#8B5CF6",
      description: "Core Web Vitals, 모바일 최적화"
    },
    {
      label: "메타데이터 구조",
      score: Math.round(
        (data.metaData.title.score * 0.4 +
         data.metaData.description.score * 0.3 +
         data.headings.h1.score * 0.2 +
         data.images.score * 0.1) * 1.0
      ),
      maxScore: 100,
      weight: 15,
      color: "#6B7280",
      bgColor: "#F59E0B",
      description: "Title, Description, H1, 이미지 alt"
    },
    {
      label: "소셜 및 기타",
      score: Math.round(
        (data.social.facebookOg.score * 0.3 +
         data.social.twitterCard.score * 0.2 +
         data.structuredData.score * 0.3 +
         data.security.score * 0.1 +
         data.accessibility.score * 0.1) * 1.0
      ),
      maxScore: 100,
      weight: 10,
      color: "#6B7280",
      bgColor: "#EF4444",
      description: "Open Graph, 구조화 데이터, 보안"
    }
  ];

  // 총점 계산 (Google 기준)
  const totalWeightedScore = categories.reduce((sum, cat) => 
    sum + (cat.score * cat.weight / 100), 0
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-200">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          📊 Google SEO 기준 분야별 점수
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Google 검색 알고리즘 기준 중요도별 SEO 점수 분석
        </p>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 justify-center sm:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-sm font-medium text-gray-700">기준점수</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded"></div>
          <span className="text-sm font-medium text-gray-700">현재점수</span>
        </div>
      </div>

      {/* 히스토그램 */}
      <div className="space-y-6 sm:space-y-8">
        {categories.map((category, index) => (
          <div key={index} className="relative">
            {/* 카테고리 헤더 */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-base sm:text-lg font-bold text-gray-800">
                    {category.label}
                  </h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {category.weight}% 가중치
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {category.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 ml-4">
                <span className="font-bold text-lg score-histogram-category" style={{ color: category.bgColor }}>
                  {category.score}
                </span>
                <span className="text-gray-400">/100</span>
              </div>
            </div>

            {/* 바 차트 */}
            <div className="relative h-10 sm:h-12 bg-gray-100 rounded-xl overflow-hidden">
              {/* 기준 바 (회색) */}
              <div 
                className="absolute top-0 left-0 h-full bg-gray-400 rounded-xl score-histogram-bar"
                style={{ 
                  width: "100%",
                  animationDelay: `${index * 100}ms`
                }}
              ></div>
              
              {/* 현재 점수 바 (컬러) */}
              <div 
                className="absolute top-0 left-0 h-full rounded-xl score-histogram-bar shadow-lg"
                style={{ 
                  width: `${Math.min(100, category.score)}%`,
                  backgroundColor: category.bgColor,
                  animationDelay: `${index * 200}ms`
                }}
              ></div>

              {/* 점수 텍스트 오버레이 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm sm:text-base font-bold text-white mix-blend-difference">
                  {category.score}점 ({Math.round((category.score * category.weight) / 100)}점 기여)
                </span>
              </div>
            </div>

            {/* 성과 표시 */}
            <div className="mt-2 flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500">
                {category.score >= 80 ? "🟢 우수" : category.score >= 60 ? "🟡 보통" : "🔴 개선필요"}
              </span>
              <span className="text-gray-500">
                가중 기여도: {Math.round((category.score * category.weight) / 100)}점
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 종합 요약 */}
      <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            📈 Google SEO 종합 평가
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {Math.round(totalWeightedScore)}
              </div>
              <div className="text-sm text-gray-600">총점 (100점 만점)</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                {categories.filter(cat => cat.score >= 80).length}
              </div>
              <div className="text-sm text-gray-600">우수 분야</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-red-600">
                {categories.filter(cat => cat.score < 60).length}
              </div>
              <div className="text-sm text-gray-600">개선 필요 분야</div>
            </div>
          </div>

          {/* 등급 표시 */}
          <div className="mt-4 text-center">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
              totalWeightedScore >= 80 
                ? "bg-green-100 text-green-800" 
                : totalWeightedScore >= 60 
                  ? "bg-yellow-100 text-yellow-800" 
                  : "bg-red-100 text-red-800"
            }`}>
              {totalWeightedScore >= 80 
                ? "🏆 SEO 우수 등급" 
                : totalWeightedScore >= 60 
                  ? "⚡ SEO 보통 등급" 
                  : "🔧 SEO 개선 필요"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOScoreHistogram; 