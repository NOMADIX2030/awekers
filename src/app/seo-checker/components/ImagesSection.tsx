"use client";

import React from "react";
import './styles.css';

interface ImagesSectionProps {
  data: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    score: number;
  };
}

const ImagesSection: React.FC<ImagesSectionProps> = ({ data }) => {
  const altPercentage = data.total > 0 ? Math.round((data.withAlt / data.total) * 100) : 0;
  
  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 90) return "우수";
    if (percentage >= 70) return "보통";
    return "개선 필요";
  };

  return (
    <div className="space-y-4">
      {/* 전체 통계 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900">Alt 태그 사용률</span>
          <span className={`text-lg font-bold ${getStatusColor(altPercentage)}`}>
            {altPercentage}%
          </span>
        </div>
        
        {/* 진행률 바 */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div 
            className={`h-3 rounded-full images-progress ${
              altPercentage >= 90 ? 'bg-green-500' : 
              altPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${altPercentage}%` }}
          ></div>
        </div>
        
        <div className="text-center">
          <span className={`text-sm font-medium ${getStatusColor(altPercentage)}`}>
            {getStatusText(altPercentage)}
          </span>
        </div>
      </div>

      {/* 상세 통계 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {data.withAlt}
          </div>
          <div className="text-xs text-green-700">Alt 태그 있음</div>
        </div>
        
        <div className="p-3 bg-red-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {data.withoutAlt}
          </div>
          <div className="text-xs text-red-700">Alt 태그 없음</div>
        </div>
      </div>

      {/* 총 이미지 수 */}
      <div className="p-3 bg-blue-50 rounded-lg text-center">
        <div className="text-lg font-bold text-blue-600 mb-1">
          총 {data.total}개 이미지
        </div>
        <div className="text-xs text-blue-700">분석 완료</div>
      </div>

      {/* 점수 */}
      <div className="text-center pt-2">
        <span className="text-sm text-gray-500">종합 점수: </span>
        <span className="text-lg font-bold text-gray-900">{data.score}점</span>
      </div>
    </div>
  );
};

export default ImagesSection; 