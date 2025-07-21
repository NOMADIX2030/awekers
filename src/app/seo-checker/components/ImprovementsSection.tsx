"use client";

import React, { useState } from "react";
import { ImprovementTip } from "../types";

interface ImprovementsSectionProps {
  improvements: ImprovementTip[];
}

const ImprovementsSection: React.FC<ImprovementsSectionProps> = ({ improvements }) => {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return '알 수 없음';
    }
  };

  const sortedImprovements = [...improvements].sort((a, b) => {
    // 우선순위: high > medium > low
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // 우선순위가 같으면 영향도로 정렬
    return b.impact - a.impact;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        💡 개선 방안 ({improvements.length}개)
      </h3>
      
      <div className="space-y-4">
        {sortedImprovements.map((tip, index) => (
          <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* 헤더 */}
            <div 
              className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedTip(expandedTip === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{tip.category === 'meta' ? '📝' : 
                    tip.category === 'headings' ? '📋' : 
                    tip.category === 'images' ? '🖼️' : 
                    tip.category === 'technical' ? '⚙️' : '💡'}</span>
                  <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(tip.priority)}`}>
                    {tip.priority === 'high' ? '높음' : tip.priority === 'medium' ? '보통' : '낮음'}
                  </span>
                  <span className={`text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                    {getDifficultyText(tip.difficulty)}
                  </span>
                  <span className="text-gray-400">
                    {expandedTip === index ? '▼' : '▶'}
                  </span>
                </div>
              </div>
              
              {/* 영향도 */}
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-600">예상 개선 효과:</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-sm ${star <= tip.impact ? 'text-yellow-500' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">({tip.impact}/5)</span>
              </div>
            </div>

            {/* 상세 내용 */}
            {expandedTip === index && (
              <div className="p-4 bg-white">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {tip.description}
                </p>
                
                {tip.code && (
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{tip.code}</pre>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>카테고리: {tip.category}</span>
                    <span>우선순위: {tip.priority === 'high' ? '높음' : tip.priority === 'medium' ? '보통' : '낮음'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 개선 팁이 없는 경우 */}
      {improvements.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            훌륭합니다!
          </h4>
          <p className="text-gray-600">
            현재 웹사이트의 SEO 상태가 매우 좋습니다. 
            <br />
            추가 개선 방안이 필요하지 않습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImprovementsSection; 