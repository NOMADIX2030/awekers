// 🎯 헤더 모바일 (햄버거 버튼) 컴포넌트 - 현재 디자인 100% 보존
"use client";

import { HeaderMobileProps } from "../types";

/**
 * 헤더 모바일 햄버거 버튼 컴포넌트
 * 
 * 현재 layout.tsx의 햄버거 버튼 부분을 100% 동일하게 복사
 * - 2개 라인으로 구성된 햄버거 아이콘
 * - 열림/닫힘 상태에 따른 X자 변환 애니메이션
 * - backdrop-blur와 hover 효과 포함
 */
export const HeaderMobile: React.FC<HeaderMobileProps> = ({ 
  isOpen,
  onClick,
  className 
}) => {
  return (
    <button
      className={`hamburger-button flex items-center justify-center w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-sm ${className || ''}`}
      aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
      onClick={onClick}
    >
      <div className="relative w-6 h-5 flex items-center justify-center">
        {/* 햄버거 라인들 - 2개 라인으로 변경 */}
        <span 
          className={`hamburger-line absolute w-6 h-0.5 bg-black transition-all duration-300 ${
            isOpen 
              ? 'rotate-45 translate-y-0' 
              : '-translate-y-1'
          }`}
        ></span>
        <span 
          className={`hamburger-line absolute w-6 h-0.5 bg-black transition-all duration-300 ${
            isOpen 
              ? '-rotate-45 translate-y-0' 
              : 'translate-y-1'
          }`}
        ></span>
      </div>
    </button>
  );
};

// 기본 내보내기
export default HeaderMobile; 