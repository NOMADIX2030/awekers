import React from "react";
import TagFilterBar from "./TagFilterBar";
import BlogCardClient from "./BlogCardClient";
import FilteredBlogList from "./FilteredBlogList";

interface Blog {
  id: number;
  title: string;
  summary: string;
  tag: string;
  image: string;
  date: Date;
  view: number;
}

interface BlogListServerProps {
  siteName: string;
  blogs: Blog[];
}

const BlogListServer: React.FC<BlogListServerProps> = ({ siteName, blogs }) => {
  return (
    <section className="w-full max-w-3xl mx-auto py-16 px-4">
      {/* 사이트 이름을 h1에 출력 */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-tight">{siteName}</h1>
      
      {/* 태그 필터링을 위한 클라이언트 컴포넌트 */}
      <FilteredBlogList blogs={blogs} siteName={siteName} />
    </section>
  );
};

export default BlogListServer; 