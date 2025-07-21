"use client";
import React from "react";

interface BlogPageHeaderProps {
  siteName: string;
  totalPosts: number;
}

const BlogPageHeader: React.FC<BlogPageHeaderProps> = ({ siteName, totalPosts }) => {
  return (
    <div className="text-center mb-12">
      {/* 메인 타이틀 */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
        {siteName}
      </h1>
      
      {/* 서브 타이틀 */}
      <p className="text-lg md:text-xl text-black/70 mb-6 max-w-2xl mx-auto leading-relaxed">
        최신 IT/AI 트렌드와 기술 정보를 확인하세요
      </p>
      
      {/* 통계 정보 */}
      <div className="flex items-center justify-center gap-6 text-sm text-black/50">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="글">📝</span>
          <span>{totalPosts}개의 글</span>
        </div>
        <div className="flex items-center gap-2">
          <span role="img" aria-label="카테고리">🏷️</span>
          <span>다양한 카테고리</span>
        </div>
        <div className="flex items-center gap-2">
          <span role="img" aria-label="업데이트">🔄</span>
          <span>정기 업데이트</span>
        </div>
      </div>
      
      {/* 구분선 */}
      <div className="w-24 h-1 bg-black mx-auto mt-8 rounded-full"></div>
    </div>
  );
};

export default BlogPageHeader; 