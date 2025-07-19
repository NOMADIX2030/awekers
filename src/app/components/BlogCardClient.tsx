"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface Blog {
  id: number;
  title: string;
  summary: string;
  tag: string;
  image: string;
  date: Date;
  view: number;
}

interface BlogCardClientProps {
  blog: Blog;
}

const BlogCardClient: React.FC<BlogCardClientProps> = ({ blog }) => {
  const router = useRouter();

  return (
    <article
      className="group border border-black/10 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow p-0 flex flex-col gap-0 cursor-pointer hover:-translate-y-1 overflow-hidden"
      onClick={() => router.push(`/blog/${blog.id}`)}
      tabIndex={0}
      role="button"
      aria-label={blog.title + ' 상세보기'}
      onKeyDown={e => { if (e.key === 'Enter') router.push(`/blog/${blog.id}`); }}
    >
      {/* 카드 상단 이미지 */}
      <div className="w-full aspect-[16/9] bg-gray-100 overflow-hidden">
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title + ' 대표 이미지'}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs text-black/50 mb-1">
          <span className="font-semibold">{blog.tag}</span>
          <span>·</span>
          <span>{blog.date?.toISOString().slice(0, 10)}</span>
        </div>
        <h2 className="text-xl font-bold group-hover:underline transition-colors">{blog.title}</h2>
        <p className="text-sm text-black/70 line-clamp-2">{blog.summary}</p>
        <span className="mt-2 text-xs font-semibold text-black/60 group-hover:text-black">자세히 보기 →</span>
      </div>
    </article>
  );
};

export default BlogCardClient; 