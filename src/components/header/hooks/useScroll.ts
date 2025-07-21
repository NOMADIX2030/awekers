// 🎯 스크롤 상태 관리 훅 - 현재 로직 100% 보존
"use client";

import { useState, useEffect } from 'react';
import { UseScrollReturn } from '../types';

/**
 * useScroll 훅
 * 
 * 현재 layout.tsx의 스크롤 관리 로직을 100% 동일하게 복사:
 * - isScrolled 상태 관리 (50px 기준)
 * - 스크롤 이벤트 리스너
 * - 헤더 배경 변경을 위한 상태
 */
export function useScroll(): UseScrollReturn {
  // 현재 layout.tsx와 동일한 상태 관리
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // 현재 layout.tsx의 스크롤 이벤트 처리 로직을 100% 복사
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    isScrolled,
    isHeaderVisible,
    lastScrollY
  };
}

export default useScroll; 