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
}

const FilteredBlogList: React.FC<FilteredBlogListProps> = ({ blogs }) => {
  const [selectedTag, setSelectedTag] = useState("");

  // 필터링된 블로그 리스트
  const filteredBlogs = selectedTag
    ? blogs.filter((b) => b.tag && b.tag.split(",").map(t => t.trim()).includes(selectedTag))
    : blogs;

  return (
    <>
      {/* 태그 필터 바 */}
      <TagFilterBar selectedTag={selectedTag} onTagSelect={setSelectedTag} />
      
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
    </>
  );
};

export default FilteredBlogList; 