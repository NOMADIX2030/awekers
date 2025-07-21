"use client";

import React from "react";

interface MetaDataSectionProps {
  data: {
    title: {
      exists: boolean;
      content?: string;
      length: number;
      score: number;
      maxLength: number;
    };
    description: {
      exists: boolean;
      content?: string;
      length: number;
      score: number;
      maxLength: number;
    };
    keywords: {
      exists: boolean;
      content?: string;
      score: number;
    };
  };
}

const MetaDataSection: React.FC<MetaDataSectionProps> = ({ data }) => {
  const getStatusIcon = (exists: boolean) => {
    return exists ? "✅" : "❌";
  };

  const getLengthColor = (length: number, maxLength: number) => {
    const ratio = length / maxLength;
    if (ratio >= 0.8 && ratio <= 1.2) return "text-green-600";
    if (ratio >= 0.6 && ratio <= 1.4) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">Title</span>
          <span className="text-sm">{getStatusIcon(data.title.exists)}</span>
        </div>
        {data.title.exists && data.title.content && (
          <>
            <p className="text-sm text-gray-700 mb-2 line-clamp-2">
              "{data.title.content}"
            </p>
            <div className="flex justify-between text-xs">
              <span className={getLengthColor(data.title.length, data.title.maxLength)}>
                {data.title.length} / {data.title.maxLength} 글자
              </span>
              <span className="text-gray-500">{data.title.score}점</span>
            </div>
          </>
        )}
      </div>

      {/* Description */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">Description</span>
          <span className="text-sm">{getStatusIcon(data.description.exists)}</span>
        </div>
        {data.description.exists && data.description.content && (
          <>
            <p className="text-sm text-gray-700 mb-2 line-clamp-3">
              "{data.description.content}"
            </p>
            <div className="flex justify-between text-xs">
              <span className={getLengthColor(data.description.length, data.description.maxLength)}>
                {data.description.length} / {data.description.maxLength} 글자
              </span>
              <span className="text-gray-500">{data.description.score}점</span>
            </div>
          </>
        )}
      </div>

      {/* Keywords */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">Keywords</span>
          <span className="text-sm">{getStatusIcon(data.keywords.exists)}</span>
        </div>
        {data.keywords.exists && data.keywords.content && (
          <>
            <p className="text-sm text-gray-700 mb-2">
              {data.keywords.content}
            </p>
            <div className="text-right text-xs">
              <span className="text-gray-500">{data.keywords.score}점</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MetaDataSection; 