"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Blog } from '@/types/blog';
import { Comment } from '@/types/comment';
import { CommentSection } from '@/components/comments';
import TableOfContents from '@/components/TableOfContents';
import ContentSummary from '@/components/ContentSummary';
import FloatingTOC from '@/components/FloatingTOC';
import MobileTOCButton from '@/components/MobileTOCButton';

interface BlogDetailClientProps {
  blog: Blog;
  comments: Comment[];
  isAdmin: boolean;
  summaryData?: {
    summary: string[];
    readingTime: number;
    wordCount: number;
  };
  tocData?: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}

export default function BlogDetailClient({ blog, comments, isAdmin, summaryData, tocData }: BlogDetailClientProps) {
  // 세션 체크는 isAdmin prop으로 대체
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(blog.content);
  const [isSaving, setIsSaving] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hasLoadedRef = useRef(false);
  const viewTrackedRef = useRef(false);

  // 모바일 감지 및 초기 아이템 수 설정
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    const debouncedCheck = debounce(checkMobile, 250);
    window.addEventListener('resize', debouncedCheck);
    
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);

  // 안전한 조회수 증가 로직
  useEffect(() => {
    const trackView = async () => {
      // 이미 추적했으면 중복 실행 방지
      if (viewTrackedRef.current) return;
      
      try {
        // 1. 세션 스토리지로 중복 방문 체크
        const viewKey = `blog_view_${blog.id}`;
        const hasViewed = sessionStorage.getItem(viewKey);
        
        if (hasViewed) {
          console.log('이미 이 세션에서 조회한 블로그입니다.');
          return;
        }

        // 2. 봇/크롤러 감지 (User-Agent 체크)
        const userAgent = navigator.userAgent.toLowerCase();
        const isBot = /bot|crawler|spider|crawling|googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|slackbot|vkshare|w3c_validator/i.test(userAgent);
        
        if (isBot) {
          console.log('봇/크롤러 감지, 조회수 증가하지 않음');
          return;
        }

        // 3. 실제 조회수 증가 API 호출
        const response = await fetch(`/api/blog/${blog.id}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // 4. 성공 시 세션 스토리지에 기록
          sessionStorage.setItem(viewKey, 'true');
          viewTrackedRef.current = true;
          console.log('조회수 증가 완료');
        } else {
          console.error('조회수 증가 실패:', response.status);
        }
      } catch (error) {
        console.error('조회수 추적 중 오류:', error);
      }
    };

    // 페이지 로딩 완료 후 약간의 지연을 두고 실행 (실제 방문자 확인)
    const timer = setTimeout(trackView, 2000);
    
    return () => clearTimeout(timer);
  }, [blog.id]);

  // 디바운스 함수
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // 태그를 배열로 변환
  const tags = blog.tag ? blog.tag.split(',').map(tag => tag.trim()) : [];

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 관리자 편집 기능
  const handleSave = async () => {
    if (!isAdmin) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/blog/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        // 페이지 새로고침으로 업데이트된 내용 반영
        window.location.reload();
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const initialItemCount = isMobile ? 6 : 8;

  return (
    <div className="min-h-screen bg-white relative">
      {/* 플로팅 목차 */}
      <FloatingTOC content={blog.content} />
      {/* 모바일 목차 버튼 */}
      <MobileTOCButton content={blog.content} />
      {/* Hero Section */}
      <section className="relative py-2 md:py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  홈
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/blog" className="hover:text-blue-600 transition-colors">
                  블로그
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium">{blog.title}</span>
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <div className="mb-6">
            {/* Category Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              SEO 최적화
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {formatDate(blog.date)}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {blog.view}회 조회
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r-lg mb-6">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {blog.summary}
              </p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tag/${tag}`}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-blue-100 hover:text-blue-800 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Featured Image */}
            {blog.image && (
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-2 md:py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 목차와 요약 섹션 */}
          <div className="mb-3">
            <ContentSummary 
              content={blog.content} 
              title={blog.title} 
              summaryData={summaryData}
            />
            <TableOfContents 
              content={blog.content} 
              tocData={tocData}
            />
          </div>
          
          <article className="prose prose-lg md:prose-xl max-w-none">
            {isEditing ? (
              <div className="space-y-6">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="마크다운 형식으로 내용을 작성하세요..."
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown
                  components={{
                    h1: ({ children, ...props }) => {
                      const id = `heading-${props.node?.position?.start.line || 0}`;
                      return (
                        <h1 id={id} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0 scroll-mt-20">
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const id = `heading-${props.node?.position?.start.line || 0}`;
                      return (
                        <h2 id={id} className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 mt-6 scroll-mt-20">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const id = `heading-${props.node?.position?.start.line || 0}`;
                      return (
                        <h3 id={id} className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 mt-5 scroll-mt-20">
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children, ...props }) => {
                      const id = `heading-${props.node?.position?.start.line || 0}`;
                      return (
                        <h4 id={id} className="text-lg sm:text-xl font-bold text-gray-900 mb-2 mt-4 scroll-mt-20">
                          {children}
                        </h4>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 mb-4 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-base sm:text-lg text-gray-700 mb-4 space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-base sm:text-lg text-gray-700 leading-relaxed">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 sm:pl-6 py-4 bg-blue-50 rounded-r-lg mb-4">
                        <p className="text-base sm:text-lg text-gray-700 italic">
                          {children}
                        </p>
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <pre className="bg-gray-900 text-gray-100 p-4 sm:p-6 rounded-lg overflow-x-auto mb-4">
                          <code className="text-sm font-mono">
                            {children}
                          </code>
                        </pre>
                      );
                    },
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-blue-600 hover:text-blue-800 underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-gray-900">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-800">
                        {children}
                      </em>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-300 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 bg-gray-50 font-semibold text-gray-900">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-700">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            )}
          </article>

          {/* Admin Edit Button */}
          {isAdmin && !isEditing && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                편집
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            더 나은 SEO 성과를 원하시나요?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            AI 기반 SEO 솔루션으로 당신의 웹사이트를 검색엔진 상위에 노출시켜보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/seo-checker"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              무료 SEO 분석
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              더 많은 글 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CommentSection blogId={blog.id} initialComments={comments} />
        </div>
      </section>
    </div>
  );
} 