"use client";
import React, { useState } from "react";
import TagFilterBar from "./TagFilterBar";
import BlogCardClient from "./BlogCardClient";

interface Blog {
  id: number;
  title: string;
  summary: string;
  tag: string;
  image: string;
  date: Date;
  view: number;
}

interface FilteredBlogListProps {
  blogs: Blog[];
  siteName: string;
}

const FilteredBlogList: React.FC<FilteredBlogListProps> = ({ blogs, siteName }) => {
  const [selectedTag, setSelectedTag] = useState("");

  // 필터링된 블로그 리스트
  const filteredBlogs = selectedTag
    ? blogs.filter((b) => b.tag && b.tag.split(",").map(t => t.trim()).includes(selectedTag))
    : blogs;

  // 블로그에서 고유한 태그들을 추출
  const allTags = blogs.reduce((tags: string[], blog) => {
    if (blog.tag) {
      const blogTags = blog.tag.split(',').map(t => t.trim());
      blogTags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, []);

  return (
    <section className="w-full max-w-3xl mx-auto py-16 px-4">
      {/* 사이트 이름을 h1에 출력 */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-tight">{siteName}</h1>
      
      {/* 태그 필터 바 */}
      <TagFilterBar 
        selectedTag={selectedTag} 
        onTagSelect={setSelectedTag} 
        customTags={allTags}
      />
      
      {filteredBlogs.length === 0 ? (
        <div className="text-center text-black/50 py-20">
          {selectedTag ? "해당 태그의 블로그가 없습니다." : "블로그 글이 없습니다."}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filteredBlogs.map((blog) => (
            <BlogCardClient key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FilteredBlogList; 