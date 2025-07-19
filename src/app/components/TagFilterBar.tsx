"use client";
import React, { useEffect, useState } from "react";

interface TagFilterBarProps {
  onTagSelect: (tag: string) => void;
  selectedTag: string;
}

const TagFilterBar: React.FC<TagFilterBarProps> = ({ onTagSelect, selectedTag }) => {
  const [latestTags, setLatestTags] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      try {
        const res = await fetch("/api/tag-stats");
        const data = await res.json();
        setLatestTags(data.latestTags || []);
        setPopularTags(data.popularTags || []);
      } catch {}
      setLoading(false);
    }
    fetchTags();
  }, []);

  // 태그 빈도 계산 함수 (태그별 count)
  function getTagCounts(tags: string[]) {
    const counts: Record<string, number> = {};
    tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }

  // 인기/최신 태그 카운트 및 상위 5개만
  const popularTagCounts = getTagCounts(popularTags);
  const latestTagCounts = getTagCounts(latestTags);
  const topPopularTags = Object.entries(popularTagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  const topLatestTags = Object.entries(latestTagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="w-full flex flex-col gap-6 mb-6">
      {/* 인기 태그 */}
      <div>
        <div className="font-bold text-base mb-3 text-black flex items-center gap-2">
          <span role="img" aria-label="인기">🔥</span> 인기 태그
        </div>
        <div className="flex flex-wrap gap-2 justify-start py-2">
          {loading ? <span className="text-gray-400">로딩중...</span> :
            topPopularTags.length === 0 ? <span className="text-gray-400">없음</span> :
            topPopularTags.map(([tag, count]) => (
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
          {loading ? <span className="text-gray-400">로딩중...</span> :
            topLatestTags.length === 0 ? <span className="text-gray-400">없음</span> :
            topLatestTags.map(([tag, count]) => (
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