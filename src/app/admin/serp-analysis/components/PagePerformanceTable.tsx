"use client";
import React, { useState } from 'react';

interface PagePerformanceData {
  page: string;
  url: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  change: number;
}

interface PagePerformanceTableProps {
  data?: PagePerformanceData[];
}

const PagePerformanceTable: React.FC<PagePerformanceTableProps> = ({ data = [] }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        페이지 성과 데이터가 없습니다.
      </div>
    );
  }

  const toggleCard = (pageUrl: string) => {
    setExpandedCard(expandedCard === pageUrl ? null : pageUrl);
  };

  return (
    <div className="space-y-4">
      {/* 데스크톱 테이블 (lg 이상에서만 표시) */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  페이지
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  노출수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  클릭수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  평균 순위
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  변화
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((page, index) => (
                <tr key={`${page.url}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {page.page}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {page.url}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(page.impressions || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(page.clicks || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(page.ctr || 0).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(page.avgPosition || 0).toFixed(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      page.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {page.change >= 0 ? '↗' : '↘'} {Math.abs(page.change)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 카드 레이아웃 (lg 미만에서만 표시) */}
      <div className="lg:hidden space-y-3">
        {data.map((page, index) => (
          <div 
            key={`${page.url}-${index}`}
            className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* 카드 헤더 */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleCard(page.url)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {page.page}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {page.url}
                  </p>
                </div>
                <div className="flex items-center space-x-3 ml-3">
                  {/* 핵심 지표 미리보기 */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {(page.clicks || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">클릭</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {(page.avgPosition || 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">순위</div>
                  </div>
                  {/* 확장/축소 아이콘 */}
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedCard === page.url ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 확장된 상세 정보 */}
            {expandedCard === page.url && (
              <div className="border-t border-gray-200 bg-white p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-900">
                      {(page.impressions || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">노출수</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-900">
                      {(page.clicks || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600 font-medium">클릭수</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-900">
                      {(page.ctr || 0).toFixed(2)}%
                    </div>
                    <div className="text-xs text-purple-600 font-medium">CTR</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-900">
                      {(page.avgPosition || 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-orange-600 font-medium">평균 순위</div>
                  </div>
                </div>
                
                {/* 변화율 표시 */}
                <div className="flex items-center justify-center pt-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    page.change >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <span className="mr-1">
                      {page.change >= 0 ? '↗' : '↘'}
                    </span>
                    {Math.abs(page.change)}% 변화
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PagePerformanceTable; 
 
 