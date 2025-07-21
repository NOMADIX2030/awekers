"use client";

import React from "react";

interface NaverOptimizationSectionProps {
  data: {
    naverBlog: {
      exists: boolean;
      score: number;
      url?: string;
    };
    naverCafe: {
      exists: boolean;
      score: number;
      url?: string;
    };
    naverKnowledge: {
      exists: boolean;
      score: number;
      url?: string;
    };
    naverNews: {
      exists: boolean;
      score: number;
      url?: string;
    };
  };
}

const NaverOptimizationSection: React.FC<NaverOptimizationSectionProps> = ({ data }) => {
  const getStatusIcon = (exists: boolean) => {
    return exists ? "✅" : "❌";
  };

  const getStatusColor = (exists: boolean) => {
    return exists ? "text-green-600" : "text-red-600";
  };

  const getStatusText = (exists: boolean) => {
    return exists ? "연동됨" : "연동 안됨";
  };

  const calculateOverallScore = () => {
    const scores = [
      data.naverBlog.score,
      data.naverCafe.score,
      data.naverKnowledge.score,
      data.naverNews.score
    ];
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const overallScore = calculateOverallScore();

  return (
    <div className="space-y-4">
      {/* 네이버 블로그 */}
      <div className="p-4 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-green-900">📝 네이버 블로그</span>
            <p className="text-xs text-green-700 mt-1">
              네이버 블로그 연동 상태
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.naverBlog.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.naverBlog.exists)}`}>
              {getStatusText(data.naverBlog.exists)}
            </div>
          </div>
        </div>
        
        {data.naverBlog.exists && data.naverBlog.url && (
          <div className="text-xs text-green-700 mb-2">
            <div className="font-medium">연동 URL:</div>
            <div className="break-all">{data.naverBlog.url}</div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-green-600">
            {data.naverBlog.exists 
              ? "네이버 블로그와 연동되어 있습니다."
              : "네이버 블로그 연동을 고려해보세요."
            }
          </div>
          <span className="text-sm font-bold text-green-700">{data.naverBlog.score}점</span>
        </div>
      </div>

      {/* 네이버 카페 */}
      <div className="p-4 bg-orange-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-orange-900">☕ 네이버 카페</span>
            <p className="text-xs text-orange-700 mt-1">
              네이버 카페 연동 상태
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.naverCafe.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.naverCafe.exists)}`}>
              {getStatusText(data.naverCafe.exists)}
            </div>
          </div>
        </div>
        
        {data.naverCafe.exists && data.naverCafe.url && (
          <div className="text-xs text-orange-700 mb-2">
            <div className="font-medium">연동 URL:</div>
            <div className="break-all">{data.naverCafe.url}</div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-orange-600">
            {data.naverCafe.exists 
              ? "네이버 카페와 연동되어 있습니다."
              : "네이버 카페 연동을 고려해보세요."
            }
          </div>
          <span className="text-sm font-bold text-orange-700">{data.naverCafe.score}점</span>
        </div>
      </div>

      {/* 네이버 지식인 */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-blue-900">💡 네이버 지식인</span>
            <p className="text-xs text-blue-700 mt-1">
              네이버 지식인 연동 상태
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.naverKnowledge.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.naverKnowledge.exists)}`}>
              {getStatusText(data.naverKnowledge.exists)}
            </div>
          </div>
        </div>
        
        {data.naverKnowledge.exists && data.naverKnowledge.url && (
          <div className="text-xs text-blue-700 mb-2">
            <div className="font-medium">연동 URL:</div>
            <div className="break-all">{data.naverKnowledge.url}</div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-blue-600">
            {data.naverKnowledge.exists 
              ? "네이버 지식인과 연동되어 있습니다."
              : "네이버 지식인 연동을 고려해보세요."
            }
          </div>
          <span className="text-sm font-bold text-blue-700">{data.naverKnowledge.score}점</span>
        </div>
      </div>

      {/* 네이버 뉴스 */}
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-red-900">📰 네이버 뉴스</span>
            <p className="text-xs text-red-700 mt-1">
              네이버 뉴스 연동 상태
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.naverNews.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.naverNews.exists)}`}>
              {getStatusText(data.naverNews.exists)}
            </div>
          </div>
        </div>
        
        {data.naverNews.exists && data.naverNews.url && (
          <div className="text-xs text-red-700 mb-2">
            <div className="font-medium">연동 URL:</div>
            <div className="break-all">{data.naverNews.url}</div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-red-600">
            {data.naverNews.exists 
              ? "네이버 뉴스와 연동되어 있습니다."
              : "네이버 뉴스 연동을 고려해보세요."
            }
          </div>
          <span className="text-sm font-bold text-red-700">{data.naverNews.score}점</span>
        </div>
      </div>

      {/* 종합 점수 */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900">📊 네이버 최적화 종합 점수</span>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              overallScore >= 80 ? 'text-green-600' : 
              overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {overallScore}
            </div>
            <div className="text-xs text-gray-600">점</div>
          </div>
        </div>
        
        <div className="text-sm text-gray-700">
          {overallScore >= 80 
            ? "네이버 플랫폼과의 연동이 우수합니다!"
            : overallScore >= 60 
              ? "네이버 플랫폼 연동을 개선할 수 있습니다."
              : "네이버 플랫폼 연동을 적극적으로 고려해보세요."
          }
        </div>
      </div>

      {/* 권장사항 */}
      <div className="p-3 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">💡 네이버 SEO 권장사항</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          {!data.naverBlog.exists && (
            <li>• 네이버 블로그를 개설하여 콘텐츠를 공유하세요.</li>
          )}
          {!data.naverCafe.exists && (
            <li>• 관련 네이버 카페에 콘텐츠를 공유하세요.</li>
          )}
          {!data.naverKnowledge.exists && (
            <li>• 네이버 지식인에 전문적인 답변을 제공하세요.</li>
          )}
          {!data.naverNews.exists && (
            <li>• 뉴스성 콘텐츠는 네이버 뉴스 연동을 고려하세요.</li>
          )}
          {data.naverBlog.exists && data.naverCafe.exists && data.naverKnowledge.exists && data.naverNews.exists && (
            <li>• 모든 네이버 플랫폼과 연동되어 있습니다!</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NaverOptimizationSection; 