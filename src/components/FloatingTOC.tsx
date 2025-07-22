"use client";

import { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface FloatingTOCProps {
  content: string;
}

export default function FloatingTOC({ content }: FloatingTOCProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  // 마크다운에서 헤딩 추출
  useEffect(() => {
    const headings = content.match(/^#{1,6}\s+(.+)$/gm);
    if (!headings || headings.length < 3) {
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

  // 스크롤 위치에 따른 표시/숨김
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 글의 20% 지점부터 표시, 끝에서 20% 지점에서 숨김
      const showThreshold = documentHeight * 0.2;
      const hideThreshold = documentHeight * 0.8;
      
      setIsVisible(scrollY > showThreshold && scrollY < hideThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 목차 클릭 시 해당 섹션으로 스크롤
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (tocItems.length === 0 || !isVisible) {
    return null;
  }

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-xl max-w-xs">
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <h4 className="text-sm font-semibold text-gray-900">목차</h4>
        </div>
        
        <nav className="space-y-1 max-h-96 overflow-y-auto">
          {tocItems.slice(0, 8).map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-all duration-200 ${
                activeId === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'
              }`}
              style={{ paddingLeft: `${(item.level - 1) * 8 + 8}px` }}
            >
              <div className="flex items-center">
                {item.level === 1 && (
                  <span className="w-1 h-1 bg-current rounded-full mr-1 opacity-60"></span>
                )}
                {item.level === 2 && (
                  <span className="w-0.5 h-0.5 bg-current rounded-full mr-1 opacity-50"></span>
                )}
                <span className={`truncate ${item.level === 1 ? 'font-medium' : 'font-normal'}`}>
                  {item.text}
                </span>
              </div>
            </button>
          ))}
        </nav>
        
        {tocItems.length > 8 && (
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 text-center">
            +{tocItems.length - 8}개 더
          </div>
        )}
      </div>
    </div>
  );
} 