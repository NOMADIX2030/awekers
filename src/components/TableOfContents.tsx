"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  tocData?: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}

export default function TableOfContents({ content, tocData }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // 반응형 초기 표시 항목 수
  const initialItemCount = isMobile ? 6 : 8;

  // 윈도우 크기 감지 (디바운싱 적용)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkScreenSize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };

    // 초기 체크
    checkScreenSize();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearTimeout(timeoutId);
    };
  }, []);

  // 서버에서 전달받은 데이터가 있으면 사용, 없으면 클라이언트에서 계산
  const tocItems = useMemo(() => {
    if (tocData) {
      return tocData;
    }

    // 클라이언트 사이드 계산 (fallback)
    const headings = content.match(/^#{1,6}\s+(.+)$/gm);
    if (!headings) {
      return [];
    }

    const lines = content.split('\n');
    return headings.map((heading) => {
      const level = heading.match(/^(#{1,6})/)?.[1].length || 1;
      const text = heading.replace(/^#{1,6}\s+/, '');
      
      let lineNumber = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === heading.trim()) {
          lineNumber = i + 1;
          break;
        }
      }
      const id = `heading-${lineNumber}`;
      
      return { id, text, level };
    });
  }, [content, tocData]);

  // 스크롤 감지 및 활성 헤딩 업데이트 (최적화)
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0,
      }
    );

    // 모든 헤딩 요소 관찰
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  // 목차 클릭 시 해당 섹션으로 스크롤 (useCallback으로 메모이제이션)
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // 확장/축소 토글 (useCallback으로 메모이제이션)
  const toggleExpansion = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  if (tocItems.length === 0) {
    return null;
  }

  // 표시할 항목들 결정
  const visibleItems = isExpanded ? tocItems : tocItems.slice(0, initialItemCount);
  const hiddenCount = tocItems.length - initialItemCount;
  const hasHiddenItems = hiddenCount > 0 && !isExpanded;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">목차</h3>
      </div>
      
      <nav className="space-y-2">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
              activeId === item.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800'
            }`}
            style={{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }}
          >
            <div className="flex items-center">
              {item.level === 1 && (
                <span className="w-2 h-2 bg-current rounded-full mr-2 opacity-60"></span>
              )}
              {item.level === 2 && (
                <span className="w-1.5 h-1.5 bg-current rounded-full mr-2 opacity-50"></span>
              )}
              {item.level === 3 && (
                <span className="w-1 h-1 bg-current rounded-full mr-2 opacity-40"></span>
              )}
              <span className={`${item.level === 1 ? 'font-semibold' : 'font-medium'}`}>
                {item.text}
              </span>
            </div>
          </button>
        ))}
        
        {/* 확장/축소 버튼 */}
        {hasHiddenItems && (
          <button
            onClick={toggleExpansion}
            className="w-full text-center px-3 py-2 rounded-lg transition-all duration-200 text-sm text-blue-600 hover:bg-blue-100 hover:text-blue-800 border border-blue-200 hover:border-blue-300"
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              +{hiddenCount}개 더
            </div>
          </button>
        )}
        
        {isExpanded && hiddenCount > 0 && (
          <button
            onClick={toggleExpansion}
            className="w-full text-center px-3 py-2 rounded-lg transition-all duration-200 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 hover:border-gray-300"
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              접기
            </div>
          </button>
        )}
      </nav>
      
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            총 {tocItems.length}개 섹션
          </div>
          {hasHiddenItems && (
            <span className="text-blue-600 font-medium">
              {visibleItems.length}/{tocItems.length} 표시
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 