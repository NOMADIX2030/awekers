"use client";

import React from "react";

interface MobileOptimizationSectionProps {
  data: {
    responsive: boolean;
    viewport: boolean;
    touchFriendly: boolean;
    score: number;
    performance: {
      loadTime: number;
      score: number;
      optimization: {
        minifiedCss: boolean;
        minifiedJs: boolean;
        compressedImages: boolean;
        lazyLoading: boolean;
        score: number;
      };
    };
    usability: {
      score: number;
      touchTargets: {
        score: number;
        buttonSize: boolean;
        linkSpacing: boolean;
      };
      readability: {
        score: number;
        fontSize: boolean;
        lineHeight: boolean;
        colorContrast: boolean;
      };
      navigation: {
        score: number;
        hamburgerMenu: boolean;
        stickyHeader: boolean;
        breadcrumbs: boolean;
      };
    };
    content: {
      score: number;
      textSize: boolean;
      imageScaling: boolean;
      videoResponsive: boolean;
      tableResponsive: boolean;
    };
    technical: {
      score: number;
      noInterstitials: boolean;
      noHorizontalScroll: boolean;
      properMetaTags: boolean;
      ampSupport: boolean;
    };
  };
}

const MobileOptimizationSection: React.FC<MobileOptimizationSectionProps> = ({ data }) => {
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

  return (
    <div className="space-y-4">
      {/* 기본 모바일 요소 */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-blue-900">📱 기본 모바일 요소</span>
          <span className="text-sm font-bold text-blue-700">{data.score}점</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">반응형 디자인</span>
            <span className={getStatusColor(data.responsive)}>
              {getStatusIcon(data.responsive)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Viewport 메타 태그</span>
            <span className={getStatusColor(data.viewport)}>
              {getStatusIcon(data.viewport)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">터치 친화적</span>
            <span className={getStatusColor(data.touchFriendly)}>
              {getStatusIcon(data.touchFriendly)}
            </span>
          </div>
        </div>
      </div>

      {/* 모바일 성능 */}
      <div className="p-4 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-green-900">⚡ 모바일 성능</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.performance.score)}`}>
              {data.performance.score}점
            </div>
            <div className="text-xs text-green-600">로딩: {data.performance.loadTime}ms</div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">CSS 압축</span>
            <span className={getStatusColor(data.performance.optimization.minifiedCss)}>
              {getStatusIcon(data.performance.optimization.minifiedCss)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">JS 압축</span>
            <span className={getStatusColor(data.performance.optimization.minifiedJs)}>
              {getStatusIcon(data.performance.optimization.minifiedJs)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">이미지 압축</span>
            <span className={getStatusColor(data.performance.optimization.compressedImages)}>
              {getStatusIcon(data.performance.optimization.compressedImages)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">지연 로딩</span>
            <span className={getStatusColor(data.performance.optimization.lazyLoading)}>
              {getStatusIcon(data.performance.optimization.lazyLoading)}
            </span>
          </div>
        </div>
      </div>

      {/* 모바일 사용성 */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-purple-900">👆 모바일 사용성</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.usability.score)}`}>
              {data.usability.score}점
            </div>
          </div>
        </div>
        
        {/* 터치 타겟 */}
        <div className="mb-3">
          <div className="text-sm font-medium text-purple-800 mb-2">터치 타겟</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">버튼 크기 (48px+)</span>
              <span className={getStatusColor(data.usability.touchTargets.buttonSize)}>
                {getStatusIcon(data.usability.touchTargets.buttonSize)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">링크 간격</span>
              <span className={getStatusColor(data.usability.touchTargets.linkSpacing)}>
                {getStatusIcon(data.usability.touchTargets.linkSpacing)}
              </span>
            </div>
          </div>
        </div>
        
        {/* 가독성 */}
        <div className="mb-3">
          <div className="text-sm font-medium text-purple-800 mb-2">가독성</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">폰트 크기 (16px+)</span>
              <span className={getStatusColor(data.usability.readability.fontSize)}>
                {getStatusIcon(data.usability.readability.fontSize)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">줄 간격</span>
              <span className={getStatusColor(data.usability.readability.lineHeight)}>
                {getStatusIcon(data.usability.readability.lineHeight)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">색상 대비</span>
              <span className={getStatusColor(data.usability.readability.colorContrast)}>
                {getStatusIcon(data.usability.readability.colorContrast)}
              </span>
            </div>
          </div>
        </div>
        
        {/* 네비게이션 */}
        <div>
          <div className="text-sm font-medium text-purple-800 mb-2">네비게이션</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">햄버거 메뉴</span>
              <span className={getStatusColor(data.usability.navigation.hamburgerMenu)}>
                {getStatusIcon(data.usability.navigation.hamburgerMenu)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">고정 헤더</span>
              <span className={getStatusColor(data.usability.navigation.stickyHeader)}>
                {getStatusIcon(data.usability.navigation.stickyHeader)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">브레드크럼</span>
              <span className={getStatusColor(data.usability.navigation.breadcrumbs)}>
                {getStatusIcon(data.usability.navigation.breadcrumbs)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 콘텐츠 */}
      <div className="p-4 bg-orange-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-orange-900">📄 모바일 콘텐츠</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.content.score)}`}>
              {data.content.score}점
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">텍스트 크기</span>
            <span className={getStatusColor(data.content.textSize)}>
              {getStatusIcon(data.content.textSize)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">이미지 스케일링</span>
            <span className={getStatusColor(data.content.imageScaling)}>
              {getStatusIcon(data.content.imageScaling)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">비디오 반응형</span>
            <span className={getStatusColor(data.content.videoResponsive)}>
              {getStatusIcon(data.content.videoResponsive)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">테이블 반응형</span>
            <span className={getStatusColor(data.content.tableResponsive)}>
              {getStatusIcon(data.content.tableResponsive)}
            </span>
          </div>
        </div>
      </div>

      {/* 모바일 기술적 요소 */}
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-red-900">🔧 기술적 요소</span>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.technical.score)}`}>
              {data.technical.score}점
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">인터스티셜 없음</span>
            <span className={getStatusColor(data.technical.noInterstitials)}>
              {getStatusIcon(data.technical.noInterstitials)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">가로 스크롤 없음</span>
            <span className={getStatusColor(data.technical.noHorizontalScroll)}>
              {getStatusIcon(data.technical.noHorizontalScroll)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">적절한 메타 태그</span>
            <span className={getStatusColor(data.technical.properMetaTags)}>
              {getStatusIcon(data.technical.properMetaTags)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">AMP 지원</span>
            <span className={getStatusColor(data.technical.ampSupport)}>
              {getStatusIcon(data.technical.ampSupport)}
            </span>
          </div>
        </div>
      </div>

      {/* 권장사항 */}
      <div className="p-3 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">💡 모바일 최적화 권장사항</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          {!data.responsive && (
            <li>• 반응형 디자인을 적용하여 모든 화면 크기에서 최적화하세요.</li>
          )}
          {!data.viewport && (
            <li>• Viewport 메타 태그를 추가하여 모바일 최적화를 완성하세요.</li>
          )}
          {data.performance.loadTime > 2000 && (
            <li>• 모바일 로딩 속도를 2초 이하로 개선하세요.</li>
          )}
          {!data.performance.optimization.lazyLoading && (
            <li>• 이미지 지연 로딩을 적용하여 초기 로딩 속도를 개선하세요.</li>
          )}
          {!data.usability.touchTargets.buttonSize && (
            <li>• 터치 타겟을 최소 48px로 설정하여 사용성을 개선하세요.</li>
          )}
          {!data.usability.readability.fontSize && (
            <li>• 모바일에서 읽기 쉬운 폰트 크기(16px+)를 사용하세요.</li>
          )}
          {!data.content.imageScaling && (
            <li>• 이미지가 모바일 화면에 맞게 스케일링되도록 설정하세요.</li>
          )}
          {!data.technical.noInterstitials && (
            <li>• 방해가 되는 팝업이나 인터스티셜을 제거하세요.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileOptimizationSection; 