'use client';

import React from 'react';
import { SEOAnalysisData } from '../types';

interface StructuredDataSectionProps {
  data: SEOAnalysisData['structuredData'];
}

export default function StructuredDataSection({ data }: StructuredDataSectionProps) {
  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">🏷️</span>
        구조화된 데이터
        <span className={`ml-auto text-lg font-bold ${getScoreColor(data.score)}`}>
          {data.score}점
        </span>
      </h3>

      <div className="space-y-4">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${getScoreBgColor(data.score)}`}>
            <h4 className="font-medium mb-2">구조화된 데이터 존재</h4>
            <p className="text-sm">
              {data.exists ? '✅ 구조화된 데이터가 발견되었습니다.' : '❌ 구조화된 데이터가 없습니다.'}
            </p>
          </div>

          {data.types && data.types.length > 0 && (
            <div className="p-4 rounded-lg bg-blue-50">
              <h4 className="font-medium mb-2">발견된 스키마 타입</h4>
              <div className="flex flex-wrap gap-2">
                {data.types.map((type, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 품질 분석 */}
        {data.quality && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">품질 분석</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className={`text-2xl font-bold ${getScoreColor(data.quality.score)}`}>
                  {data.quality.score}점
                </div>
                <div className="text-sm text-gray-600">전체 품질</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className={`text-2xl font-bold ${getScoreColor(data.quality.completeness)}`}>
                  {data.quality.completeness}점
                </div>
                <div className="text-sm text-gray-600">완성도</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className={`text-2xl font-bold ${getScoreColor(data.quality.validity)}`}>
                  {data.quality.validity}점
                </div>
                <div className="text-sm text-gray-600">유효성</div>
              </div>
            </div>
          </div>
        )}

        {/* SEO 최적화 */}
        {data.seoOptimization && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">SEO 최적화</h4>
            <div className="space-y-3">
              {/* 리치 스니펫 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">리치 스니펫 지원</div>
                  <div className="text-sm text-gray-600">
                    {data.seoOptimization.richSnippets.supported 
                      ? `지원됨 (${data.seoOptimization.richSnippets.types.join(', ')})`
                      : '지원되지 않음'
                    }
                  </div>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(data.seoOptimization.richSnippets.score)}`}>
                  {data.seoOptimization.richSnippets.score}점
                </div>
              </div>

              {/* 소셜 미디어 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">소셜 미디어 연동</div>
                  <div className="text-sm text-gray-600">
                    {data.seoOptimization.socialMedia.integrated 
                      ? `연동됨 (${data.seoOptimization.socialMedia.types.join(', ')})`
                      : '연동되지 않음'
                    }
                  </div>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(data.seoOptimization.socialMedia.score)}`}>
                  {data.seoOptimization.socialMedia.score}점
                </div>
              </div>

              {/* 로컬 비즈니스 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">로컬 비즈니스 스키마</div>
                  <div className="text-sm text-gray-600">
                    {data.seoOptimization.localBusiness.exists 
                      ? `존재함 (${data.seoOptimization.localBusiness.types.join(', ')})`
                      : '존재하지 않음'
                    }
                  </div>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(data.seoOptimization.localBusiness.score)}`}>
                  {data.seoOptimization.localBusiness.score}점
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 오류 및 경고 */}
        {(data.errors && data.errors.length > 0) || (data.warnings && data.warnings.length > 0) || !data.exists ? (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">발견된 문제점</h4>
            
            {/* 구조화된 데이터가 없는 경우 */}
            {!data.exists && (
              <div className="mb-3">
                <h5 className="text-red-600 font-medium mb-2">❌ 구조화된 데이터 누락</h5>
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  <p className="mb-2">구조화된 데이터가 발견되지 않았습니다.</p>
                  <p className="text-xs text-red-500">
                    • 검색 엔진이 페이지 내용을 이해하기 어려움<br/>
                    • 리치 스니펫 표시 불가<br/>
                    • 검색 결과에서의 시각적 어필 부족
                  </p>
                </div>
              </div>
            )}
            
            {data.errors && data.errors.length > 0 && (
              <div className="mb-3">
                <h5 className="text-red-600 font-medium mb-2">❌ 오류 ({data.errors.length}개)</h5>
                <ul className="space-y-1">
                  {data.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.warnings && data.warnings.length > 0 && (
              <div>
                <h5 className="text-yellow-600 font-medium mb-2">⚠️ 경고 ({data.warnings.length}개)</h5>
                <ul className="space-y-1">
                  {data.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="border-t pt-4">
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-green-600 font-medium">✅ 문제점이 발견되지 않았습니다</div>
              <div className="text-sm text-green-600 mt-1">구조화된 데이터가 올바르게 구현되어 있습니다.</div>
            </div>
          </div>
        )}

        {/* 상세 스키마 정보 */}
        {data.detailedSchemas && data.detailedSchemas.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">상세 스키마 분석</h4>
            <div className="space-y-3">
              {data.detailedSchemas.map((schema, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium text-blue-600">{schema.type}</div>
                  {schema.analysis && (
                    <div className="mt-2 text-sm">
                      {schema.analysis.errors && schema.analysis.errors.length > 0 && (
                        <div className="text-red-600">
                          오류: {schema.analysis.errors.join(', ')}
                        </div>
                      )}
                      {schema.analysis.warnings && schema.analysis.warnings.length > 0 && (
                        <div className="text-yellow-600">
                          경고: {schema.analysis.warnings.join(', ')}
                        </div>
                      )}
                      {(!schema.analysis.errors || schema.analysis.errors.length === 0) &&
                       (!schema.analysis.warnings || schema.analysis.warnings.length === 0) && (
                        <div className="text-green-600">✅ 문제없음</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 