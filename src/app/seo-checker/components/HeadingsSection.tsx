"use client";

import React from "react";

interface HeadingsSectionProps {
  data: {
    h1: {
      count: number;
      score: number;
      content?: string[];
    };
    h2: {
      count: number;
      score: number;
      content?: string[];
    };
    h3: {
      count: number;
      score: number;
      content?: string[];
    };
  };
}

const HeadingsSection: React.FC<HeadingsSectionProps> = ({ data }) => {
  const getHeadingStatus = (count: number, type: string) => {
    if (type === 'h1') {
      if (count === 1) return { icon: "✅", color: "text-green-600", text: "적절" };
      if (count === 0) return { icon: "❌", color: "text-red-600", text: "없음" };
      return { icon: "⚠️", color: "text-yellow-600", text: "중복" };
    }
    
    if (count >= 2) return { icon: "✅", color: "text-green-600", text: "적절" };
    if (count === 1) return { icon: "⚠️", color: "text-yellow-600", text: "부족" };
    return { icon: "❌", color: "text-red-600", text: "없음" };
  };

  return (
    <div className="space-y-4">
      {/* H1 */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">H1 태그</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{getHeadingStatus(data.h1.count, 'h1').icon}</span>
            <span className={`text-xs font-medium ${getHeadingStatus(data.h1.count, 'h1').color}`}>
              {getHeadingStatus(data.h1.count, 'h1').text}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-600">{data.h1.count}개</span>
          <span className="text-gray-500">{data.h1.score}점</span>
        </div>
        {data.h1.content && data.h1.content.length > 0 && (
          <div className="text-xs text-gray-700 space-y-1">
            {data.h1.content.slice(0, 3).map((content, index) => (
              <div key={index} className="line-clamp-1">• {content}</div>
            ))}
            {data.h1.content.length > 3 && (
              <div className="text-gray-500">... 외 {data.h1.content.length - 3}개</div>
            )}
          </div>
        )}
      </div>

      {/* H2 */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">H2 태그</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{getHeadingStatus(data.h2.count, 'h2').icon}</span>
            <span className={`text-xs font-medium ${getHeadingStatus(data.h2.count, 'h2').color}`}>
              {getHeadingStatus(data.h2.count, 'h2').text}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-600">{data.h2.count}개</span>
          <span className="text-gray-500">{data.h2.score}점</span>
        </div>
        {data.h2.content && data.h2.content.length > 0 && (
          <div className="text-xs text-gray-700 space-y-1">
            {data.h2.content.slice(0, 2).map((content, index) => (
              <div key={index} className="line-clamp-1">• {content}</div>
            ))}
            {data.h2.content.length > 2 && (
              <div className="text-gray-500">... 외 {data.h2.content.length - 2}개</div>
            )}
          </div>
        )}
      </div>

      {/* H3 */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">H3 태그</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{getHeadingStatus(data.h3.count, 'h3').icon}</span>
            <span className={`text-xs font-medium ${getHeadingStatus(data.h3.count, 'h3').color}`}>
              {getHeadingStatus(data.h3.count, 'h3').text}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-600">{data.h3.count}개</span>
          <span className="text-gray-500">{data.h3.score}점</span>
        </div>
        {data.h3.content && data.h3.content.length > 0 && (
          <div className="text-xs text-gray-700 space-y-1">
            {data.h3.content.slice(0, 2).map((content, index) => (
              <div key={index} className="line-clamp-1">• {content}</div>
            ))}
            {data.h3.content.length > 2 && (
              <div className="text-gray-500">... 외 {data.h3.content.length - 2}개</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadingsSection; 