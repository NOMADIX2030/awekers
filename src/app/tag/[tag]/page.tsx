"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  tag: string;
  image: string;
  date: string;
  view: number;
}

const TagPage: React.FC = () => {
  const params = useParams();
  const tag = params?.tag as string;
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tag) return;
    setLoading(true);
    setError("");
    console.log("태그 페이지 - 검색할 태그:", tag);
    console.log("태그 페이지 - 인코딩된 태그:", encodeURIComponent(tag));
    fetch(`/api/tag/${encodeURIComponent(tag)}`)
      .then(res => {
        if (!res.ok) throw new Error("해당 태그의 글을 불러오지 못했습니다.");
        return res.json();
      })
      .then(data => {
        console.log("태그 페이지 - 받은 데이터:", data);
        console.log("태그 페이지 - 블로그 수:", data.blogs?.length || 0);
        setBlogs(data.blogs || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [tag]);

  if (loading) return <div className="w-full max-w-3xl mx-auto py-16 px-4 text-center text-black/50">불러오는 중...</div>;
  if (error) return <div className="w-full max-w-3xl mx-auto py-16 px-4 text-center text-red-500">{error}</div>;

  return (
    <section className="w-full max-w-3xl mx-auto py-16 px-4 font-pretendard bg-white min-h-screen">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight text-black text-center"># {decodeURIComponent(tag)}</h1>
      {blogs.length === 0 ? (
        <div className="text-black/50 text-center">해당 태그의 글이 없습니다.</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group border border-black/10 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow p-0 flex flex-col gap-0 cursor-pointer hover:-translate-y-1 overflow-hidden"
              onClick={() => window.location.href = `/blog/${blog.id}`}
              tabIndex={0}
              role="button"
              aria-label={blog.title + ' 상세보기'}
              onKeyDown={e => { if (e.key === 'Enter') window.location.href = `/blog/${blog.id}`; }}
            >
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

export default TagPage; 