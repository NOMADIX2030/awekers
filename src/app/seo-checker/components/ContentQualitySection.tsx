"use client";

import React from "react";

interface ContentQualitySectionProps {
  data: {
    wordCount: number;
    readability: {
      score: number;
      level: string;
      details?: string;
    };
    keywordDensity: {
      score: number;
      mainKeywords?: string[];
      density?: Record<string, number>;
    };
    contentStructure: {
      score: number;
      hasIntroduction: boolean;
      hasConclusion: boolean;
      paragraphCount: number;
      averageParagraphLength: number;
    };
    multimedia: {
      score: number;
      images: number;
      videos: number;
      infographics: number;
    };
    freshness: {
      score: number;
      lastUpdated?: string;
      isRecent: boolean;
    };
  };
}

const ContentQualitySection: React.FC<ContentQualitySectionProps> = ({ data }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return "🟢";
    if (score >= 60) return "🟡";
    return "🔴";
  };

  return (
    <div className="space-y-4">
      {/* 전체 콘텐츠 정보 */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-blue-900">📝 콘텐츠 기본 정보</span>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.wordCount}</div>
            <div className="text-xs text-blue-700">단어 수</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">문단 수:</span>
            <span className="ml-2 text-blue-600">{data.contentStructure.paragraphCount}개</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">평균 문단 길이:</span>
            <span className="ml-2 text-blue-600">{Math.round(data.contentStructure.averageParagraphLength)}단어</span>
          </div>
        </div>
      </div>

      {/* 가독성 분석 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">📖 가독성</span>
            <p className="text-xs text-gray-600 mt-1">
              콘텐츠 이해도 및 읽기 난이도
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getScoreIcon(data.readability.score)}</div>
            <div className={`text-sm font-bold ${getScoreColor(data.readability.score)}`}>
              {data.readability.score}점
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-700">
          <div className="mb-2">
            <span className="font-medium">수준:</span>
            <span className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs">
              {data.readability.level}
            </span>
          </div>
          {data.readability.details && (
            <div className="text-xs text-gray-600">
              {data.readability.details}
            </div>
          )}
        </div>
      </div>

      {/* 키워드 분석 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">🔑 키워드 분석</span>
            <p className="text-xs text-gray-600 mt-1">
              주요 키워드 및 밀도
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getScoreIcon(data.keywordDensity.score)}</div>
            <div className={`text-sm font-bold ${getScoreColor(data.keywordDensity.score)}`}>
              {data.keywordDensity.score}점
            </div>
          </div>
        </div>
        
        {data.keywordDensity.mainKeywords && data.keywordDensity.mainKeywords.length > 0 && (
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-2">주요 키워드:</div>
            <div className="flex flex-wrap gap-1">
              {data.keywordDensity.mainKeywords.map((keyword, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 콘텐츠 구조 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">📋 콘텐츠 구조</span>
            <p className="text-xs text-gray-600 mt-1">
              논리적 구성 및 완성도
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getScoreIcon(data.contentStructure.score)}</div>
            <div className={`text-sm font-bold ${getScoreColor(data.contentStructure.score)}`}>
              {data.contentStructure.score}점
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">서론/소개</span>
            <span className={data.contentStructure.hasIntroduction ? "text-green-600" : "text-red-600"}>
              {data.contentStructure.hasIntroduction ? "✅" : "❌"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">결론/마무리</span>
            <span className={data.contentStructure.hasConclusion ? "text-green-600" : "text-red-600"}>
              {data.contentStructure.hasConclusion ? "✅" : "❌"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">문단 구성</span>
            <span className={data.contentStructure.paragraphCount >= 5 ? "text-green-600" : "text-yellow-600"}>
              {data.contentStructure.paragraphCount >= 5 ? "✅" : "⚠️"}
            </span>
          </div>
        </div>
      </div>

      {/* 멀티미디어 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">🖼️ 멀티미디어</span>
            <p className="text-xs text-gray-600 mt-1">
              시각적 요소 활용도
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getScoreIcon(data.multimedia.score)}</div>
            <div className={`text-sm font-bold ${getScoreColor(data.multimedia.score)}`}>
              {data.multimedia.score}점
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{data.multimedia.images}</div>
            <div className="text-xs text-gray-600">이미지</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{data.multimedia.videos}</div>
            <div className="text-xs text-gray-600">비디오</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{data.multimedia.infographics}</div>
            <div className="text-xs text-gray-600">인포그래픽</div>
          </div>
        </div>
      </div>

      {/* 최신성 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">🕒 콘텐츠 최신성</span>
            <p className="text-xs text-gray-600 mt-1">
              업데이트 및 시의성
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getScoreIcon(data.freshness.score)}</div>
            <div className={`text-sm font-bold ${getScoreColor(data.freshness.score)}`}>
              {data.freshness.score}점
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span>최신 콘텐츠</span>
            <span className={data.freshness.isRecent ? "text-green-600" : "text-yellow-600"}>
              {data.freshness.isRecent ? "✅" : "⚠️"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentQualitySection; 