"use client";
// src/app/admin/components/BlogViewsChart.tsx - 블로그 조회수 차트 컴포넌트
import React, { useState, useEffect } from "react";
import './styles.css';

interface BlogViewsData {
  title: string;
  views: number;
  date: string;
}

const BlogViewsChart: React.FC = () => {
  const [blogViews, setBlogViews] = useState<BlogViewsData[]>([]);

  useEffect(() => {
    const fetchBlogViews = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': 'Bearer admin-token'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.recentPosts) {
            setBlogViews(data.recentPosts.map((post: { title: string; views?: number; date: string }) => ({
              title: post.title,
              views: post.views || 0,
              date: post.date
            })));
          }
        }
      } catch (error) {
        console.error('블로그 조회수 데이터 로드 오류:', error);
        // 에러 시 기본 데이터 사용
        setBlogViews([
          { title: "Next.js 14의 새로운 기능들", views: 1234, date: "2024-01-15" },
          { title: "React Server Components 완벽 가이드", views: 987, date: "2024-01-14" },
          { title: "TypeScript 베스트 프랙티스", views: 756, date: "2024-01-13" },
          { title: "Tailwind CSS 활용 팁", views: 654, date: "2024-01-12" },
          { title: "Node.js 성능 최적화", views: 543, date: "2024-01-11" },
          { title: "Docker 컨테이너 관리", views: 432, date: "2024-01-10" },
          { title: "Git 워크플로우 가이드", views: 321, date: "2024-01-09" }
        ]);
      }
    };

    fetchBlogViews();
  }, []);

  // 최대 조회수를 기준으로 퍼센트 계산
  const maxViews = Math.max(...blogViews.map(blog => blog.views));

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">블로그 조회수 현황</h3>
        <p className="text-sm text-gray-600 mt-1">최근 게시글별 조회수 통계</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {blogViews.map((blog, index) => {
            const percentage = (blog.views / maxViews) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-gray-500">{blog.date}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900 ml-4">
                    {blog.views.toLocaleString()}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full blog-views-progress"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 요약 통계 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {blogViews.reduce((sum, blog) => sum + blog.views, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">총 조회수</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {Math.round(blogViews.reduce((sum, blog) => sum + blog.views, 0) / blogViews.length).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">평균 조회수</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {blogViews.length}
              </div>
              <div className="text-xs text-gray-600">게시글 수</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogViewsChart; 
 
 