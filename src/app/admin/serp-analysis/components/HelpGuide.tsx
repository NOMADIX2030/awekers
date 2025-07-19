"use client";
import React, { useState } from 'react';
import { SERPHelpContent } from '../data/helpContent';

const HelpGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpSections = [
    {
      title: "📊 주요 지표 이해하기",
      items: [
        { key: 'totalVisits', label: '총 방문자' },
        { key: 'organicTraffic', label: '유기적 트래픽' },
        { key: 'avgCTR', label: '평균 CTR' },
        { key: 'avgPosition', label: '평균 순위' }
      ]
    },
    {
      title: "📈 차트 및 분석",
      items: [
        { key: 'trafficTrend', label: '트래픽 추이 차트' },
        { key: 'trafficSources', label: '유입 소스 분포' },
        { key: 'keywordAnalysis', label: '키워드 성과 분석' },
        { key: 'pagePerformance', label: '페이지별 성과' }
      ]
    },
    {
      title: "💡 인사이트 및 설정",
      items: [
        { key: 'serpInsights', label: 'SERP 인사이트' },
        { key: 'periodSettings', label: '분석 기간 설정' },
        { key: 'googleAnalytics', label: 'Google Analytics 설정' }
      ]
    }
  ];

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📚</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                SERP 분석 도움말
              </h3>
              <p className="text-sm text-gray-600">
                각 기능의 의미와 활용 방법을 알아보세요
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {isOpen ? '접기' : '도움말 보기'}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-6">
            {helpSections.map((section, sectionIndex) => (
              <div key={`section-${sectionIndex}-${section.title}`} className="border-t border-blue-200 pt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  {section.title}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={`${sectionIndex}-${item.key}-${itemIndex}`}
                      className="bg-white rounded-lg border border-blue-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <h5 className="font-medium text-gray-900 mb-2">
                        {item.label}
                      </h5>
                      <div className="text-sm text-gray-600 line-clamp-3">
                        {SERPHelpContent[item.key as keyof typeof SERPHelpContent]?.content && 
                          React.Children.toArray(SERPHelpContent[item.key as keyof typeof SERPHelpContent].content)[0]
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 실무 활용 팁 */}
            <div className="border-t border-blue-200 pt-4">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                🎯 실무 활용 팁
              </h4>
              <div className="bg-white rounded-lg border border-blue-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">📅 일일 모니터링</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• 주요 지표 체크</li>
                      <li>• 키워드 순위 확인</li>
                      <li>• 인사이트 확인</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">📊 주간 분석</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• 트렌드 패턴 파악</li>
                      <li>• 상승/하락 키워드</li>
                      <li>• 인기 콘텐츠 분석</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">📈 월간 리포트</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• 종합 성과 평가</li>
                      <li>• 경쟁사 분석</li>
                      <li>• 개선 계획 수립</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpGuide; 
 
 