"use client";
import React from "react";

interface TagFilterBarProps {
  onTagSelect: (tag: string) => void;
  selectedTag: string;
}

const TagFilterBar: React.FC<TagFilterBarProps> = ({ onTagSelect, selectedTag }) => {
  // 정적 태그 목록 (성능 최적화)
  const staticTags = ["SEO", "백링크", "검색엔진최적화", "구글SEO", "네이버"];

  return (
    <div className="w-full flex flex-col gap-6 mb-6">
      {/* 인기 태그 */}
      <div>
        <div className="font-bold text-base mb-3 text-black flex items-center gap-2">
          <span role="img" aria-label="인기">🔥</span> 인기 태그
        </div>
        <div className="flex flex-wrap gap-2 justify-start py-2">
          {staticTags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-black transition text-base font-semibold hover:text-white border border-transparent ${selectedTag === tag ? 'bg-black text-white border-black' : 'text-black'}`}
              onClick={() => onTagSelect(tag)}
            >
              <span className="text-black font-bold">#</span>
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>
      {/* 최신 태그 */}
      <div>
        <div className="font-bold text-base mb-3 text-black flex items-center gap-2">
          <span role="img" aria-label="최신">🆕</span> 최신 태그
        </div>
        <div className="flex flex-wrap gap-2 justify-start py-2">
          {staticTags.slice(3, 5).map((tag) => (
            <button
              key={tag}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-black transition text-base font-semibold hover:text-white border border-transparent ${selectedTag === tag ? 'bg-black text-white border-black' : 'text-black'}`}
              onClick={() => onTagSelect(tag)}
            >
              <span className="text-black font-bold">#</span>
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>
      {/* 전체 해제 버튼 */}
      <div className="mt-2 text-center">
        <button className={`px-4 py-2 rounded-full text-sm font-semibold border bg-white text-black border-black hover:bg-gray-100 transition-all ${!selectedTag ? "ring-2 ring-black" : ""}`}
          onClick={() => onTagSelect("")}>
          전체 보기
        </button>
      </div>
    </div>
  );
};

export default TagFilterBar; 