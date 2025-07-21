"use client";
import React, { useState, useMemo } from "react";
import TagFilterBar from "./TagFilterBar";
import BlogCardEnhanced from "./BlogCardEnhanced";
import BlogPageHeader from "./BlogPageHeader";

interface Blog {
  id: number;
  title: string;
  summary: string;
  tag: string;
  image: string;
  date: Date;
  view: number;
}

interface BlogPageListProps {
  siteName: string;
  blogs: Blog[];
}

const BlogPageList: React.FC<BlogPageListProps> = ({ siteName, blogs }) => {
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "view">("date");

  // 정렬 및 필터링된 블로그 리스트
  const filteredAndSortedBlogs = useMemo(() => {
    let filtered = selectedTag
      ? blogs.filter((b) => b.tag && b.tag.split(",").map(t => t.trim()).includes(selectedTag))
      : blogs;

    // 정렬
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return (b.view || 0) - (a.view || 0);
      }
    });

    return filtered;
  }, [blogs, selectedTag, sortBy]);

  // 모든 태그 추출
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogs.forEach(blog => {
      if (blog.tag) {
        blog.tag.split(",").forEach(tag => {
          tags.add(tag.trim());
        });
      }
    });
    return Array.from(tags).slice(0, 10); // 상위 10개 태그만
  }, [blogs]);

  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-4">
      {/* 블로그 페이지 헤더 */}
      <BlogPageHeader siteName={siteName} totalPosts={blogs.length} />
      
      {/* 정렬 옵션 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-black/70">정렬:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("date")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                sortBy === "date"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy("view")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                sortBy === "view"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              인기순
            </button>
          </div>
        </div>
        
        {/* 결과 수 표시 */}
        <div className="text-sm text-black/50">
          {filteredAndSortedBlogs.length}개의 글
          {selectedTag && ` (${selectedTag} 태그)`}
        </div>
      </div>

      {/* 태그 필터 바 */}
      <TagFilterBar 
        selectedTag={selectedTag} 
        onTagSelect={setSelectedTag}
        customTags={allTags}
      />
      
      {/* 블로그 리스트 */}
      {filteredAndSortedBlogs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-black/70 mb-2">
            {selectedTag ? "해당 태그의 블로그가 없습니다." : "블로그 글이 없습니다."}
          </h3>
          <p className="text-black/50">
            {selectedTag ? "다른 태그를 선택해보세요." : "곧 새로운 글이 업데이트될 예정입니다."}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedBlogs.map((blog) => (
            <BlogCardEnhanced key={blog.id} blog={blog} />
          ))}
        </div>
      )}
      
      {/* 하단 CTA */}
      {filteredAndSortedBlogs.length > 0 && (
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-black/60 mb-4">더 많은 기술 정보를 원하시나요?</p>
          <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/80 transition-all">
            구독하기
          </button>
        </div>
      )}
    </section>
  );
};

export default BlogPageList; 