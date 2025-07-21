// 🎯 새로운 Layout - 독립적 헤더 시스템 적용
"use client";

import "./globals.css";
import React from "react";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { Analytics } from '@vercel/analytics/react';
import Header from '../components/header/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="font-sans">
      <body className="bg-white text-black min-h-screen flex flex-col">
        {/* 🎯 새로운 독립적 헤더 - 708줄에서 1줄로 단순화 */}
        <Header />
        
        {/* 메인 컨텐츠 */}
        <main 
          className="flex-1 flex flex-col items-center justify-center px-4 pt-16" 
          style={{ 
            zIndex: 0,
            position: 'relative'
          }}
        >
          {children}
        </main>
        
        {/* 접속자 추적 */}
        <AnalyticsTracker />
        <Analytics />
        
        {/* 푸터 */}
        <footer className="w-full border-t border-black/10 bg-white py-6 text-center text-xs text-black/60 mt-auto">
          © {new Date().getFullYear()} AWEKERS. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
