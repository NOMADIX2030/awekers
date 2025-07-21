'use client';

import { useState } from 'react';
import { ImprovementSuggestion } from '../types';

interface ImprovementsSectionProps {
  improvements: ImprovementSuggestion[];
}

export function ImprovementsSection({ improvements }: ImprovementsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredImprovements = improvements.filter(item => 
    filter === 'all' || item.priority === filter
  );

  const getPriorityColor = (priority: ImprovementSuggestion['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEffortBadge = (effort: ImprovementSuggestion['effort']) => {
    switch (effort) {
      case 'easy':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">쉬움</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">보통</span>;
      case 'hard':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">어려움</span>;
      default:
        return null;
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* 필터 버튼 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">개선 제안 ({improvements.length}개)</h3>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-naver-green text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체 ({improvements.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'high' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            높음 ({improvements.filter(i => i.priority === 'high').length})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'medium' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            보통 ({improvements.filter(i => i.priority === 'medium').length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'low' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            낮음 ({improvements.filter(i => i.priority === 'low').length})
          </button>
        </div>
      </div>

      {/* 개선 제안 목록 */}
      <div className="space-y-4">
        {filteredImprovements.map((improvement) => (
          <div key={improvement.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-3 ${getPriorityColor(improvement.priority)}`}>
                      {improvement.priority === 'high' ? '🔴 높음' : 
                       improvement.priority === 'medium' ? '🟡 보통' : '🟢 낮음'}
                    </div>
                    {getEffortBadge(improvement.effort)}
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {improvement.title}
                  </h4>
                  
                  <p className="text-gray-600 mb-3">
                    {improvement.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {improvement.category}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {improvement.impact}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpanded(improvement.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg 
                    className={`w-5 h-5 transition-transform ${expandedItems.has(improvement.id) ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {expandedItems.has(improvement.id) && (
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-semibold text-gray-900 mb-3">구현 단계</h5>
                  <div className="space-y-3">
                    {improvement.steps.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-naver-green text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredImprovements.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">해당 우선순위의 개선사항이 없습니다</h3>
          <p className="text-gray-500">다른 우선순위 필터를 선택해보세요.</p>
        </div>
      )}
    </div>
  );
} 