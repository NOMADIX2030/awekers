'use client';

import { useState } from 'react';
import { SEOAnalysisResult as SEOAnalysisResultType, CategoryResult } from '../types';
import { generateSEOReportPDF } from '../utils/pdfGenerator';

interface SEOAnalysisResultProps {
  data: SEOAnalysisResultType;
  onReset: () => void;
}

export function SEOAnalysisResult({ data, onReset }: SEOAnalysisResultProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'improvements' | 'technical'>('overview');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': case 'A-': return 'text-green-600';
      case 'B+': case 'B': case 'B-': return 'text-blue-600';
      case 'C+': case 'C': case 'C-': return 'text-yellow-600';
      case 'D+': case 'D': case 'D-': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getGradeBgColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': case 'A-': return 'bg-green-50 border-green-200';
      case 'B+': case 'B': case 'B-': return 'bg-blue-50 border-blue-200';
      case 'C+': case 'C': case 'C-': return 'bg-yellow-50 border-yellow-200';
      case 'D+': case 'D': case 'D-': return 'bg-orange-50 border-orange-200';
      case 'F': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // 통계 계산 (안전한 접근)
  const totalItems = data.categoryResults?.reduce((sum, cat) => sum + cat.checkResults.length, 0) || 0;
  const passedItems = data.categoryResults?.reduce((sum, cat) => sum + cat.checkResults.filter(r => r.passed).length, 0) || 0;
  const failedItems = totalItems - passedItems;
  const criticalIssues = data.improvements?.filter(imp => imp.priority === 'high').length || 0;

  // SEO 보고서 다운로드 함수
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const result = await generateSEOReportPDF(data);
      console.log('SEO 보고서 생성 완료:', result.filename);
    } catch (error) {
      console.error('SEO 보고서 생성 오류:', error);
      alert('SEO 보고서 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '종합 결과', icon: '📊' },
    { id: 'categories', label: '카테고리별', icon: '📋' },
    { id: 'improvements', label: '개선 제안', icon: '💡' },
    { id: 'technical', label: '기술 정보', icon: '⚙️' },
  ];

  return (
    <div className="max-w-7xl mx-auto">

      {/* 헤더 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex-1 mb-4 sm:mb-0">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-naver-green rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">분석 완료</h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              {data.url} • {new Date(data.analyzedAt).toLocaleString('ko-KR')}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onReset}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              새 검사
            </button>
            
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                isGeneratingPDF 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-naver-green hover:bg-green-600'
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  생성중...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  SEO 보고서 다운로드
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 점수 카드 */}
      <div className="mb-6">
        <div className={`bg-white rounded-2xl shadow-lg border p-8 text-center ${getGradeBgColor(data.grade)}`}>
          <div className="mb-6">
            <div className={`text-6xl sm:text-8xl font-bold mb-2 ${getGradeColor(data.grade)}`}>
              {data.grade}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {data.totalScore}점 / 100점
            </div>
            <div className="text-lg text-gray-600">
              전체 {data.totalScore}% 달성
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{passedItems}</div>
              <div className="text-sm text-gray-600">통과</div>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{failedItems}</div>
              <div className="text-sm text-gray-600">실패</div>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{data.improvements?.length || 0}</div>
              <div className="text-sm text-gray-600">개선사항</div>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
              <div className="text-sm text-gray-600">심각</div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-0 px-4 py-4 text-center border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-naver-green text-naver-green bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium text-sm sm:text-base">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.categoryResults?.map((categoryResult) => (
              <CategoryCard key={categoryResult.categoryId} categoryResult={categoryResult} />
            )) || []}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            {data.categoryResults?.map((categoryResult) => (
              <CategoryDetailCard key={categoryResult.categoryId} categoryResult={categoryResult} />
            )) || []}
          </div>
        )}

        {activeTab === 'improvements' && (
          <ImprovementsSection improvements={data.improvements || []} />
        )}

        {activeTab === 'technical' && (
          <TechnicalDetailsSection crawledData={data.crawledData} />
        )}
      </div>
    </div>
  );
}

