// 🎯 인증 상태 관리 훅 - 현재 로직 100% 보존
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UseAuthReturn, UserRole } from '../types';

/**
 * useAuth 훅
 * 
 * 현재 layout.tsx의 인증 관리 로직을 100% 동일하게 복사:
 * - isLoggedIn 상태 관리
 * - handleLogin/handleLogout 함수
 * - localStorage 감지 로직
 * - storage 이벤트 리스너
 * - 메뉴 새로고침 연동
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  
  // 현재 layout.tsx와 동일한 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);

  // 현재 layout.tsx의 handleLogin 함수를 100% 복사
  const handleLogin = () => {
    router.push("/login");
    // setOpen(false); // 원래 layout.tsx에 있던 코드이지만 여기서는 사이드바 관련이므로 제외
  };

  // 현재 layout.tsx의 handleLogout 함수를 100% 복사
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    
    // 메뉴 새로고침 (권한 변경으로 인한) - 현재 layout.tsx와 동일
    // fetchMenuItems(); // 원래 코드에 있던 부분이지만 여기서는 메뉴 훅과 분리되므로 이벤트로 처리
    window.dispatchEvent(new CustomEvent('menuUpdated'));
    
    router.push("/");
    // setOpen(false); // 원래 layout.tsx에 있던 코드이지만 여기서는 사이드바 관련이므로 제외
  };

  // 현재 layout.tsx의 localStorage 감지 로직을 100% 복사
  useEffect(() => {
    // 클라이언트에서 localStorage로 로그인 상태 감지
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      
      setIsLoggedIn(loggedIn);
      
      // 사용자 권한 설정
      if (isAdmin) {
        setUserRole(UserRole.ADMIN);
      } else if (loggedIn) {
        setUserRole(UserRole.USER);
      } else {
        setUserRole(UserRole.GUEST);
      }
    }
  }, []);

  // 현재 layout.tsx의 storage 이벤트 리스너를 100% 복사
  useEffect(() => {
    // 로그인/로그아웃 시 상태 동기화
    const onStorage = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      
      setIsLoggedIn(loggedIn);
      
      // 사용자 권한 설정
      if (isAdmin) {
        setUserRole(UserRole.ADMIN);
      } else if (loggedIn) {
        setUserRole(UserRole.USER);
      } else {
        setUserRole(UserRole.GUEST);
      }
    };
    
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return {
    isLoggedIn,
    handleLogin,
    handleLogout,
    userRole
  };
}

export default useAuth; 