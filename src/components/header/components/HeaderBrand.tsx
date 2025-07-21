// 🎯 헤더 브랜드 (로고) 컴포넌트 - 현재 디자인 100% 보존
"use client";

import React from 'react';
import Link from 'next/link';
import { HeaderBrandProps } from '../types';

/**
 * HeaderBrand 컴포넌트
 * 
 * 현재 layout.tsx의 로고 부분을 100% 동일하게 복사:
 * - Link 컴포넌트 사용
 * - 정확한 CSS 클래스 보존
 * - 반응형 텍스트 크기
 * - 호버 애니메이션
 */
export const HeaderBrand: React.FC<HeaderBrandProps> = ({
  className,
  href = "/",
  children
}) => {
  return (
    <Link
      href={href}
      className={`font-bold text-lg md:text-xl lg:text-3xl tracking-tight flex items-center transition-colors duration-300 hover:text-blue-600 ${className || ''}`}
    >
      <span className="text-black">
        {children || "AWEKERS"}
      </span>
    </Link>
  );
};

export default HeaderBrand; 