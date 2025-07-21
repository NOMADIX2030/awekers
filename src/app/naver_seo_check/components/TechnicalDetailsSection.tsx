'use client';

import { TechnicalDetails } from '../types';

interface TechnicalDetailsSectionProps {
  data: TechnicalDetails;
}

export function TechnicalDetailsSection({ data }: TechnicalDetailsSectionProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          기본 정보
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatBytes(data.pageSize)}
            </div>
            <div className="text-sm text-gray-600">페이지 크기</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatTime(data.loadTime)}
            </div>
            <div className="text-sm text-gray-600">로딩 시간</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {data.httpsEnabled ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">HTTPS</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {data.compressionEnabled ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">압축</div>
          </div>
        </div>
      </div>

      {/* 메타 태그 정보 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          메타 태그
        </h3>

        <div className="space-y-4">
          {Object.entries(data.metaTags).map(([key, value]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {value ? '존재' : '없음'}
                </span>
              </div>
              {value && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-mono break-all">
                  {value}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 구조화 데이터 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          구조화 데이터
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">JSON-LD 스키마</div>
              <div className="text-sm text-gray-600">구조화 데이터 형식</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              data.structuredData.hasJsonLd 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {data.structuredData.hasJsonLd ? '발견됨' : '없음'}
            </div>
          </div>

          {data.structuredData.schemas.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900 mb-2">발견된 스키마 타입</div>
              <div className="flex flex-wrap gap-2">
                {data.structuredData.schemas.map((schema, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {schema}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 성능 지표 */}
      {data.performance && Object.keys(data.performance).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Core Web Vitals
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.performance.firstContentfulPaint && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600 mb-1">
                  {formatTime(data.performance.firstContentfulPaint)}
                </div>
                <div className="text-sm text-gray-600">First Contentful Paint</div>
              </div>
            )}

            {data.performance.largestContentfulPaint && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600 mb-1">
                  {formatTime(data.performance.largestContentfulPaint)}
                </div>
                <div className="text-sm text-gray-600">Largest Contentful Paint</div>
              </div>
            )}

            {data.performance.firstInputDelay && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600 mb-1">
                  {formatTime(data.performance.firstInputDelay)}
                </div>
                <div className="text-sm text-gray-600">First Input Delay</div>
              </div>
            )}

            {data.performance.cumulativeLayoutShift !== undefined && (
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600 mb-1">
                  {data.performance.cumulativeLayoutShift.toFixed(3)}
                </div>
                <div className="text-sm text-gray-600">Cumulative Layout Shift</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 모바일 최적화 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          모바일 최적화
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className={`text-3xl font-bold mb-2 ${data.mobileOptimized ? 'text-green-600' : 'text-red-600'}`}>
              {data.mobileOptimized ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">모바일 친화적</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.mobileOptimized ? '최적화됨' : '개선 필요'}
            </div>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600 mb-2">
              {data.metaTags.viewport ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Viewport 설정</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.metaTags.viewport ? '설정됨' : '누락'}
            </div>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600 mb-2">
              반응형
            </div>
            <div className="text-sm text-gray-600">디자인</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.mobileOptimized ? '적용됨' : '확인 필요'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 