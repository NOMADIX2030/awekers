"use client";

import React from "react";

interface AnalyticsSectionProps {
  data: {
    googleAnalytics: {
      exists: boolean;
      score: number;
      version?: string;
    };
    naverAnalytics: {
      exists: boolean;
      score: number;
    };
  };
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ data }) => {
  const getStatusIcon = (exists: boolean) => {
    return exists ? "✅" : "❌";
  };

  const getStatusColor = (exists: boolean) => {
    return exists ? "text-green-600" : "text-red-600";
  };

  const getStatusText = (exists: boolean) => {
    return exists ? "연동됨" : "연동 안됨";
  };

  return (
    <div className="space-y-4">
      {/* Google Analytics */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">Google Analytics</span>
            <p className="text-xs text-gray-600 mt-1">
              웹사이트 트래픽 분석
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.googleAnalytics.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.googleAnalytics.exists)}`}>
              {getStatusText(data.googleAnalytics.exists)}
            </div>
          </div>
        </div>
        
        {data.googleAnalytics.exists && data.googleAnalytics.version && (
          <div className="text-xs text-gray-700 mb-2">
            <div className="font-medium">버전: {data.googleAnalytics.version}</div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            {data.googleAnalytics.exists 
              ? "Google Analytics가 연동되어 트래픽을 분석할 수 있습니다."
              : "Google Analytics가 연동되어 있지 않습니다."
            }
          </div>
          <span className="text-sm font-bold text-gray-700">{data.googleAnalytics.score}점</span>
        </div>
      </div>

      {/* Naver Analytics */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">Naver Analytics</span>
            <p className="text-xs text-gray-600 mt-1">
              네이버 웹마스터 도구
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.naverAnalytics.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.naverAnalytics.exists)}`}>
              {getStatusText(data.naverAnalytics.exists)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            {data.naverAnalytics.exists 
              ? "Naver Analytics가 연동되어 검색 성과를 분석할 수 있습니다."
              : "Naver Analytics가 연동되어 있지 않습니다."
            }
          </div>
          <span className="text-sm font-bold text-gray-700">{data.naverAnalytics.score}점</span>
        </div>
      </div>

      {/* 권장사항 */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 권장사항</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          {!data.googleAnalytics.exists && (
            <li>• Google Analytics를 연동하여 웹사이트 트래픽을 분석하세요.</li>
          )}
          {!data.naverAnalytics.exists && (
            <li>• Naver 웹마스터 도구를 연동하여 검색 성과를 모니터링하세요.</li>
          )}
          {data.googleAnalytics.exists && data.naverAnalytics.exists && (
            <li>• 분석 도구가 모두 연동되어 있습니다!</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsSection; 