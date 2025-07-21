"use client";

import React from "react";

interface PerformanceSectionProps {
  data: {
    loadTime: number;
    score: number;
    optimization: {
      minifiedCss: boolean;
      minifiedJs: boolean;
      compressedImages: boolean;
      lazyLoading: boolean;
      score: number;
    };
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
      score: number;
    };
    caching: {
      browserCache: boolean;
      serverCache: boolean;
      cdnUsage: boolean;
      score: number;
    };
    compression: {
      gzipEnabled: boolean;
      brotliEnabled: boolean;
      score: number;
    };
    resources: {
      totalRequests: number;
      totalSize: number;
      criticalResources: number;
      score: number;
    };
    server: {
      responseTime: number;
      ttf: number;
      score: number;
    };
  };
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ data }) => {
  const getStatusIcon = (exists: boolean) => {
    return exists ? "✅" : "❌";
  };

  const getStatusColor = (exists: boolean) => {
    return exists ? "text-green-600" : "text-red-600";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return "🟢";
    if (score >= 60) return "🟡";
    return "🔴";
  };

  const getLCPColor = (lcp: number) => {
    if (lcp <= 2500) return "text-green-600";
    if (lcp <= 4000) return "text-yellow-600";
    return "text-red-600";
  };

  const getFIDColor = (fid: number) => {
    if (fid <= 100) return "text-green-600";
    if (fid <= 300) return "text-yellow-600";
    return "text-red-600";
  };

  const getCLSColor = (cls: number) => {
    if (cls <= 0.1) return "text-green-600";
    if (cls <= 0.25) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      {/* 기본 성능 정보 */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-blue-900">⚡ 기본 성능</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
              {data.score}점
            </div>
            <div className="text-xs text-blue-600">로딩: {data.loadTime}ms</div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">CSS 압축</span>
            <span className={getStatusColor(data.optimization.minifiedCss)}>
              {getStatusIcon(data.optimization.minifiedCss)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">JS 압축</span>
            <span className={getStatusColor(data.optimization.minifiedJs)}>
              {getStatusIcon(data.optimization.minifiedJs)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">이미지 압축</span>
            <span className={getStatusColor(data.optimization.compressedImages)}>
              {getStatusIcon(data.optimization.compressedImages)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">지연 로딩</span>
            <span className={getStatusColor(data.optimization.lazyLoading)}>
              {getStatusIcon(data.optimization.lazyLoading)}
            </span>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="p-4 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-green-900">📊 Core Web Vitals</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.coreWebVitals.score)}`}>
              {data.coreWebVitals.score}점
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">LCP (Largest Contentful Paint)</span>
            <span className={`font-bold ${getLCPColor(data.coreWebVitals.lcp)}`}>
              {data.coreWebVitals.lcp}ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">FID (First Input Delay)</span>
            <span className={`font-bold ${getFIDColor(data.coreWebVitals.fid)}`}>
              {data.coreWebVitals.fid}ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">CLS (Cumulative Layout Shift)</span>
            <span className={`font-bold ${getCLSColor(data.coreWebVitals.cls)}`}>
              {data.coreWebVitals.cls}
            </span>
          </div>
        </div>
      </div>

      {/* 캐싱 */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-purple-900">💾 캐싱</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.caching.score)}`}>
              {data.caching.score}점
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">브라우저 캐시</span>
            <span className={getStatusColor(data.caching.browserCache)}>
              {getStatusIcon(data.caching.browserCache)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">서버 캐시</span>
            <span className={getStatusColor(data.caching.serverCache)}>
              {getStatusIcon(data.caching.serverCache)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">CDN 사용</span>
            <span className={getStatusColor(data.caching.cdnUsage)}>
              {getStatusIcon(data.caching.cdnUsage)}
            </span>
          </div>
        </div>
      </div>

      {/* 압축 */}
      <div className="p-4 bg-orange-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-orange-900">🗜️ 압축</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.compression.score)}`}>
              {data.compression.score}점
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Gzip 압축</span>
            <span className={getStatusColor(data.compression.gzipEnabled)}>
              {getStatusIcon(data.compression.gzipEnabled)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Brotli 압축</span>
            <span className={getStatusColor(data.compression.brotliEnabled)}>
              {getStatusIcon(data.compression.brotliEnabled)}
            </span>
          </div>
        </div>
      </div>

      {/* 리소스 */}
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-red-900">📦 리소스</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.resources.score)}`}>
              {data.resources.score}점
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">총 요청 수</span>
            <span className="font-bold text-gray-600">
              {data.resources.totalRequests}개
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">예상 총 크기</span>
            <span className="font-bold text-gray-600">
              {data.resources.totalSize}KB
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">중요 리소스</span>
            <span className="font-bold text-gray-600">
              {data.resources.criticalResources}개
            </span>
          </div>
        </div>
      </div>

      {/* 서버 성능 */}
      <div className="p-4 bg-indigo-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-indigo-900">🖥️ 서버 성능</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.server.score)}`}>
              {data.server.score}점
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">응답 시간</span>
            <span className="font-bold text-gray-600">
              {data.server.responseTime}ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">TTFB (Time to First Byte)</span>
            <span className="font-bold text-gray-600">
              {data.server.ttf}ms
            </span>
          </div>
        </div>
      </div>

      {/* 권장사항 */}
      <div className="p-3 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">💡 성능 최적화 권장사항</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          {data.loadTime > 2000 && (
            <li>• 페이지 로딩 시간을 2초 이하로 개선하세요.</li>
          )}
          {!data.optimization.minifiedCss && (
            <li>• CSS 파일을 압축하여 파일 크기를 줄이세요.</li>
          )}
          {!data.optimization.minifiedJs && (
            <li>• JavaScript 파일을 압축하여 파일 크기를 줄이세요.</li>
          )}
          {!data.optimization.lazyLoading && (
            <li>• 이미지 지연 로딩을 적용하여 초기 로딩 속도를 개선하세요.</li>
          )}
          {data.coreWebVitals.lcp > 2500 && (
            <li>• LCP를 2.5초 이하로 개선하세요.</li>
          )}
          {data.coreWebVitals.fid > 100 && (
            <li>• FID를 100ms 이하로 개선하세요.</li>
          )}
          {data.coreWebVitals.cls > 0.1 && (
            <li>• CLS를 0.1 이하로 개선하세요.</li>
          )}
          {!data.caching.browserCache && (
            <li>• 브라우저 캐시를 설정하여 반복 방문 시 성능을 개선하세요.</li>
          )}
          {!data.compression.gzipEnabled && (
            <li>• Gzip 압축을 활성화하여 전송 크기를 줄이세요.</li>
          )}
          {data.resources.totalRequests > 20 && (
            <li>• HTTP 요청 수를 줄여 페이지 로딩 속도를 개선하세요.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PerformanceSection; 