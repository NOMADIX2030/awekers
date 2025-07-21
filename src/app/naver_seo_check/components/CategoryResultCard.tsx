'use client';

import { useState } from 'react';
import { CategoryResult, SEOCheckResult } from '../types';
import './styles.css';

interface CategoryResultCardProps {
  data: CategoryResult;
  detailed?: boolean;
}

export function CategoryResultCard({ data, detailed = false }: CategoryResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(detailed);

  const getStatusIcon = (status: SEOCheckResult['status']) => {
    switch (status) {
      case 'pass':
        return <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>;
      case 'fail':
        return <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>;
      case 'warning':
        return <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>;
      case 'info':
        return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>;
      default:
        return <div className="w-5 h-5 bg-gray-400 rounded-full"></div>;
    }
  };

  const getStatusColor = (status: SEOCheckResult['status']) => {
    switch (status) {
      case 'pass': return 'text-green-600';
      case 'fail': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityBadge = (priority: SEOCheckResult['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">높음</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">보통</span>;
      case 'low':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">낮음</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 카테고리 헤더 */}
      <div className="p-6 border-b border-gray-100 category-card-border" style={{ borderLeftColor: data.category.color }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {data.category.name}
            </h3>
            <p className="text-sm text-gray-600">
              {data.category.description}
            </p>
          </div>
          
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-gray-900">
              {data.score}점
            </div>
            <div className="text-sm text-gray-500">
              / {data.maxScore}점
            </div>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">달성률</span>
            <span className="text-sm font-medium category-text-color" style={{ color: data.category.color }}>
              {Math.round(data.percentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${data.percentage}%`,
                backgroundColor: data.category.color
              }}
            ></div>
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              {data.items.filter(item => item.status === 'pass').length}
            </div>
            <div className="text-xs text-gray-500">통과</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">
              {data.items.filter(item => item.status === 'fail').length}
            </div>
            <div className="text-xs text-gray-500">실패</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {data.items.filter(item => item.status === 'warning').length}
            </div>
            <div className="text-xs text-gray-500">주의</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {data.items.filter(item => item.status === 'info').length}
            </div>
            <div className="text-xs text-gray-500">정보</div>
          </div>
        </div>

        {/* 토글 버튼 */}
        {!detailed && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? '간단히 보기' : '자세히 보기'}
            <svg 
              className={`ml-2 w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* 세부 항목 목록 */}
      {isExpanded && (
        <div className="p-6">
          <div className="space-y-4">
            {data.items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {getStatusIcon(item.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(item.priority)}
                        <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                          {item.score}/{item.maxScore}점
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {item.message}
                    </p>

                    {item.details && (
                      <div className="text-xs text-gray-500 mb-2 bg-gray-50 p-2 rounded">
                        {item.details}
                      </div>
                    )}

                    {item.solution && item.status !== 'pass' && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h5 className="text-sm font-medium text-blue-900 mb-1">개선 방안</h5>
                            <p className="text-sm text-blue-700">{item.solution}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 