"use client";
import React from 'react';

interface KeywordData {
  keyword: string;
  position: number;
  impressions: number;
  clicks: number;
  ctr: number;
  change: number;
}

interface KeywordAnalysisProps {
  data?: KeywordData[];
}

const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        키워드 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              키워드
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              순위
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
              변화
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((keyword, index) => (
            <tr key={keyword.keyword} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {keyword.keyword}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {(keyword.position || 0).toFixed(1)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {(keyword.impressions || 0).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {(keyword.clicks || 0).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {(keyword.ctr || 0).toFixed(2)}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${
                  keyword.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {keyword.change >= 0 ? '↗' : '↘'} {Math.abs(keyword.change)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeywordAnalysis; 
 
 