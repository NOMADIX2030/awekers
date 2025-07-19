"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';
import AdminCard from '../components/AdminCard';
import { StatCard } from '../components/AdminCard';
import SERPTrafficChart from './components/SERPTrafficChart';
import TrafficSourceChart from './components/TrafficSourceChart';
import KeywordAnalysis from './components/KeywordAnalysis';
import PagePerformanceTable from './components/PagePerformanceTable';
import SERPInsights from './components/SERPInsights';
import GoogleAnalyticsConfig from './components/GoogleAnalyticsConfig';
import HelpTooltip from '../components/HelpTooltip';
import { SERPHelpContent } from './data/helpContent';
import HelpGuide from './components/HelpGuide';

// SERP 데이터 타입 정의
interface OverviewData {
  totalVisits?: number;
  visitsChange?: number;
  organicTraffic?: number;
  organicChange?: number;
  bounceRate?: number;
  avgSessionDuration?: number;
  pageViews?: number;
  uniqueVisitors?: number;
  avgCTR?: number;
  ctrChange?: number;
  avgPosition?: number;
  positionChange?: number;
}

interface SERPData {
  overview?: OverviewData;
  traffic?: unknown[];
  keywords?: unknown[];
  pages?: unknown[];
  insights?: unknown[];
  trafficTrend?: unknown[];
  trafficSources?: unknown[];
  pagePerformance?: unknown[];
}

