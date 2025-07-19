"use client";
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '안녕하세요! 관리자 패널 AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // AI 응답 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = {
      '대시보드': '대시보드에서는 사이트의 주요 통계를 확인할 수 있습니다. 방문자 수, 페이지 뷰, 사용자 활동 등을 한눈에 볼 수 있어요.',
      '사용자': '사용자 관리에서는 등록된 사용자 목록을 확인하고, 권한을 관리할 수 있습니다. 관리자 권한 부여/해제도 가능해요.',
      '블로그': '블로그 관리에서는 게시물을 작성, 편집, 삭제할 수 있습니다. 태그 관리와 댓글 모더레이션도 지원됩니다.',
      '분석': '분석 페이지에서는 상세한 트래픽 분석과 사용자 행동 패턴을 확인할 수 있습니다. SERP 분석도 포함되어 있어요.',
      '설정': '설정에서는 사이트 기본 정보, SEO 설정, 보안 설정 등을 관리할 수 있습니다.',
      '도움말': '도움이 필요하시면 언제든 말씀해 주세요! 각 페이지의 우상단 물음표 아이콘을 클릭하면 상세한 도움말을 볼 수 있습니다.'
    };

    const lowerInput = userInput.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key.toLowerCase())) {
        return response;
      }
    }

    return '죄송합니다. 더 구체적으로 질문해 주시면 더 정확한 답변을 드릴 수 있습니다. 예를 들어 "대시보드", "사용자 관리", "블로그" 등에 대해 물어보세요!';
  };

  const quickActions = [
    { label: '대시보드', icon: '📊' },
    { label: '사용자 관리', icon: '👥' },
    { label: '블로그 관리', icon: '📝' },
    { label: '분석', icon: '📈' },
    { label: '설정', icon: '⚙️' }
  ];

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 모바일: 하단 슬라이드 업 모달 */}
      <div className="fixed inset-0 z-50 flex items-end justify-end sm:hidden">
        {/* 배경 오버레이 (투명) */}
        <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>
        {/* 모달 컨테이너 */}
        <div className="relative w-full h-[85vh] bg-white shadow-2xl rounded-t-lg flex flex-col transform transition-transform duration-300 ease-out">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
            {/* 드래그 핸들 */}
            <div className="flex justify-center mb-2">
              <div className="w-12 h-1 bg-white bg-opacity-30 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <h2 className="font-semibold">AI 어시스턴트</h2>
                  <p className="text-sm text-blue-100">실시간 도움말</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 퀵 액션 */}
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-3">빠른 질문:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="질문을 입력하세요..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 데스크톱: 우측 하단 팝업 */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-50">
        <div className="w-96 h-[500px] lg:w-[450px] lg:h-[600px] bg-white shadow-2xl rounded-lg flex flex-col border border-gray-200">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-xl">🤖</div>
                <div>
                  <h2 className="font-semibold text-sm">AI 어시스턴트</h2>
                  <p className="text-xs text-blue-100">실시간 도움말</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 퀵 액션 */}
          <div className="p-3 border-b border-gray-200">
            <p className="text-xs text-gray-600 mb-2">빠른 질문:</p>
            <div className="flex flex-wrap gap-1">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="질문을 입력하세요..."
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant; 