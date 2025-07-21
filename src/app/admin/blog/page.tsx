"use client";
// src/app/admin/blog/page.tsx - 게시글 관리 페이지
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "../components/AdminLayout";
import AdminCard from "../components/AdminCard";

interface Blog {
  id: number;
  title: string;
  summary: string;
  tag: string;
  date: string;
  view: number;
}

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // 게시글 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBlogs(blogs.filter(b => b.id !== id));
    } else {
      alert('삭제 실패');
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/admin/blog', {
          headers: {
            'Authorization': 'Bearer admin-key',
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setBlogs(result.data.blogs || []);
          } else {
            console.error('API 오류:', result.message);
            setBlogs([]);
          }
        } else {
          console.error('HTTP 오류:', response.status, response.statusText);
          setBlogs([]);
        }
      } catch (error) {
        console.error('게시글 로드 오류:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <AdminLayout 
        title="게시글 관리" 
        description="블로그 게시글을 관리합니다."
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="게시글 관리" 
      description="블로그 게시글을 관리합니다."
    >
      {/* 액션 버튼 */}
      <div className="mb-6 flex justify-between items-center">
        <div></div>
        <Link 
          href="/blog/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          새 게시글 작성
        </Link>
      </div>

      {/* 게시글 목록 */}
      <AdminCard>
        <div className="divide-y divide-gray-100">
          {Array.isArray(blogs) && blogs.map((blog) => (
            <div key={blog.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    <Link href={`/blog/${blog.id}`} className="hover:text-blue-600">
                      {blog.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{blog.summary}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📅 {new Date(blog.date).toLocaleDateString('ko-KR')}</span>
                    <span>🏷️ {blog.tag}</span>
                    <span>👁️ {blog.view} 조회</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Link 
                    href={`/blog/${blog.id}/edit`}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    수정
                  </Link>
                  <button 
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={() => handleDelete(blog.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* 뒤로가기 버튼 */}
      <div className="mt-6">
        <Link 
          href="/admin/dashboard"
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← 대시보드로 돌아가기
        </Link>
      </div>
    </AdminLayout>
  );
};

export default BlogManagement; 
 
 