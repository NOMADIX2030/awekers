"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { CommentSection } from '@/components/comments';
import './styles.css';

interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  tag: string;
  image: string;
  date: Date;
  view: number;
}

interface BlogDetailClientProps {
  blog: Blog;
}

// 태그 키워드에 백링크를 적용하는 함수
function autoLinkKeywords(content: string, tagString: string) {
  if (!tagString) return content;
  const tags = tagString.split(',').map(t => t.trim()).filter(Boolean);
  if (tags.length === 0) return content;
  
  // 중복 방지, 긴 단어 우선(겹치는 키워드 방지)
  tags.sort((a, b) => b.length - a.length);
  let result = content;
  
  tags.forEach(tag => {
    if (!tag) return;
    
    // 띄어쓰기가 있는 태그와 없는 태그를 구분하여 처리
    if (tag.includes(' ')) {
      // 띄어쓰기가 있는 태그: 정확한 문자열 매칭
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedTag})`, 'g');
      result = result.replace(regex, (match) => {
        const url = `/tag/${encodeURIComponent(tag)}`;
        return `<a href="${url}" class="tag-link">${match}</a>`;
      });
    } else {
      // 띄어쓰기가 없는 태그: 단어 경계 확인
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<![\w가-힣])(${escapedTag})(?![\w가-힣])`, 'g');
      result = result.replace(regex, (match) => {
        const url = `/tag/${encodeURIComponent(tag)}`;
        return `<a href="${url}" class="tag-link">${match}</a>`;
      });
    }
  });
  return result;
}