// 카테고리 카드 컴포넌트
function CategoryCard({ categoryResult }: { categoryResult: CategoryResult }) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': case 'A-': return 'text-green-600';
      case 'B+': case 'B': case 'B-': return 'text-blue-600';
      case 'C+': case 'C': case 'C-': return 'text-yellow-600';
      case 'D+': case 'D': case 'D-': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const passedCount = categoryResult.checkResults.filter(r => r.passed).length;
  const totalCount = categoryResult.checkResults.length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {categoryResult.categoryId}
        </h3>
        <div className={`text-2xl font-bold ${getGradeColor(categoryResult.grade)}`}>
          {categoryResult.grade}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">점수</span>
          <span className="font-semibold">{categoryResult.score}/{categoryResult.maxScore}점</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-naver-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${categoryResult.percentage}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>통과: {passedCount}/{totalCount}</span>
        <span>{categoryResult.percentage}%</span>
      </div>
    </div>
  );
}

// 카테고리 상세 카드 컴포넌트
function CategoryDetailCard({ categoryResult }: { categoryResult: CategoryResult }) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': case 'A-': return 'text-green-600';
      case 'B+': case 'B': case 'B-': return 'text-blue-600';
      case 'C+': case 'C': case 'C-': return 'text-yellow-600';
      case 'D+': case 'D': case 'D-': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {categoryResult.categoryId}
          </h3>
          <p className="text-gray-600 text-sm">
            {categoryResult.score}/{categoryResult.maxScore}점 • {categoryResult.percentage}% 달성
          </p>
        </div>
        <div className={`text-3xl font-bold ${getGradeColor(categoryResult.grade)}`}>
          {categoryResult.grade}
        </div>
      </div>

      <div className="space-y-3">
        {categoryResult.checkResults.map((result) => (
          <div
            key={result.checkItemId}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              result.passed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                result.passed ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <span className="text-white text-xs">
                  {result.passed ? '✓' : '✗'}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {result.checkItemId}
                </div>
                <div className="text-xs text-gray-600">
                  {result.message}
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600">
              {result.score}/{result.maxScore}점
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 개선사항 섹션 컴포넌트
function ImprovementsSection({ improvements }: { improvements: any[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-4">
      {improvements.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            모든 검사를 통과했습니다!
          </h3>
          <p className="text-green-700">
            현재 페이지는 SEO 최적화가 잘 되어 있습니다.
          </p>
        </div>
      ) : (
        improvements.map((improvement, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <span className="text-2xl">{getPriorityIcon(improvement.priority)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {improvement.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(improvement.priority)}`}>
                    {improvement.priority === 'high' ? '높음' : improvement.priority === 'medium' ? '보통' : '낮음'}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">
                  {improvement.description}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">💡 해결 방법</h5>
                  <p className="text-blue-800 text-sm">
                    {improvement.solution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// 기술 정보 섹션 컴포넌트
function TechnicalDetailsSection({ crawledData }: { crawledData: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">페이지 정보</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">URL</span>
            <span className="font-mono text-sm text-gray-900 break-all">{crawledData.url}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">상태 코드</span>
            <span className="font-mono text-sm text-gray-900">{crawledData.statusCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">페이지 크기</span>
            <span className="font-mono text-sm text-gray-900">{Math.round(crawledData.size / 1024)} KB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">로딩 시간</span>
            <span className="font-mono text-sm text-gray-900">{crawledData.loadTime} ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">크롤링 시간</span>
            <span className="font-mono text-sm text-gray-900">{new Date(crawledData.crawledAt).toLocaleString('ko-KR')}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">서버 응답 헤더</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(crawledData.headers).map(([key, value]) => (
            <div key={key} className="text-xs">
              <span className="text-gray-600 font-medium">{key}:</span>
              <span className="ml-2 text-gray-900 font-mono break-all">{value as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 