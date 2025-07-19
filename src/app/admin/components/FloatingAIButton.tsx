"use client";
import React, { useState } from 'react';
import AIAssistant from './AIAssistant';

const FloatingAIButton: React.FC = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <>
      {/* 플로팅 AI 버튼 */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAIOpen(true)}
          className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {/* 메인 버튼 */}
          <div className="flex items-center space-x-2">
            <div className="text-xl animate-pulse">🤖</div>
            <span className="font-medium hidden sm:block">AI 도우미</span>
          </div>

          {/* 툴팁 */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            AI 어시스턴트와 대화하기
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>

          {/* 펄스 효과 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-75 animate-ping"></div>
        </button>
      </div>

      {/* AI 어시스턴트 패널 */}
      <AIAssistant 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
      />
    </>
  );
};

export default FloatingAIButton; 