const SERPAnalysisPage: React.FC = () => {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [compareMode, setCompareMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SERPData | null>(null);
  const [configChanged, setConfigChanged] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 클라이언트에서 관리자 권한 체크
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin !== "true") {
        alert("관리자만 접근 가능합니다.");
        router.replace("/login");
      }
    }
  }, [router]);

  // SERP 데이터 로드
  useEffect(() => {
    const fetchSERPData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/serp-analysis?period=${selectedPeriod}&compare=${compareMode}`, {
          headers: {
            'Authorization': 'Bearer admin-token'
          }
        });
        
        if (response.ok) {
          const serpData = await response.json();
          setData(serpData);
        } else {
          console.error('SERP 데이터 로드 실패');
        }
      } catch (error) {
        console.error('SERP API 호출 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSERPData();
  }, [selectedPeriod, compareMode, configChanged]);

  const periods = [
    { value: '7', label: '7일' },
    { value: '30', label: '30일' },
    { value: '90', label: '90일' }
  ];

  const tabs = [
    { id: 'overview', label: '개요', icon: '📊' },
    { id: 'traffic', label: '트래픽', icon: '📈' },
    { id: 'keywords', label: '키워드', icon: '🔍' },
    { id: 'pages', label: '페이지', icon: '📄' },
    { id: 'insights', label: '인사이트', icon: '💡' }
  ];

  if (loading) {
    return (
      <AdminLayout 
        title="SERP 분석" 
        description="검색엔진 결과 페이지 성과 및 유입경로 분석"
        breadcrumbs={[
          { label: "관리자 홈", href: "/admin/dashboard" },
          { label: "SERP 분석", href: "/admin/serp-analysis", current: true }
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">SERP 데이터를 분석 중입니다...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="SERP 분석"
      description="검색엔진 결과 페이지 성과 및 유입경로 분석"
      breadcrumbs={[
        { label: "관리자 홈", href: "/admin/dashboard" },
        { label: "SERP 분석", href: "/admin/serp-analysis", current: true }
      ]}
    >
      {/* 모바일 최적화된 필터 및 컨트롤 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="space-y-4">
          {/* 상단 필터 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  분석 기간
                </label>
                <HelpTooltip 
                  title={SERPHelpContent.periodSettings.title}
                  content={SERPHelpContent.periodSettings.content}
                  position="bottom"
                  size="md"
                />
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="flex-1 sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  id="compareMode"
                  checked={compareMode}
                  onChange={(e) => setCompareMode(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span>이전 기간과 비교</span>
              </label>
            </div>
          </div>

          {/* 마지막 업데이트 */}
          <div className="text-xs text-gray-500 text-center sm:text-right">
            마지막 업데이트: {new Date().toLocaleString('ko-KR')}
          </div>
        </div>
      </div>

      {/* 도움말 가이드 */}
      <HelpGuide />
      
      {/* Google Analytics 설정 */}
      <GoogleAnalyticsConfig onConfigChange={() => setConfigChanged(!configChanged)} />
      
      {/* 모바일 탭 네비게이션 */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 개요 탭 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 주요 지표 카드 - 모바일 최적화 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl sm:text-2xl">📈</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {data?.overview?.totalVisits?.toLocaleString() || '0'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">총 방문자</h3>
                <HelpTooltip 
                  title={SERPHelpContent.totalVisits.title}
                  content={SERPHelpContent.totalVisits.content}
                  position="top"
                  size="lg"
                />
              </div>
              {data?.overview?.visitsChange && (
                <div className={`text-xs sm:text-sm mt-2 ${
                  data.overview.visitsChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.overview.visitsChange >= 0 ? '↗' : '↘'} {Math.abs(data.overview.visitsChange)}%
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl sm:text-2xl">🔍</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {data?.overview?.organicTraffic?.toLocaleString() || '0'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">유기적 트래픽</h3>
                <HelpTooltip 
                  title={SERPHelpContent.organicTraffic.title}
                  content={SERPHelpContent.organicTraffic.content}
                  position="top"
                  size="lg"
                />
              </div>
              {data?.overview?.organicChange && (
                <div className={`text-xs sm:text-sm mt-2 ${
                  data.overview.organicChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.overview.organicChange >= 0 ? '↗' : '↘'} {Math.abs(data.overview.organicChange)}%
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl sm:text-2xl">🎯</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {((data?.overview?.avgCTR || 0)).toFixed(2)}%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">평균 CTR</h3>
                <HelpTooltip 
                  title={SERPHelpContent.avgCTR.title}
                  content={SERPHelpContent.avgCTR.content}
                  position="top"
                  size="lg"
                />
              </div>
              {data?.overview?.ctrChange && (
                <div className={`text-xs sm:text-sm mt-2 ${
                  data.overview.ctrChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.overview.ctrChange >= 0 ? '↗' : '↘'} {Math.abs(data.overview.ctrChange)}%
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl sm:text-2xl">📊</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {((data?.overview?.avgPosition || 0)).toFixed(1)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">평균 순위</h3>
                <HelpTooltip 
                  title={SERPHelpContent.avgPosition.title}
                  content={SERPHelpContent.avgPosition.content}
                  position="top"
                  size="lg"
                />
              </div>
              {data?.overview?.positionChange && (
                <div className={`text-xs sm:text-sm mt-2 ${
                  data.overview.positionChange <= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.overview.positionChange <= 0 ? '↗' : '↘'} {Math.abs(data.overview.positionChange)}
                </div>
              )}
            </div>
          </div>

          {/* 차트 섹션 - 모바일에서 세로 배치 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">트래픽 추이</h3>
                <HelpTooltip 
                  title={SERPHelpContent.trafficTrend.title}
                  content={SERPHelpContent.trafficTrend.content}
                  position="left"
                  size="md"
                />
              </div>
              <div className="h-64 sm:h-80">
                <SERPTrafficChart data={data?.trafficTrend as any} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">유입 소스 분포</h3>
                <HelpTooltip 
                  title={SERPHelpContent.trafficSources.title}
                  content={SERPHelpContent.trafficSources.content}
                  position="left"
                  size="md"
                />
              </div>
              <div className="h-64 sm:h-80">
                <TrafficSourceChart data={data?.trafficSources as any} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 트래픽 탭 */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">트래픽 상세 분석</h3>
            </div>
            <div className="h-80 sm:h-96">
              <SERPTrafficChart data={data?.trafficTrend as any} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">유입 소스 분석</h3>
            </div>
            <div className="h-80 sm:h-96">
              <TrafficSourceChart data={data?.trafficSources as any} />
            </div>
          </div>
        </div>
      )}

      {/* 키워드 탭 */}
      {activeTab === 'keywords' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">키워드 성과 분석</h3>
              <HelpTooltip 
                title={SERPHelpContent.keywordAnalysis.title}
                content={SERPHelpContent.keywordAnalysis.content}
                position="left"
                size="md"
              />
            </div>
            <KeywordAnalysis data={data?.keywords as any} />
          </div>
        </div>
      )}

      {/* 페이지 탭 */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">페이지별 성과</h3>
              <HelpTooltip 
                title={SERPHelpContent.pagePerformance.title}
                content={SERPHelpContent.pagePerformance.content}
                position="left"
                size="md"
              />
            </div>
            <PagePerformanceTable data={data?.pagePerformance as any} />
          </div>
        </div>
      )}

      {/* 인사이트 탭 */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">SERP 인사이트</h3>
              <HelpTooltip 
                title={SERPHelpContent.serpInsights.title}
                content={SERPHelpContent.serpInsights.content}
                position="left"
                size="md"
              />
            </div>
            <SERPInsights data={data?.insights as any} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SERPAnalysisPage; 
 