"use client";
import React, { useState } from 'react';

interface InlineAIHelperProps {
  title?: string;
  description?: string;
  suggestions?: string[];
  onAskQuestion?: (question: string) => void;
}

const InlineAIHelper: React.FC<InlineAIHelperProps> = ({
  title = "AI 도우미가 도와드립니다",
  description = "이 페이지에서 궁금한 점이 있으시면 언제든 물어보세요!",
  suggestions = [
    "이 기능은 어떻게 사용하나요?",
    "데이터를 어떻게 분석하나요?",
    "설정을 변경하려면 어떻게 해야 하나요?"
  ],
  onAskQuestion
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    if (onAskQuestion) {
      onAskQuestion(suggestion);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start space-x-4">
        {/* AI 아이콘 */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
            🤖
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-4">
            {description}
          </p>

          {/* 제안 질문들 */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">
              자주 묻는 질문:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    selectedSuggestion === suggestion
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* 확장 가능한 추가 도움말 */}
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>{isExpanded ? '접기' : '더 많은 도움말 보기'}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">💡 사용 팁</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 각 페이지의 우상단 물음표 아이콘을 클릭하면 상세한 도움말을 볼 수 있습니다</li>
                  <li>• 데이터를 분석할 때는 다양한 기간을 설정해보세요</li>
                  <li>• 모바일에서는 하단의 플로팅 버튼을 사용하세요</li>
                  <li>• 키보드 단축키를 사용하면 더 빠르게 작업할 수 있습니다</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex-shrink-0">
          <button
            onClick={() => {
              // 플로팅 AI 버튼 클릭 이벤트 트리거
              const event = new CustomEvent('openAI', { detail: { source: 'inline' } });
              window.dispatchEvent(event);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            AI와 대화하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default InlineAIHelper; 