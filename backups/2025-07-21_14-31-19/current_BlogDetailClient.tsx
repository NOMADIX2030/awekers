"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  // 수정 모드 상태
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(blog.title);
  const [editSummary, setEditSummary] = useState(blog.summary);
  const [editContent, setEditContent] = useState(blog.content);
  const [shareMsg, setShareMsg] = useState("");

  // 저장 기능
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const handleSave = async () => {
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
    setEditTitle(blog.title);
    setEditSummary(blog.summary);
    setEditContent(blog.content);
    setEditMode(false);
  };

  // 공유하기
  const handleShare = async () => {
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
    try {
      await navigator.clipboard.writeText(blog.content);
      setShareMsg("내용이 클립보드에 복사되었습니다!");
    } catch {
      setShareMsg("클립보드 복사에 실패했습니다.");
    }
    setTimeout(() => setShareMsg(""), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-4 font-pretendard bg-white min-h-screen">
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
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="text-black/60 hover:text-black transition-colors"
          >
            ← 뒤로가기
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              공유
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 border border-black text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              복사
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editMode ? "취소" : "수정"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>

        {editMode ? (
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-black">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-black/50 mb-4">
              <span>{blog.tag}</span>
              <span>·</span>
              <span>{blog.date.toISOString().slice(0, 10)}</span>
              <span>·</span>
              <span>조회수 {blog.view}</span>
            </div>
            <p className="text-lg text-black/70 mb-8">{blog.summary}</p>
          </>
        )}
      </header>

      {/* 블로그 이미지 */}
      {!editMode && blog.image && (
        <div className="mb-8">
          <img
            src={blog.image}
            alt={blog.title + ' 대표 이미지'}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      )}

      {/* 블로그 내용 */}
      {!editMode && (
        <article className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: autoLinkKeywords(blog.content, blog.tag),
            }}
            className="text-black leading-relaxed"
          />
        </article>
      )}
    </div>
  );
};

export default BlogDetailClient; 