const BlogDetailClient: React.FC<BlogDetailClientProps> = ({ blog }) => {
  const router = useRouter();

  // 관리자 권한 체크
  const [isAdmin, setIsAdmin] = useState(false);

  // 수정 모드 상태
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(blog.title);
  const [editSummary, setEditSummary] = useState(blog.summary);
  const [editContent, setEditContent] = useState(blog.content);
  const [shareMsg, setShareMsg] = useState("");

  // 저장 기능
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 관리자 권한 체크
  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminStatus = localStorage.getItem("isAdmin") === "true";
      setIsAdmin(adminStatus);
    }
  }, []);
  
  const handleSave = async () => {
    if (!isAdmin) {
      setErrorMsg("관리자 권한이 필요합니다.");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/blog/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          summary: editSummary,
          content: editContent,
        }),
      });
      if (!res.ok) throw new Error("수정에 실패했습니다.");
      setEditMode(false);
      // 저장 후 페이지 새로고침
      router.refresh();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  };

  // 취소
  const handleCancel = () => {
    if (!isAdmin) {
      setErrorMsg("관리자 권한이 필요합니다.");
      return;
    }
    setEditTitle(blog.title);
    setEditSummary(blog.summary);
    setEditContent(blog.content);
    setEditMode(false);
  };

  // 공유하기
  const handleShare = async () => {
    if (!isAdmin) {
      setErrorMsg("관리자 권한이 필요합니다.");
      return;
    }
    
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.summary,
          url,
        });
        setShareMsg("공유가 완료되었습니다.");
      } catch {
        setShareMsg("공유가 취소되었습니다.");
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setShareMsg("링크가 클립보드에 복사되었습니다!");
      } catch {
        setShareMsg("클립보드 복사에 실패했습니다.");
      }
    } else {
      setShareMsg("공유 기능을 지원하지 않는 브라우저입니다.");
    }
    setTimeout(() => setShareMsg(""), 2000);
  };

  // 삭제 기능
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!isAdmin) {
      setErrorMsg("관리자 권한이 필요합니다.");
      return;
    }
    
    if (!confirm("정말로 이 블로그를 삭제하시겠습니까?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blog/${blog.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");
      router.push("/");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "알 수 없는 오류");
      setDeleting(false);
    }
  };

  // 복사 기능
  const handleCopy = async () => {
    if (!isAdmin) {
      setErrorMsg("관리자 권한이 필요합니다.");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(blog.content);
      setShareMsg("내용이 클립보드에 복사되었습니다!");
    } catch {
      setShareMsg("클립보드 복사에 실패했습니다.");
    }
    setTimeout(() => setShareMsg(""), 2000);
  };

  return (
    <div className="w-full max-w-full sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 font-pretendard bg-white min-h-screen">
      {/* 공유 메시지 */}
      {shareMsg && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg z-50">
          {shareMsg}
        </div>
      )}

      {/* 에러 메시지 */}
      {errorMsg && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMsg}
        </div>
      )}



      {/* 블로그 헤더 */}
      <header className="mb-6 sm:mb-8 lg:mb-12 xl:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 lg:mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-black transition-colors font-medium self-start"
          >
            ← 뒤로가기
          </button>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  공유
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  복사
                </button>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors font-medium"
                >
                  {editMode ? "취소" : "수정"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {deleting ? "삭제 중..." : "삭제"}
                </button>
              </>
            )}
          </div>
        </div>

        {editMode && isAdmin ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-3xl font-bold border border-gray-300 rounded-lg p-3"
              placeholder="제목"
            />
            <textarea
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="요약"
              rows={3}
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="내용"
              rows={20}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold mb-4 sm:mb-6 lg:mb-8 tracking-tight text-black leading-tight">
              {blog.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-sm sm:text-base text-black/50 mb-4 sm:mb-6 lg:mb-8">
              <span className="text-xs sm:text-sm lg:text-base">{blog.tag}</span>
              <span className="hidden sm:inline">·</span>
              <span className="text-xs sm:text-sm lg:text-base">{blog.date.toISOString().slice(0, 10)}</span>
              <span className="hidden sm:inline">·</span>
              <span className="text-xs sm:text-sm lg:text-base">조회수 {blog.view}</span>
            </div>
            <h4 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-black/70 mb-6 sm:mb-8 lg:mb-10 font-medium leading-relaxed">{blog.summary}</h4>
          </>
        )}
      </header>

      {/* 블로그 이미지 */}
      {!editMode && blog.image && (
        <div className="mt-6 sm:mt-8 lg:mt-12 xl:mt-16 mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
          <img
            src={blog.image}
            alt={blog.title + ' 대표 이미지'}
            className="w-full h-auto rounded-lg sm:rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-md sm:shadow-lg lg:shadow-xl"
          />
        </div>
      )}

      {/* 블로그 내용 */}
      {!editMode && (
        <article className="markdown-content mt-8 sm:mt-12 lg:mt-16">
          <ReactMarkdown 
            remarkPlugins={[
              remarkGfm,
              remarkBreaks,
              [remarkToc, { tight: true, maxDepth: 3 }]
            ]}
            rehypePlugins={[
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }]
            ]}
            components={{
              // 헤딩태그 자동 조절 (H1→H5, H2→H5, H3→H5, H4→H6, H5→H6, H6→H6)
              h1: ({ node, ...props }) => <h5 {...props} className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8" />,
              h2: ({ node, ...props }) => <h5 {...props} className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8" />,
              h3: ({ node, ...props }) => <h5 {...props} className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8" />,
              h4: ({ node, ...props }) => <h6 {...props} className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium text-gray-900 mb-3 sm:mb-4 mt-4 sm:mt-6" />,
              h5: ({ node, ...props }) => <h6 {...props} className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium text-gray-900 mb-3 sm:mb-4 mt-4 sm:mt-6" />,
              h6: ({ node, ...props }) => <h6 {...props} className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium text-gray-900 mb-3 sm:mb-4 mt-4 sm:mt-6" />,
              // 단락을 H6로 변환
              p: ({ node, ...props }) => <h6 {...props} className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed" />,
              // 태그 링크 처리를 위한 커스텀 컴포넌트
              a: ({ node, ...props }) => {
                const href = props.href;
                if (href && href.startsWith('/tag/')) {
                  return (
                    <a 
                      {...props} 
                      className="tag-link"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(href);
                      }}
                    />
                  );
                }
                return <a {...props} />;
              },
              // 텍스트 노드에서 태그 키워드를 링크로 변환
              text: ({ node, children, ...props }: any) => {
                let text = children as string;
                if (!text) return <span>{children}</span>;
                
                // 태그 키워드에 링크 추가
                const tags = blog.tag.split(',').map(t => t.trim()).filter(Boolean);
                if (tags.length === 0) return <span>{text}</span>;
                
                // 긴 단어 우선 (겹치는 키워드 방지)
                tags.sort((a, b) => b.length - a.length);
                
                let result = text;
                const parts = [];
                let lastIndex = 0;
                
                tags.forEach(tag => {
                  if (!tag) return;
                  
                  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                  let regex;
                  
                  if (tag.includes(' ')) {
                    // 띄어쓰기가 있는 태그: 정확한 문자열 매칭
                    regex = new RegExp(`(${escapedTag})`, 'g');
                  } else {
                    // 띄어쓰기가 없는 태그: 단어 경계 확인
                    regex = new RegExp(`(?<![\w가-힣])(${escapedTag})(?![\w가-힣])`, 'g');
                  }
                  
                  let match;
                  while ((match = regex.exec(result)) !== null) {
                    const beforeMatch = result.slice(lastIndex, match.index);
                    if (beforeMatch) {
                      parts.push(<span key={`text-${lastIndex}`}>{beforeMatch}</span>);
                    }
                    
                    const url = `/tag/${encodeURIComponent(tag)}`;
                    parts.push(
                      <a 
                        key={`tag-${match.index}`}
                        href={url}
                        className="tag-link"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(url);
                        }}
                      >
                        {match[1]}
                      </a>
                    );
                    
                    lastIndex = match.index + match[1].length;
                  }
                });
                
                if (lastIndex < result.length) {
                  parts.push(<span key={`text-${lastIndex}`}>{result.slice(lastIndex)}</span>);
                }
                
                return parts.length > 0 ? <>{parts}</> : <span>{text}</span>;
              },
              // 코드 블록 스타일링
              code: ({ node, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !className || !className.includes('language-');
                return !isInline ? (
                  <pre className={className}>
                    <code className={match ? `language-${match[1]}` : ''} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              // 이미지 최적화
              img: ({ node, ...props }) => (
                <img 
                  {...props} 
                  loading="lazy"
                  className="max-w-full h-auto rounded-lg shadow-md my-6"
                />
              ),
              // 테이블 스타일링
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto">
                  <table {...props} />
                </div>
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </article>
      )}

      {/* 댓글 섹션 */}
      {!editMode && (
        <div className="mt-8 sm:mt-12 border-t border-gray-200 pt-6 sm:pt-8">
          <CommentSection blogId={blog.id} />
        </div>
      )}
    </div>
  );
};

export default BlogDetailClient; 