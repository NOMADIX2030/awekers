"use client";

import "./globals.css";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { Analytics } from '@vercel/analytics/react';

const NAV_ITEMS = [
  { label: "메인", href: "/" },
  { label: "검색엔진최적화", href: "/tag/SEO" },
  { label: "백링크", href: "/tag/백링크" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 클라이언트에서 localStorage로 로그인 상태 감지
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }
  }, []);

  // 로그인/로그아웃 시 상태 동기화
  useEffect(() => {
    const onStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.push("/");
    setOpen(false);
  };

  // ESC 키, 포커스 트랩
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
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
    setTimeout(() => {
      if (drawerRef.current) {
        const first = drawerRef.current.querySelector<HTMLElement>('a, button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        first?.focus();
      }
    }, 50);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // 로그인 버튼 클릭 시 /login 이동
  const handleLogin = () => {
    router.push("/login");
    setOpen(false);
  };



  return (
    <html lang="ko" className="font-sans">
      <body className="bg-white text-black min-h-screen flex flex-col">
        {/* 헤더 */}
        <header className="w-full border-b border-black/10 bg-white sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
              <span className="inline-block w-7 h-7 bg-black rounded-full" />
              Awekers
            </Link>
            {/* PC 네비게이션 */}
            <nav className="hidden md:flex gap-8 text-base font-semibold">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-black/70 transition">
                  {item.label}
                </a>
              ))}
              {/* 관리자 메뉴 */}
              {isLoggedIn && typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true" && (
                <a href="/admin/dashboard" className="hover:text-black/70 transition font-bold text-blue-600">관리자</a>
              )}
            </nav>
            {isLoggedIn ? (
              <button
                className="hidden md:block px-5 py-2 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            ) : (
              <button
                className="hidden md:block px-5 py-2 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition"
                onClick={handleLogin}
              >
                로그인
              </button>
            )}
            {/* 모바일 햄버거 메뉴 버튼 */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-black/10 bg-white shadow hover:bg-gray-100 transition ml-2"
              aria-label="메뉴 열기"
              onClick={() => setOpen(true)}
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="2" rx="1" fill="#222"/><rect x="4" y="15" width="16" height="2" rx="1" fill="#222"/></svg>
            </button>
          </div>
          {/* 모바일 드로어 메뉴 */}
          {open && (
            <div className="fixed inset-0 z-50 bg-black/40 flex md:hidden" onClick={() => setOpen(false)}>
              <nav
                ref={drawerRef}
                className="bg-white w-72 max-w-[90vw] h-full shadow-2xl rounded-l-2xl p-8 flex flex-col animate-slide-in-right ml-auto focus:outline-none"
                onClick={e => e.stopPropagation()}
                aria-label="모바일 내비게이션"
                tabIndex={-1}
              >
                {/* 상단 Close 버튼 */}
                <div className="flex items-center justify-between mb-10">
                  <span className="font-bold text-lg text-gray-900">메뉴</span>
                  <button className="hover:bg-gray-100 rounded-full p-3 transition border border-gray-200 shadow focus:ring-2 focus:ring-black" onClick={() => setOpen(false)} aria-label="메뉴 닫기" autoFocus>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#222" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6"/></svg>
                  </button>
                </div>
                {/* 네비게이션 메뉴 */}
                <div className="flex flex-col gap-3 mb-10">
                  {NAV_ITEMS.map((item) => (
                    <a key={item.href} href={item.href} className="block px-4 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition focus:bg-gray-200 focus:outline-none" onClick={() => setOpen(false)} tabIndex={0}>
                      {item.label}
                    </a>
                  ))}
                  {/* 관리자 메뉴 */}
                  {isLoggedIn && typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true" && (
                    <a href="/admin/dashboard" className="block px-4 py-3 rounded-lg text-base font-bold text-blue-600 hover:bg-gray-100 active:bg-gray-200 transition focus:bg-gray-200 focus:outline-none" onClick={() => setOpen(false)} tabIndex={0}>
                      관리자
                    </a>
                  )}
                </div>
                {/* CTA 버튼 */}
                {isLoggedIn ? (
                  <button className="w-full mt-auto px-6 py-3 rounded-full bg-black text-white font-semibold text-base shadow-lg hover:bg-gray-900 transition focus:ring-2 focus:ring-black focus:outline-none" onClick={handleLogout}>
                    로그아웃
                  </button>
                ) : (
                  <button className="w-full mt-auto px-6 py-3 rounded-full bg-black text-white font-semibold text-base shadow-lg hover:bg-gray-900 transition focus:ring-2 focus:ring-black focus:outline-none" onClick={handleLogin}>
                    로그인
                  </button>
                )}
              </nav>
            </div>
          )}
          {/* 드로어 애니메이션 */}
          <style jsx>{`
            @keyframes slide-in-right {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .animate-slide-in-right {
              animation: slide-in-right 0.25s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </header>
        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          {children}
        </main>
        
        {/* 접속자 추적 */}
        <AnalyticsTracker />
        <Analytics />
        {/* 푸터 */}
        <footer className="w-full border-t border-black/10 bg-white py-6 text-center text-xs text-black/60 mt-auto">
          © {new Date().getFullYear()} Awekers. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
