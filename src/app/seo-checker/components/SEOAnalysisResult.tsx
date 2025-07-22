"use client";

import React from "react";
import { SEOAnalysisData } from "../types";
import ScoreCard from "./ScoreCard";
import MetaDataSection from "./MetaDataSection";
import HeadingsSection from "./HeadingsSection";
import ImagesSection from "./ImagesSection";
import TechnicalSection from "./TechnicalSection";
import SocialSection from "./SocialSection";
import AnalyticsSection from "./AnalyticsSection";
import PerformanceSection from "./PerformanceSection";
import ContentQualitySection from "./ContentQualitySection";
import NaverOptimizationSection from "./NaverOptimizationSection";
import MobileOptimizationSection from "./MobileOptimizationSection";
import StructuredDataSection from "./StructuredDataSection";
import ImprovementsSection from "./ImprovementsSection";
import SEOScoreHistogram from "./SEOScoreHistogram";

interface SEOAnalysisResultProps {
  data: SEOAnalysisData;
  onReset: () => void;
}

const SEOAnalysisResult: React.FC<SEOAnalysisResultProps> = ({
  data,
  onReset,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-600";
    if (score >= 60) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-emerald-50 to-green-50";
    if (score >= 60) return "from-amber-50 to-orange-50";
    return "from-red-50 to-rose-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "우수";
    if (score >= 60) return "보통";
    return "개선필요";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return "🏆";
    if (score >= 60) return "⚡";
    return "🔧";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* 현대적인 헤더 섹션 */}
        <div className="relative overflow-hidden">
          {/* 배경 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-600/90 rounded-3xl"></div>
          
          {/* 패턴 오버레이 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                   backgroundSize: '60px 60px'
                 }}>
            </div>
          </div>
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    SEO 분석 리포트
                  </h1>
                </div>
                
                <div className="space-y-2 text-white/90">
                  <p className="text-lg md:text-xl font-medium">
                    🌐 <span className="font-mono bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                      {data.url}
                    </span>
                  </p>
                  <p className="text-sm md:text-base opacity-80">
                    📅 {new Date(data.timestamp).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onReset}
                className="group bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/30"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-xl group-hover:rotate-180 transition-transform duration-300">🔄</span>
                  <span className="text-lg">다시 검사하기</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 메인 점수 대시보드 */}
        <div className="relative">
          <div className={`bg-gradient-to-br ${getScoreBg(data.overallScore)} rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50`}>
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* 메인 점수 */}
              <div className="md:col-span-1 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className={`relative bg-gradient-to-r ${getScoreGradient(data.overallScore)} rounded-full w-32 h-32 md:w-40 md:h-40 mx-auto flex items-center justify-center shadow-2xl`}>
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
                        {data.overallScore}
                      </div>
                      <div className="text-lg md:text-xl font-bold text-white/90">점</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상태 정보 */}
              <div className="md:col-span-2 space-y-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                    <span className="text-4xl">{getScoreIcon(data.overallScore)}</span>
                    <h2 className={`text-3xl md:text-4xl font-bold ${getScoreColor(data.overallScore)}`}>
                      {getScoreLabel(data.overallScore)}
                    </h2>
                  </div>
                  
                  <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                    {data.overallScore >= 80 
                      ? "🎉 축하합니다! 웹사이트의 SEO가 매우 잘 최적화되어 있습니다. 검색 엔진에서 높은 순위를 기대할 수 있습니다." 
                      : data.overallScore >= 60 
                        ? "⚡ 괜찮은 SEO 상태입니다. 몇 가지 개선사항을 적용하면 더 좋은 결과를 얻을 수 있습니다."
                        : "🔧 SEO 최적화가 필요합니다. 아래 권장사항을 따라 개선하시면 검색 순위 향상에 도움이 됩니다."
                    }
                  </p>
                </div>

                {/* 빠른 통계 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "메타데이터", score: Math.round((data.metaData.title.score + data.metaData.description.score + data.metaData.keywords.score) / 3), icon: "📝" },
                    { label: "기술최적화", score: Math.round((data.technical.robotsTxt.score + data.technical.sitemapXml.score + data.technical.sslSupport.score) / 3), icon: "⚙️" },
                    { label: "성능", score: data.performance.score, icon: "⚡" },
                    { label: "모바일", score: data.mobile.score, icon: "📱" }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}</div>
                      <div className="text-sm text-gray-600 font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO 점수 히스토그램 */}
        <SEOScoreHistogram data={data} />

        {/* 세부 분석 섹션들 - 현대적인 카드 레이아웃 */}
        <div className="space-y-8">
          {/* 첫 번째 행 - 핵심 SEO 요소 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></span>
              🎯 핵심 SEO 요소
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreCard
                title="📝 메타데이터"
                score={Math.round((data.metaData.title.score + data.metaData.description.score + data.metaData.keywords.score) / 3)}
                description="Title, Description, Keywords 최적화"
              >
                <MetaDataSection data={data.metaData} />
              </ScoreCard>

              <ScoreCard
                title="📋 헤딩 구조"
                score={Math.round((data.headings.h1.score + data.headings.h2.score + data.headings.h3.score) / 3)}
                description="H1, H2, H3 태그 구조"
              >
                <HeadingsSection data={data.headings} />
              </ScoreCard>
            </div>
          </div>

          {/* 두 번째 행 - 기술적 최적화 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-4"></span>
              ⚙️ 기술적 최적화
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreCard
                title="🖼️ 이미지 최적화"
                score={data.images.score}
                description="Alt 태그 및 이미지 최적화"
              >
                <ImagesSection data={data.images} />
              </ScoreCard>

              <ScoreCard
                title="🔧 기술적 요소"
                score={Math.round((data.technical.robotsTxt.score + data.technical.sitemapXml.score + data.technical.canonicalUrl.score + data.technical.html5Doctype.score + data.technical.sslSupport.score) / 5)}
                description="Robots.txt, Sitemap, SSL, Canonical"
              >
                <TechnicalSection data={data.technical} />
              </ScoreCard>
            </div>
          </div>

          {/* 세 번째 행 - 소셜 및 분석 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-4"></span>
              📱 소셜 & 분석
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreCard
                title="🌐 소셜 미디어"
                score={Math.round((data.social.facebookOg.score + data.social.twitterCard.score + data.social.socialLinks.score) / 3)}
                description="Facebook OG, Twitter Card, 소셜 링크"
              >
                <SocialSection data={data.social} />
              </ScoreCard>

              <ScoreCard
                title="📊 분석 도구"
                score={Math.round((data.analytics.googleAnalytics.score + data.analytics.naverAnalytics.score) / 2)}
                description="Google Analytics, Naver Analytics"
              >
                <AnalyticsSection data={data.analytics} />
              </ScoreCard>
            </div>
          </div>

          {/* 네 번째 행 - 성능 및 모바일 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-4"></span>
              ⚡ 성능 & 모바일
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreCard
                title="🚀 성능 최적화"
                score={data.performance.score}
                description="Core Web Vitals, 캐싱, 압축"
              >
                <PerformanceSection data={data.performance} />
              </ScoreCard>

              <ScoreCard
                title="📱 모바일 최적화"
                score={data.mobile.score}
                description="반응형 디자인, 모바일 사용성"
              >
                {/* <MobileOptimizationSection data={data.mobile} /> */}
                <div className="text-center py-8 text-gray-500">
                  모바일 최적화 분석 기능이 일시적으로 비활성화되었습니다.
                </div>
              </ScoreCard>
            </div>
          </div>

          {/* 다섯 번째 행 - 콘텐츠 및 구조화 데이터 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full mr-4"></span>
              📄 콘텐츠 & 구조화
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreCard
                title="✍️ 콘텐츠 품질"
                score={Math.round((data.contentQuality.readability.score + data.contentQuality.keywordDensity.score + data.contentQuality.contentStructure.score + data.contentQuality.multimedia.score + data.contentQuality.freshness.score) / 5)}
                description="가독성, 키워드 밀도, 구조, 멀티미디어"
              >
                <ContentQualitySection data={data.contentQuality} />
              </ScoreCard>

              <ScoreCard
                title="🏷️ 구조화된 데이터"
                score={data.structuredData.score}
                description="JSON-LD, 마이크로데이터, RDFa"
              >
                <StructuredDataSection data={data.structuredData} />
              </ScoreCard>
            </div>
          </div>

          {/* 여섯 번째 행 - 네이버 최적화 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-lime-600 rounded-full mr-4"></span>
              🇰🇷 네이버 최적화
            </h2>
            <ScoreCard
              title="🔍 네이버 SEO"
              score={Math.round((data.naverOptimization.naverBlog.score + data.naverOptimization.naverCafe.score + data.naverOptimization.naverKnowledge.score + data.naverOptimization.naverNews.score) / 4)}
              description="네이버 블로그, 카페, 지식iN, 뉴스"
            >
              <NaverOptimizationSection data={data.naverOptimization} />
            </ScoreCard>
          </div>
        </div>

        {/* 개선 권장사항 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-indigo-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-4"></span>
            💡 개선 권장사항
          </h2>
          <ImprovementsSection improvements={data.improvements} />
        </div>
      </div>
    </div>
  );
};

export default SEOAnalysisResult; 