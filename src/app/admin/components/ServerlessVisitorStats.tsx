"use client";
// src/app/admin/components/ServerlessVisitorStats.tsx - 서버리스 최적화 접속자 통계
import React, { useState, useEffect } from "react";
import './styles.css';

interface AnalyticsData {
  period: string;
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  deviceStats: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  browserStats: Array<{
    browser: string;
    count: number;
    percentage: number;
  }>;
  osStats: Array<{
    os: string;
    count: number;
    percentage: number;
  }>;
  topPages: Array<{
    title: string;
    url: string;
    views: number;
  }>;
  timeSeries: Array<{
    time?: string;
    date?: string;
    visits: number;
    pageViews: number;
  }>;
}

const ServerlessVisitorStats: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('today');
  const [loading, setLoading] = useState(true);
  const [localStats, setLocalStats] = useState<Record<string, { visits: number }> | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // 서버리스 최적화된 API 호출
        const response = await fetch(`/api/admin/analytics-simple?period=${period}`, {
          headers: {
            'Authorization': 'Bearer admin-token'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        } else {
          console.error('접속자 통계 로드 실패');
        }
      } catch (error) {
        console.error('API 호출 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    // 로컬 스토리지에서 통계 가져오기
    const getLocalStats = () => {
      try {
        const stats = JSON.parse(localStorage.getItem('localAnalytics') || '{}');
        setLocalStats(stats);
      } catch (error) {
        console.error('로컬 통계 로드 오류:', error);
      }
    };

    fetchAnalytics();
    getLocalStats();
  }, [period]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">서버리스 접속자 통계</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1 text-sm rounded ${
                period === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              오늘
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1 text-sm rounded ${
                period === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              이번 주
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1 text-sm rounded ${
                period === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              이번 달
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* 요약 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData.summary.totalVisits.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">총 접속</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analyticsData.summary.uniqueVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">고유 방문자</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData.summary.pageViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">페이지뷰</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {analyticsData.summary.bounceRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">이탈률</div>
          </div>
        </div>

        {/* 로컬 통계 (실제 브라우저 데이터) */}
        {localStats && (
          <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-2">📊 로컬 브라우저 통계</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(localStats).slice(0, 4).map(([date, data]: [string, { visits: number }]) => (
                <div key={date} className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{data.visits}</div>
                  <div className="text-xs text-gray-600">{date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 디바이스별 통계 */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">디바이스별 접속</h4>
            <div className="space-y-3">
              {analyticsData.deviceStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">
                      {stat.device === 'desktop' ? '💻' : stat.device === 'mobile' ? '📱' : '📱'}
                    </span>
                    <span className="text-sm text-gray-700 capitalize">{stat.device}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full admin-progress-bar"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 브라우저별 통계 */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">브라우저별 접속</h4>
            <div className="space-y-3">
              {analyticsData.browserStats.slice(0, 5).map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🌐</span>
                    <span className="text-sm text-gray-700">{stat.browser}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full admin-progress-bar"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 인기 페이지 */}
        <div className="mt-8">
          <h4 className="text-md font-medium text-gray-900 mb-3">인기 페이지</h4>
          <div className="space-y-2">
            {analyticsData.topPages.slice(0, 5).map((page, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-700 truncate flex-1">{page.title}</span>
                <span className="text-sm font-medium text-gray-900">{page.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 시간별/일별 통계 */}
        <div className="mt-8">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            {period === 'today' ? '시간별 접속' : '일별 접속'}
          </h4>
          <div className="space-y-2">
            {analyticsData.timeSeries.slice(0, 8).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-700">
                  {period === 'today' ? item.time : item.date}
                </span>
                <span className="text-sm font-medium text-gray-900">{item.visits}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerlessVisitorStats; 
 
 