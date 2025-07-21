// 🚀 글로벌 메뉴 상태 관리 훅 - 중복 호출 완전 방지
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { UseMenusReturn, MenuItem, UserRole } from '../types';

/**
 * 🎯 글로벌 메뉴 상태 - 싱글톤 패턴
 * 모든 컴포넌트가 동일한 상태를 공유하여 중복 API 호출 방지
 */
class GlobalMenuState {
  private static instance: GlobalMenuState;
  private menuItems: MenuItem[] = [];
  private userRole: UserRole = UserRole.GUEST;
  private loading: boolean = false;
  private error: Error | null = null;
  private lastFetch: number = 0;
  private subscribers: Set<() => void> = new Set();
  private fetchPromise: Promise<void> | null = null;
  
  private readonly CACHE_TTL = 30 * 1000; // 30초
  private readonly fallbackMenus: MenuItem[] = [
    { id: 1, label: "검색엔진최적화", href: "/tag/SEO", order: 1 },
    { id: 2, label: "홈페이지 제작", href: "/tag/홈페이지제작", order: 2 },
    { id: 3, label: "AI답변 최적화", href: "/tag/AI답변최적화", order: 3 },
    { id: 4, label: "AI앱 개발", href: "/tag/AI앱개발", order: 4 },
    { id: 5, label: "서비스", href: "/services", order: 5 },
    { id: 6, label: "블로그", href: "/blog", order: 6 }
  ];

  static getInstance(): GlobalMenuState {
    if (!GlobalMenuState.instance) {
      GlobalMenuState.instance = new GlobalMenuState();
    }
    return GlobalMenuState.instance;
  }

  // 구독자 등록
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // 모든 구독자에게 상태 변경 알림
  private notify(): void {
    this.subscribers.forEach(callback => callback());
  }

  // 현재 상태 반환
  getState() {
    return {
      menuItems: this.menuItems,
      userRole: this.userRole,
      loading: this.loading,
      error: this.error
    };
  }

  // 🚀 메뉴 데이터 가져오기 (중복 방지 극한 강화)
  async fetchMenus(): Promise<void> {
    // 이미 진행 중인 요청이 있으면 그것을 기다림
    if (this.fetchPromise) {
      console.log('🔄 기존 메뉴 요청 대기 중...');
      return this.fetchPromise;
    }

    // 캐시 확인 (극한 엄격한 조건)
    const now = Date.now();
    if (now - this.lastFetch < this.CACHE_TTL && this.menuItems.length > 0 && !this.loading && !this.error) {
      console.log('💾 글로벌 메뉴 캐시 히트 (극한 최적화)');
      return;
    }

    // 로딩 중이면 대기
    if (this.loading) {
      console.log('🔄 메뉴 로딩 중, 대기...');
      return;
    }

    // 에러 상태에서도 대기 (재시도 방지)
    if (this.error && now - this.lastFetch < this.CACHE_TTL) {
      console.log('🔄 에러 상태에서 대기 중...');
      return;
    }

    // 새로운 요청 시작
    this.fetchPromise = this.performFetch();
    
    try {
      await this.fetchPromise;
    } finally {
      this.fetchPromise = null;
    }
  }

  private async performFetch(): Promise<void> {
    const startTime = performance.now();
    
    try {
      this.loading = true;
      this.error = null;
      this.notify();

      console.log('🚀 글로벌 메뉴 API 요청 시작');
      
      const response = await fetch('/api/menu', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=30',
        },
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const endTime = performance.now();
      const clientTime = endTime - startTime;

      if (data.success) {
        this.menuItems = data.data;
        this.userRole = data.userRole || UserRole.GUEST;
        this.lastFetch = Date.now();
        
        console.log(`🎯 글로벌 메뉴 로딩 성공: ${clientTime.toFixed(2)}ms + 서버 ${data.responseTime} ${data.cached ? '(캐시됨)' : '(DB조회)'}`);
      } else {
        console.error('메뉴 로딩 실패:', data.error);
        this.menuItems = this.fallbackMenus;
        this.userRole = UserRole.GUEST;
        this.error = new Error(data.error || '메뉴 로딩 실패');
      }
    } catch (error) {
      console.error('메뉴 로딩 오류:', error);
      this.menuItems = this.fallbackMenus;
      this.userRole = UserRole.GUEST;
      this.error = error as Error;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  // 캐시 무효화
  invalidate(): void {
    this.lastFetch = 0;
    this.fetchMenus();
  }
}

// 🎯 글로벌 인스턴스
const globalMenuState = GlobalMenuState.getInstance();

/**
 * 🚀 최적화된 useMenus 훅
 * - 글로벌 상태 사용으로 중복 API 호출 완전 방지
 * - 모든 컴포넌트가 동일한 데이터 공유
 */
export function useMenus(): UseMenusReturn {
  // 글로벌 상태 구독
  const [state, setState] = useState(() => globalMenuState.getState());

  useEffect(() => {
    // 상태 변경 구독
    const unsubscribe = globalMenuState.subscribe(() => {
      setState(globalMenuState.getState());
    });

    // 초기 데이터 로딩 (한 번만)
    globalMenuState.fetchMenus();

    // 메뉴 업데이트 이벤트 리스너
    const handleMenuUpdate = () => {
      globalMenuState.invalidate();
    };

    window.addEventListener('menuUpdated', handleMenuUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('menuUpdated', handleMenuUpdate);
    };
  }, []);

  // refetch 함수
  const refetch = useCallback(() => {
    globalMenuState.invalidate();
  }, []);

  // 반환값 메모이제이션
  return useMemo(() => ({
    menuItems: state.menuItems,
    menuLoading: state.loading,
    userRole: state.userRole,
    refetch,
    error: state.error
  }), [state.menuItems, state.loading, state.userRole, refetch, state.error]);
}

export default useMenus; 