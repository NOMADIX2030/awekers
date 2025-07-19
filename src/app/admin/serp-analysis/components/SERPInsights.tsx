"use client";
import React from 'react';

interface SERPInsightData {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  metric?: string;
  change?: number;
}

interface SERPInsightsProps {
  data?: SERPInsightData[];
}

const SERPInsights: React.FC<SERPInsightsProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        인사이트 데이터가 없습니다.
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return '🎉';
      case 'negative':
        return '⚠️';
      case 'neutral':
        return '📊';
      default:
        return '💡';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-green-200 bg-green-50';
      case 'negative':
        return 'border-red-200 bg-red-50';
      case 'neutral':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {data.map((insight, index) => (
        <div
          key={`${insight.type}-${insight.title}-${index}`}
          className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
        >
          <div className="flex items-start">
            <div className="text-2xl mr-3">
              {getInsightIcon(insight.type)}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {insight.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {insight.description}
              </p>
              {insight.metric && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {insight.metric}
                  </span>
                  {insight.change !== undefined && (
                    <span className={`text-xs font-medium ${
                      insight.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {insight.change >= 0 ? '↗' : '↘'} {Math.abs(insight.change)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SERPInsights; 
 
 