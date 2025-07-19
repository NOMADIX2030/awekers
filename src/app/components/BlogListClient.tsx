"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TagFilterBar from "./TagFilterBar";

interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  tag: string;
  image: string;
  date: string;
}

// 사이트 이름을 props로 받도록 인터페이스 추가
interface BlogListClientProps {
  siteName?: string;
}

const BlogListClient: React.FC<BlogListClientProps> = ({ siteName = "블로그" }) => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .finally(() => setLoading(false));
  }, []);

  // 필터링된 블로그 리스트
  const filteredBlogs = selectedTag
    ? blogs.filter((b) => b.tag && b.tag.split(",").map(t => t.trim()).includes(selectedTag))
    : blogs;

  return (
    <section className="w-full max-w-3xl mx-auto py-16 px-4">
      {/* 사이트 이름을 h1에 출력 */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-tight">{siteName}</h1>
      {/* 태그 필터 바 */}
      <TagFilterBar selectedTag={selectedTag} onTagSelect={setSelectedTag} />
      {loading ? (
        <div className="text-center text-black/50 py-20">불러오는 중...</div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center text-black/50 py-20">해당 태그의 블로그가 없습니다.</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
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
                  <span>{blog.date?.slice(0, 10)}</span>
                </div>
                <h2 className="text-xl font-bold group-hover:underline transition-colors">{blog.title}</h2>
                <p className="text-sm text-black/70 line-clamp-2">{blog.summary}</p>
                <span className="mt-2 text-xs font-semibold text-black/60 group-hover:text-black">자세히 보기 →</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogListClient; 