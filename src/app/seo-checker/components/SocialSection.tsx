"use client";

import React from "react";

interface SocialSectionProps {
  data: {
    facebookOg: {
      exists: boolean;
      score: number;
      tags?: {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
      };
    };
    twitterCard: {
      exists: boolean;
      score: number;
      tags?: {
        card?: string;
        title?: string;
        description?: string;
        image?: string;
      };
    };
    socialLinks: {
      exists: boolean;
      score: number;
      platforms?: string[];
    };
  };
}

const SocialSection: React.FC<SocialSectionProps> = ({ data }) => {
  const getStatusIcon = (exists: boolean) => {
    return exists ? "✅" : "❌";
  };

  const getStatusColor = (exists: boolean) => {
    return exists ? "text-green-600" : "text-red-600";
  };

  const getStatusText = (exists: boolean) => {
    return exists ? "설정됨" : "설정 안됨";
  };

  return (
    <div className="space-y-4">
      {/* Facebook OG 태그 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">Facebook OG 태그</span>
            <p className="text-xs text-gray-600 mt-1">
              Facebook 공유 최적화
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.facebookOg.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.facebookOg.exists)}`}>
              {getStatusText(data.facebookOg.exists)}
            </div>
          </div>
        </div>
        
        {data.facebookOg.exists && data.facebookOg.tags && (
          <div className="text-xs text-gray-700 space-y-1">
            {data.facebookOg.tags.title && (
              <div>• Title: {data.facebookOg.tags.title}</div>
            )}
            {data.facebookOg.tags.description && (
              <div>• Description: {data.facebookOg.tags.description}</div>
            )}
            {data.facebookOg.tags.image && (
              <div>• Image: {data.facebookOg.tags.image}</div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-600">
            {data.facebookOg.exists 
              ? "Facebook 공유 시 최적화된 미리보기가 표시됩니다."
              : "Facebook 공유 시 기본 정보만 표시됩니다."
            }
          </div>
          <span className="text-sm font-bold text-gray-700">{data.facebookOg.score}점</span>
        </div>
      </div>

      {/* Twitter Card */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">Twitter Card</span>
            <p className="text-xs text-gray-600 mt-1">
              Twitter 공유 최적화
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.twitterCard.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.twitterCard.exists)}`}>
              {getStatusText(data.twitterCard.exists)}
            </div>
          </div>
        </div>
        
        {data.twitterCard.exists && data.twitterCard.tags && (
          <div className="text-xs text-gray-700 space-y-1">
            {data.twitterCard.tags.card && (
              <div>• Card Type: {data.twitterCard.tags.card}</div>
            )}
            {data.twitterCard.tags.title && (
              <div>• Title: {data.twitterCard.tags.title}</div>
            )}
            {data.twitterCard.tags.description && (
              <div>• Description: {data.twitterCard.tags.description}</div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-600">
            {data.twitterCard.exists 
              ? "Twitter 공유 시 카드 형태로 표시됩니다."
              : "Twitter 공유 시 기본 링크로 표시됩니다."
            }
          </div>
          <span className="text-sm font-bold text-gray-700">{data.twitterCard.score}점</span>
        </div>
      </div>

      {/* 소셜 링크 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-gray-900">소셜 미디어 링크</span>
            <p className="text-xs text-gray-600 mt-1">
              소셜 미디어 플랫폼 연결
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{getStatusIcon(data.socialLinks.exists)}</div>
            <div className={`text-xs font-medium ${getStatusColor(data.socialLinks.exists)}`}>
              {data.socialLinks.platforms?.length || 0}개 플랫폼
            </div>
          </div>
        </div>
        
        {data.socialLinks.platforms && data.socialLinks.platforms.length > 0 && (
          <div className="text-xs text-gray-700 mb-2">
            <div className="font-medium mb-1">연결된 플랫폼:</div>
            <div className="flex flex-wrap gap-1">
              {data.socialLinks.platforms.map((platform, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            {data.socialLinks.exists 
              ? "소셜 미디어 플랫폼과 연결되어 있습니다."
              : "소셜 미디어 플랫폼과 연결되어 있지 않습니다."
            }
          </div>
          <span className="text-sm font-bold text-gray-700">{data.socialLinks.score}점</span>
        </div>
      </div>
    </div>
  );
};

export default SocialSection; 