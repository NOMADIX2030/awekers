// 🎯 사이드바 상태 관리 훅 - 현재 로직 100% 보존
"use client";

import { useState, useRef, useEffect } from 'react';
import { UseSidebarReturn } from '../types';

/**
 * useSidebar 훅
 * 
 * 현재 layout.tsx의 사이드바 관리 로직을 100% 동일하게 복사:
 * - open 상태 관리
 * - drawerRef 관리
 * - ESC 키 처리
 * - 포커스 트랩 (Tab 키 처리)
 * - body 스크롤 제어
 * - 접근성 관리
 */
export function useSidebar(): UseSidebarReturn {
  // 현재 layout.tsx와 동일한 상태 관리
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // 현재 layout.tsx의 ESC 키, 포커스 트랩, body 스크롤 제어 로직을 100% 복사
  useEffect(() => {
    if (!open) return;
    
    // body 스크롤 막기 (현재 layout.tsx와 100% 동일)
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('sidebar-open');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC 키 처리 (현재 layout.tsx와 100% 동일)
      if (e.key === "Escape") setOpen(false);
      
      // Tab 키 포커스 트랩 (현재 layout.tsx와 100% 동일)
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0]
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    
    // 첫 번째 포커스 가능한 요소에 포커스 (현재 layout.tsx와 100% 동일)
    setTimeout(() => {
      if (drawerRef.current) {
        const first = drawerRef.current.querySelector<HTMLElement>('a, button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        first?.focus();
      }
    }, 50);
    
    // 클린업 (현재 layout.tsx와 100% 동일)
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
      document.body.classList.remove('sidebar-open');
    };
  }, [open]);

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setOpen(!open);
  };

  return {
    open,
    setOpen,
    drawerRef,
    toggleSidebar
  };
}

export default useSidebar; 