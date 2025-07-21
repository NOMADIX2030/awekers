// 🎯 헤더 인증 버튼 컴포넌트 - 현재 디자인 100% 보존
"use client";

import React from 'react';
import { HeaderAuthProps } from '../types';

/**
 * HeaderAuth 컴포넌트
 * 
 * 현재 layout.tsx의 인증 버튼을 100% 동일하게 복사:
 * - 로그인/로그아웃 버튼
 * - 그라데이션 배경
 * - SVG 아이콘
 * - 호버 애니메이션
 */
export const HeaderAuth: React.FC<HeaderAuthProps> = ({
  isLoggedIn,
  onLogin,
  onLogout,
  className
}) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      {isLoggedIn ? (
        <button
          onClick={onLogout}
          className="auth-button flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
          aria-label="로그아웃"
          title="로그아웃"
        >
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </button>
      ) : (
        <button
          onClick={onLogin}
          className="auth-button flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
          aria-label="로그인"
          title="로그인"
        >
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default HeaderAuth; 