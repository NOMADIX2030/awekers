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

interface BlogCardEnhancedProps {
  blog: Blog;
}

const BlogCardEnhanced: React.FC<BlogCardEnhancedProps> = ({ blog }) => {
  const router = useRouter();

  // 조회수 포맷팅
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "오늘";
    if (diffDays <= 7) return `${diffDays}일 전`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}주 전`;
    
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <article
      className="group border border-black/10 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 p-0 flex flex-col gap-0 cursor-pointer hover:-translate-y-2 overflow-hidden"
      onClick={() => router.push(`/blog/${blog.id}`)}
      tabIndex={0}
      role="button"
      aria-label={blog.title + ' 상세보기'}
      onKeyDown={e => { if (e.key === 'Enter') router.push(`/blog/${blog.id}`); }}
    >
      {/* 카드 상단 이미지 */}
      <div className="w-full aspect-[16/9] bg-gray-100 overflow-hidden relative">
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title + ' 대표 이미지'}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 rounded-t-2xl"
            loading="lazy"
          />
        )}
        
        {/* 오버레이 효과 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-t-2xl"></div>
        
        {/* 태그 배지 */}
        {blog.tag && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded-lg backdrop-blur-sm">
              {blog.tag.split(',')[0].trim()}
            </span>
          </div>
        )}
        
        {/* 조회수 배지 */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-white/90 text-black text-xs font-semibold rounded-lg backdrop-blur-sm flex items-center gap-1">
            <span role="img" aria-label="조회수">👁️</span>
            {formatViews(blog.view || 0)}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col gap-4">
        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-xs text-black/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{blog.tag?.split(',')[0].trim()}</span>
            <span>·</span>
            <span>{formatDate(blog.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span role="img" aria-label="조회수">👁️</span>
            <span>{formatViews(blog.view || 0)}</span>
          </div>
        </div>
        
        {/* 제목 */}
        <h2 className="text-xl font-bold group-hover:text-black transition-colors line-clamp-2 leading-tight">
          {blog.title}
        </h2>
        
        {/* 요약 */}
        <p className="text-sm text-black/70 line-clamp-3 leading-relaxed">
          {blog.summary}
        </p>
        
        {/* CTA 버튼 */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-black/60 group-hover:text-black transition-colors">
            자세히 보기 →
          </span>
          
          {/* 읽기 시간 추정 */}
          <span className="text-xs text-black/40">
            {Math.ceil(blog.summary.length / 200)}분 읽기
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCardEnhanced; 