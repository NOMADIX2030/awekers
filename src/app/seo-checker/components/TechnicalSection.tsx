"use client";

import React from "react";

interface TechnicalSectionProps {
  data: {
    robotsTxt: {
      exists: boolean;
      score: number;
    };
    sitemapXml: {
      exists: boolean;
      score: number;
    };
  };
}

const TechnicalSection: React.FC<TechnicalSectionProps> = ({ data }) => {
  const getStatusIcon = (exists: boolean) => {
    return exists ? "✅" : "❌";
  };

  const getStatusColor = (exists: boolean) => {
    return exists ? "text-green-600" : "text-red-600";
  };

  const getStatusText = (exists: boolean) => {
    return exists ? "존재함" : "없음";
  };

  return (
    <div className="space-y-4">
      {/* Robots.txt */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">Robots.txt</span>
            <p className="text-xs text-gray-600 mt-1">
              검색엔진 크롤링 지침 파일
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.robotsTxt.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.robotsTxt.exists)}`}>
              {getStatusText(data.robotsTxt.exists)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            {data.robotsTxt.exists 
              ? "검색엔진이 사이트를 올바르게 크롤링할 수 있습니다."
              : "검색엔진 크롤링에 제한이 있을 수 있습니다."
            }
          </div>
          <span className="text-sm font-bold text-gray-700">{data.robotsTxt.score}점</span>
        </div>
      </div>

      {/* Sitemap.xml */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">Sitemap.xml</span>
            <p className="text-xs text-gray-600 mt-1">
              사이트 구조 정보 파일
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.sitemapXml.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.sitemapXml.exists)}`}>
              {getStatusText(data.sitemapXml.exists)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            {data.sitemapXml.exists 
              ? "검색엔진이 사이트 구조를 쉽게 파악할 수 있습니다."
              : "검색엔진이 모든 페이지를 발견하기 어려울 수 있습니다."
            }
          </div>
          <span className="text-sm font-bold text-gray-700">{data.sitemapXml.score}점</span>
        </div>
      </div>

      {/* 권장사항 */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 권장사항</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          {!data.robotsTxt.exists && (
            <li>• robots.txt 파일을 생성하여 검색엔진 크롤링을 최적화하세요.</li>
          )}
          {!data.sitemapXml.exists && (
            <li>• sitemap.xml 파일을 생성하여 사이트 구조를 명시하세요.</li>
          )}
          {data.robotsTxt.exists && data.sitemapXml.exists && (
            <li>• 기술적 SEO 요소가 모두 준비되어 있습니다!</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TechnicalSection; 