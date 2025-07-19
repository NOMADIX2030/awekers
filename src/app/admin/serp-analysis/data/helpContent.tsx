import React from 'react';

export const SERPHelpContent = {
  // 주요 지표 카드 설명
  totalVisits: {
    title: "총 방문자 (Total Visits)",
    content: (
      <div className="space-y-3">
        <p className="leading-relaxed">선택한 기간 동안 웹사이트를 방문한 총 사용자 수입니다.</p>
        
        <div className="space-y-2">
          <p className="font-medium text-blue-200">높을수록 좋은 이유:</p>
          <ul className="list-disc list-inside space-y-1 ml-3 text-gray-300">
            <li>웹사이트 인지도와 접근성이 좋음</li>
            <li>콘텐츠 품질이 우수함</li>
            <li>마케팅 전략이 효과적임</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium text-blue-200">분석 포인트:</p>
          <ul className="list-disc list-inside space-y-1 ml-3 text-gray-300">
            <li>이전 기간 대비 증가율로 성장 추세 파악</li>
            <li>계절성이나 특정 이벤트의 영향 분석</li>
            <li>경쟁사 대비 시장 점유율 평가</li>
          </ul>
        </div>
      </div>
    )
  },

  organicTraffic: {
    title: "유기적 트래픽 (Organic Traffic)",
    content: (
      <div className="space-y-3">
        <p className="leading-relaxed">검색엔진을 통해 자연스럽게 유입된 방문자 수입니다.</p>
        
        <div className="space-y-2">
          <p className="font-medium text-blue-200">SEO 성과의 핵심 지표:</p>
          <ul className="list-disc list-inside space-y-1 ml-3 text-gray-300">
            <li>검색엔진 최적화(SEO) 성과 반영</li>
            <li>유료 광고와 구분되는 자연 유입량</li>
            <li>지속 가능한 트래픽 소스</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium text-blue-200">개선 방향:</p>
          <ul className="list-disc list-inside space-y-1 ml-3 text-gray-300">
            <li>키워드 최적화 및 콘텐츠 품질 향상</li>
            <li>기술적 SEO 이슈 해결</li>
            <li>백링크 구축 및 내부 링크 최적화</li>
          </ul>
        </div>
      </div>
    )
  },

  avgCTR: {
    title: "평균 CTR (Click-Through Rate)",
    content: (
      <div className="space-y-3">
        <p className="leading-relaxed">검색 결과에서 웹사이트를 클릭한 비율입니다.</p>
        
        <div className="bg-blue-900/30 p-2 rounded text-center">
          <p className="font-mono text-blue-200">CTR = (클릭수 ÷ 노출수) × 100</p>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium text-blue-200">일반적인 CTR 수준:</p>
          <ul className="list-disc list-inside space-y-1 ml-3 text-gray-300">
            <li>1-3%: 양호한 수준</li>
            <li>3-5%: 우수한 수준</li>
            <li>5% 이상: 매우 우수</li>
            <li>1% 미만: 개선 필요</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium text-blue-200">CTR 향상 방법:</p>
          <ul className="list-disc list-inside space-y-1 ml-3 text-gray-300">
            <li>매력적인 메타 제목 작성</li>
            <li>명확하고 유혹적인 메타 설명</li>
            <li>리치 스니펫 최적화</li>
            <li>브랜드 인지도 향상</li>
          </ul>
        </div>
      </div>
    )
  },

  avgPosition: {
    title: "평균 순위 (Average Position)",
    content: (
      <div>
        <p className="mb-2">검색 결과에서 웹사이트가 나타나는 평균 위치입니다.</p>
        <div className="space-y-1 text-xs">
          <p><strong>순위별 평가:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>1-3위: 최적 (높은 클릭률 기대)</li>
            <li>4-10위: 양호 (좋은 노출 기회)</li>
            <li>11-20위: 보통 (개선 여지 있음)</li>
            <li>21위 이하: 개선 필요</li>
          </ul>
          <p className="mt-2"><strong>순위 개선 전략:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>콘텐츠 품질 및 관련성 향상</li>
            <li>페이지 로딩 속도 최적화</li>
            <li>모바일 친화성 개선</li>
            <li>사용자 경험(UX) 향상</li>
          </ul>
        </div>
      </div>
    )
  },

  // 차트 및 분석 섹션 설명
  trafficTrend: {
    title: "트래픽 추이 차트",
    content: (
      <div>
        <p className="mb-2">시간에 따른 웹사이트 방문자 수 변화를 시각화한 차트입니다.</p>
        <div className="space-y-1 text-xs">
          <p><strong>분석 포인트:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>일별/주별 트래픽 패턴 파악</li>
            <li>주말 vs 평일 접속 패턴</li>
            <li>계절성 트렌드 분석</li>
            <li>마케팅 캠페인 효과 측정</li>
          </ul>
          <p className="mt-2"><strong>패턴 해석:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>상승 추세: SEO 전략 효과적</li>
            <li>하락 추세: 경쟁사 대비 약점</li>
            <li>안정적: 일관된 성과 유지</li>
            <li>급격한 변화: 특정 이벤트 영향</li>
          </ul>
        </div>
      </div>
    )
  },

  trafficSources: {
    title: "유입 소스 분포",
    content: (
      <div>
        <p className="mb-2">방문자들이 어떤 경로를 통해 웹사이트에 유입되었는지 보여줍니다.</p>
        <div className="space-y-1 text-xs">
          <p><strong>주요 유입 경로:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>구글 검색:</strong> 가장 중요한 유기적 트래픽</li>
            <li><strong>네이버 검색:</strong> 한국 시장에서 중요한 소스</li>
            <li><strong>직접 유입:</strong> 브랜드 인지도 지표</li>
            <li><strong>소셜미디어:</strong> SNS 마케팅 효과</li>
          </ul>
          <p className="mt-2"><strong>전략적 활용:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>각 소스별 마케팅 전략 수립</li>
            <li>유입 소스별 전환율 분석</li>
            <li>투자 대비 효과 측정</li>
          </ul>
        </div>
      </div>
    )
  },

  keywordAnalysis: {
    title: "키워드 성과 분석",
    content: (
      <div>
        <p className="mb-2">웹사이트가 노출되는 검색 키워드의 성과를 분석합니다.</p>
        <div className="space-y-1 text-xs">
          <p><strong>주요 지표:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>순위:</strong> 검색 결과 위치 (낮을수록 좋음)</li>
            <li><strong>노출수:</strong> 검색 결과 노출 횟수</li>
            <li><strong>클릭수:</strong> 실제 클릭 횟수</li>
            <li><strong>CTR:</strong> 클릭률 (클릭수 ÷ 노출수)</li>
          </ul>
          <p className="mt-2"><strong>키워드 전략:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>고노출 저클릭: 제목/메타 설명 개선</li>
            <li>저노출 고클릭: 키워드 확장 기회</li>
            <li>순위 하락: 경쟁사 분석 및 콘텐츠 개선</li>
          </ul>
        </div>
      </div>
    )
  },

  pagePerformance: {
    title: "페이지별 성과",
    content: (
      <div>
        <p className="mb-2">웹사이트 내 각 페이지의 검색 성과를 분석합니다.</p>
        <div className="space-y-1 text-xs">
          <p><strong>분석 목적:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>인기 페이지 및 개선 필요 페이지 식별</li>
            <li>페이지별 SEO 최적화 우선순위 설정</li>
            <li>콘텐츠 전략 수립</li>
          </ul>
          <p className="mt-2"><strong>활용 방안:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>인기 페이지: 더 많은 키워드 타겟팅</li>
            <li>저성과 페이지: 콘텐츠 개선 또는 삭제</li>
            <li>신규 페이지: 순위 상승 모니터링</li>
          </ul>
        </div>
      </div>
    )
  },

  serpInsights: {
    title: "SERP 인사이트",
    content: (
      <div>
        <p className="mb-2">데이터 분석을 통해 자동 생성된 개선 제안사항입니다.</p>
        <div className="space-y-1 text-xs">
          <p><strong>인사이트 유형:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>🎉 긍정적:</strong> 성과 개선 사항</li>
            <li><strong>⚠️ 주의:</strong> 개선 필요 사항</li>
            <li><strong>📊 중립적:</strong> 참고 사항</li>
          </ul>
          <p className="mt-2"><strong>활용 방법:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>우선순위별 개선 계획 수립</li>
            <li>자동화된 성과 모니터링</li>
            <li>데이터 기반 의사결정</li>
          </ul>
        </div>
      </div>
    )
  },

  // 설정 및 필터 설명
  periodSettings: {
    title: "분석 기간 설정",
    content: (
      <div>
        <p className="mb-2">SERP 분석을 위한 기간을 설정할 수 있습니다.</p>
        <div className="space-y-1 text-xs">
          <p><strong>기간별 특징:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>7일:</strong> 단기 트렌드, 최근 변화 빠른 파악</li>
            <li><strong>30일:</strong> 월간 성과, 일반적인 성과 분석</li>
            <li><strong>90일:</strong> 장기 트렌드, 계절성 및 장기 패턴</li>
          </ul>
          <p className="mt-2"><strong>비교 분석:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>이전 기간과 비교하여 성장률 계산</li>
            <li>동일 기간 대비 성과 평가</li>
            <li>개선 효과 측정</li>
          </ul>
        </div>
      </div>
    )
  },

  googleAnalytics: {
    title: "Google Analytics 설정",
    content: (
      <div>
        <p className="mb-2">실제 Google Analytics 데이터를 연동하여 정확한 SERP 분석을 제공합니다.</p>
        <div className="space-y-1 text-xs">
          <p><strong>필요한 설정:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>GA4 Property ID</li>
            <li>OAuth Client ID & Secret</li>
            <li>Refresh Token</li>
          </ul>
          <p className="mt-2"><strong>장점:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>실시간 정확한 데이터</li>
            <li>자동 데이터 업데이트</li>
            <li>상세한 트래픽 분석</li>
          </ul>
        </div>
      </div>
    )
  }
}; 
 
 