"use client";
// src/app/components/ServerlessAnalyticsTracker.tsx - 서버리스 최적화 접속자 추적
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ServerlessAnalyticsTrackerProps {
  blogId?: number;
  userId?: number;
}

const ServerlessAnalyticsTracker: React.FC<ServerlessAnalyticsTrackerProps> = ({ blogId, userId }) => {
  const pathname = usePathname();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // 페이지 정보 수집
        const pageUrl = window.location.href;
        const pageTitle = document.title || 'Awekers Blog';
        
        // 서버리스 최적화된 접속 추적 API 호출
        await fetch('/api/analytics/track-simple', {
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

        // 로컬 스토리지에 간단한 통계 저장 (서버리스 환경에서)
        const today = new Date().toISOString().split('T')[0];
        const localStats = JSON.parse(localStorage.getItem('localAnalytics') || '{}');
        
        if (!localStats[today]) {
          localStats[today] = {
            visits: 0,
            pages: {}
          };
        }
        
        localStats[today].visits += 1;
        localStats[today].pages[pageUrl] = (localStats[today].pages[pageUrl] || 0) + 1;
        
        localStorage.setItem('localAnalytics', JSON.stringify(localStats));
        
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

export default ServerlessAnalyticsTracker; 
 
 