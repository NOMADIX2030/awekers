"use client";
// src/app/components/AnalyticsTracker.tsx - 접속자 추적 컴포넌트
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AnalyticsTrackerProps {
  blogId?: number;
  userId?: number;
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ blogId, userId }) => {
  const pathname = usePathname();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // 페이지 정보 수집
        const pageUrl = window.location.href;
        const pageTitle = document.title || 'Awekers Blog';
        
        // 접속 추적 API 호출
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageUrl,
            pageTitle,
            blogId,
            userId
          })
        });
      } catch (error) {
        console.error('접속 추적 오류:', error);
      }
    };

    // 페이지 로드 시 추적
    trackPageView();
  }, [pathname, blogId, userId]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
};

export default AnalyticsTracker; 
 
 