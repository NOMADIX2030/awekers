"use client";

import { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface MobileTOCButtonProps {
  content: string;
}

export default function MobileTOCButton({ content }: MobileTOCButtonProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  // 마크다운에서 헤딩 추출
  useEffect(() => {
    const headings = content.match(/^#{1,6}\s+(.+)$/gm);
    if (!headings) {
      setTocItems([]);
      return;
    }

    const items: TOCItem[] = headings.map((heading, index) => {
      const level = heading.match(/^(#{1,6})/)?.[1].length || 1;
      const text = heading.replace(/^#{1,6}\s+/, '');
      const lines = content.split('\n');
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

    setTocItems(items);
  }, [content]);

  // 스크롤 감지 및 활성 헤딩 업데이트
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

  // 목차 클릭 시 해당 섹션으로 스크롤
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setIsOpen(false); // 클릭 후 목차 닫기
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* 모바일 목차 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 lg:hidden z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="목차 보기"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>

      {/* 모바일 목차 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">목차</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="목차 닫기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(70vh-80px)]">
              <nav className="space-y-2">
                {tocItems.map((item) => (
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
              </nav>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>총 {tocItems.length}개 섹션</span>
                <span>스크롤하여 탐색</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 