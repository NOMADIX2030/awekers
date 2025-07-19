"use client";
// src/app/blog/[id]/page.tsx - 블로그 상세 뷰/수정 페이지
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// 태그 키워드에 백링크를 적용하는 함수
function autoLinkKeywords(content: string, tagString: string, baseUrl: string) {
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

// blogs 배열 및 샘플 데이터 제거
// 샘플 블로그 데이터 (실제 서비스에서는 DB/API에서 가져옴)
// const blogs = [
//   {
//     id: 1,
//     title: "Next.js로 만드는 트렌디한 웹사이트",
//     summary: "최신 Next.js와 TailwindCSS로 빠르고 세련된 웹사이트를 만드는 방법을 소개합니다.",
//     date: "2024-07-01",
//     tag: "Next.js",
//     image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
//     content: `Next.js와 TailwindCSS를 활용하면 빠르고 트렌디한 웹사이트를 손쉽게 만들 수 있습니다.\n\n1. 프로젝트 초기화\n2. 컴포넌트 설계\n3. 반응형 스타일 적용\n4. 배포까지 한 번에!`
//   },
//   {
//     id: 2,
//     title: "디자인 시스템 구축 가이드",
//     summary: "일관된 UI/UX를 위한 디자인 시스템 설계와 도입 노하우를 공유합니다.",
//     date: "2024-06-25",
//     tag: "Design",
//     image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
//     content: `디자인 시스템은 일관된 UI/UX를 제공하는 핵심입니다.\n\n- 컴포넌트 재사용\n- 컬러/타이포/스페이싱 토큰 관리\n- 문서화와 협업 프로세스 정립`
//   },
//   {
//     id: 3,
//     title: "프론트엔드 개발 생산성 툴 TOP 5",
//     summary: "개발 속도를 높여주는 필수 프론트엔드 툴과 활용법을 정리했습니다.",
//     date: "2024-06-20",
//     tag: "Productivity",
//     image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
//     content: `생산성을 높여주는 툴\n\n1. VSCode\n2. Figma\n3. Storybook\n4. GitHub Copilot\n5. Prettier/ESLint`
//   },
//   {
//     id: 4,
//     title: "AI와 웹개발의 미래",
//     summary: "AI 기술이 웹개발에 미치는 영향과 앞으로의 트렌드를 전망합니다.",
//     date: "2024-06-10",
//     tag: "AI",
//     image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
//     content: `AI는 웹개발의 많은 부분을 자동화하고 있습니다.\n\n- 코드 생성\n- 디자인 자동화\n- 사용자 맞춤형 경험\n\n앞으로의 웹은 AI와 더욱 밀접하게 연결될 것입니다.`
//   },
// ];

const BlogDetailPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // 블로그 데이터 상태
  const [blog, setBlog] = useState<{
    id: number;
    title: string;
    summary: string;
    content: string;
    tag: string;
    image: string;
    date: string;
    view: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // DB에서 블로그 데이터 fetch
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setFetchError("");
    fetch(`/api/blog/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("존재하지 않는 블로그입니다.");
        return res.json();
      })
      .then(data => setBlog(data))
      .catch(e => setFetchError(e.message))
      .finally(() => setLoading(false));
    // 조회수 증가 API 호출
    fetch(`/api/blog/${id}/view`, { method: "POST" });
  }, [id]);

  // 수정 모드 상태
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editContent, setEditContent] = useState("");
  const [shareMsg, setShareMsg] = useState("");

  // 블로그 데이터가 변경될 때 수정폼 값도 동기화
  useEffect(() => {
    if (blog) {
      setEditTitle(blog.title);
      setEditSummary(blog.summary);
      setEditContent(blog.content);
    }
  }, [blog]);

  // 저장(실제 서비스에서는 API 호출)
  const [saving, setSaving] = useState(false); // 저장 중 상태
  const [errorMsg, setErrorMsg] = useState(""); // 에러 메시지
  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/blog/${id}`, {
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
      // 저장 후 최신 데이터 fetch
      const updated = await res.json();
      setBlog(updated);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  };
  // 취소
  const handleCancel = () => {
    if (!blog) return;
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
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");
      alert("삭제가 완료되었습니다.");
      router.push("/");
    } catch (e) {
      alert(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setDeleting(false);
    }
  };

  // 복사 기능 (DB에 복사본 생성)
  const [copying, setCopying] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");
  const handleCopy = async () => {
    setCopying(true);
    setCopyMsg("");
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blog.title + " (복사본)",
          summary: blog.summary,
          content: blog.content,
          tag: blog.tag,
          image: blog.image,
        }),
      });
      if (!res.ok) throw new Error("복사에 실패했습니다.");
      const newBlog = await res.json();
      setCopyMsg("복사본이 생성되었습니다!");
      router.push(`/blog/${newBlog.id}`);
    } catch (e) {
      setCopyMsg(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setCopying(false);
      setTimeout(() => setCopyMsg(""), 2000);
    }
  };

  // 클라이언트에서 관리자 권한 감지
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    }
  }, []);

  // baseUrl 상태 관리 (window.location.origin)
  const [baseUrl, setBaseUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  // 댓글 상태
  const [comments, setComments] = useState<Array<{
    id: number;
    content: string;
    createdAt: string;
    user: { email: string };
    _count: { likes: number; reports: number };
  }>>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  // 댓글 입력 상태
  const [commentContent, setCommentContent] = useState("");
  const [commentSubmitMsg, setCommentSubmitMsg] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // 좋아요/신고 관련 상태
  const [likeStates, setLikeStates] = useState<{[key: number]: boolean}>({});
  const [reportStates, setReportStates] = useState<{[key: number]: boolean}>({});
  const [reportReason, setReportReason] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  // 댓글 삭제 관련 상태
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const id = localStorage.getItem("userId");
      const email = localStorage.getItem("userEmail");
      
      setIsLoggedIn(loggedIn);
      setUserId(id ? parseInt(id) : null);
      setUserEmail(email);
    }
  }, []);

  // 댓글 불러오기
  useEffect(() => {
    if (!id) return;
    setCommentLoading(true);
    setCommentError("");
    fetch(`/api/blog/${id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data.comments || []))
      .catch(e => setCommentError("댓글을 불러오지 못했습니다."))
      .finally(() => setCommentLoading(false));
  }, [id, commentSubmitMsg]);

  // 댓글 작성 핸들러
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentSubmitMsg("");
    setCommentSubmitting(true);
    
    console.log("댓글 작성 시도:", { isLoggedIn, userId, commentContent });
    
    if (!isLoggedIn || !userId) {
      setCommentSubmitMsg("로그인이 필요합니다.");
      return;
    }
    
    if (!commentContent.trim()) {
      setCommentSubmitMsg("댓글 내용을 입력하세요.");
      return;
    }
    
    const requestBody = {
      content: commentContent,
      userId: Number(userId),
    };
    
    console.log("댓글 작성 요청:", requestBody);
    
    const res = await fetch(`/api/blog/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    
    let data = {};
    try {
      data = await res.json();
      console.log("댓글 작성 응답:", { status: res.status, data });
    } catch (e) {
      console.error("댓글 작성 응답 파싱 오류:", e);
      setCommentSubmitMsg("서버 응답 오류(댓글 등록 실패)");
      return;
    }
    
    if (!res.ok) {
      setCommentSubmitMsg((data as { error?: string }).error || "댓글 등록에 실패했습니다.");
      setCommentSubmitting(false);
      return;
    }
    
    setCommentContent("");
    setCommentSubmitMsg("댓글이 등록되었습니다! 🎉");
    
    // 댓글 목록 즉시 새로고침
    try {
      const commentsRes = await fetch(`/api/blog/${id}/comments`);
      const commentsData = await commentsRes.json();
      setComments(commentsData.comments || []);
    } catch (e) {
      console.error("댓글 목록 새로고침 실패:", e);
    }
    
    setCommentSubmitting(false);
    setTimeout(() => setCommentSubmitMsg(""), 4000);
  };

  // 좋아요 핸들러
  const handleLike = async (commentId: number) => {
    if (!isLoggedIn || !userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const isLiked = likeStates[commentId];
    
    try {
      const res = await fetch(`/api/blog/${id}/comments/${commentId}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setLikeStates(prev => ({ ...prev, [commentId]: !isLiked }));
        // 댓글 목록 새로고침
        const commentsRes = await fetch(`/api/blog/${id}/comments`);
        const commentsData = await commentsRes.json();
        setComments(commentsData.comments || []);
      } else {
        const data = await res.json();
        alert(data.error || "좋아요 처리에 실패했습니다.");
      }
    } catch (e) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 신고 모달 열기
  const handleReportClick = (commentId: number) => {
    if (!isLoggedIn || !userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    setSelectedCommentId(commentId);
    setShowReportModal(true);
  };

  // 신고 제출
  const handleReportSubmit = async () => {
    if (!selectedCommentId || !reportReason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`/api/blog/${id}/comments/${selectedCommentId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason: reportReason }),
      });

      if (res.ok) {
        setReportStates(prev => ({ ...prev, [selectedCommentId]: true }));
        setShowReportModal(false);
        setReportReason("");
        setSelectedCommentId(null);
        alert("댓글이 신고되었습니다.");
      } else {
        const data = await res.json();
        alert(data.error || "신고 처리에 실패했습니다.");
      }
    } catch (e) {
      alert("신고 처리 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId: number) => {
    if (!isLoggedIn || !userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    setDeletingCommentId(commentId);
    
    try {
      const res = await fetch(`/api/blog/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        // 댓글 목록에서 삭제된 댓글 제거
        setComments(prev => prev.filter(c => c.id !== commentId));
        alert("댓글이 삭제되었습니다.");
      } else {
        const data = await res.json();
        alert(data.error || "댓글 삭제에 실패했습니다.");
      }
    } catch (e) {
      alert("댓글 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) return <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center text-black/50">불러오는 중...</div>;
  if (fetchError || !blog) return <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center text-red-500">{fetchError || "블로그를 찾을 수 없습니다."}</div>;

  return (
    <section className="w-full max-w-2xl mx-auto py-16 px-4">
      <article className="border border-black/10 rounded-2xl bg-white shadow-lg overflow-hidden">
        <div className="w-full aspect-[16/9] bg-gray-100 overflow-hidden">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title + ' 대표 이미지'}
              className="w-full h-full object-cover object-center transition-transform duration-300"
              loading="lazy"
            />
          )}
        </div>
        <div className="p-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-black/50 mb-1">
            <span className="font-semibold">{blog.tag}</span>
            <span>·</span>
            <span>{blog.date ? new Date(blog.date).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\./g, ".") : ""}</span>
            <span>·</span>
            <span>조회수 {blog.view ?? 0}</span>
          </div>
          {/* 공유/수정 버튼 영역 */}
          <div className="flex gap-2 mb-2">
            <button
              className="px-4 py-1.5 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition text-xs flex items-center gap-1"
              onClick={handleShare}
              aria-label="이 글 공유하기"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M15 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 10H9a5 5 0 1 0 0 10h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              공유하기
            </button>
            {isAdmin && (
              <>
                <button
                  className="px-4 py-1.5 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition text-xs"
                  onClick={handleCopy}
                  disabled={deleting || copying}
                >
                  {copying ? "복사 중..." : "복사하기"}
                </button>
                {!editMode && (
                  <button className="px-4 py-1.5 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition text-xs" onClick={() => setEditMode(true)} disabled={deleting}>
                    블로그 수정하기
                  </button>
                )}
                <button
                  className="px-4 py-1.5 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition text-xs"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "삭제 중..." : "삭제"}
                </button>
              </>
            )}
          </div>
          {(shareMsg || copyMsg) && <div className="text-xs text-green-600 font-semibold mb-2">{shareMsg || copyMsg}</div>}
          {/* 수정 모드 */}
          {editMode && isAdmin ? (
            <>
              <input
                className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight border-b border-black/10 focus:border-black outline-none bg-transparent"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                disabled={saving}
              />
              <textarea
                className="text-base text-black/70 whitespace-pre-line mb-2 border-b border-black/10 focus:border-black outline-none bg-transparent resize-none"
                value={editSummary}
                onChange={e => setEditSummary(e.target.value)}
                rows={2}
                disabled={saving}
              />
              <textarea
                className="text-sm text-black/90 whitespace-pre-line leading-relaxed border border-black/10 focus:border-black outline-none bg-transparent rounded-lg p-3 min-h-[120px]"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={8}
                disabled={saving}
              />
              {errorMsg && <div className="text-xs text-red-600 font-semibold mb-2">{errorMsg}</div>}
              <div className="flex gap-2 mt-4">
                <button className="px-5 py-2 rounded-full bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-60" onClick={handleSave} disabled={saving}>{saving ? "저장 중..." : "저장"}</button>
                <button className="px-5 py-2 rounded-full border border-black text-black font-semibold hover:bg-gray-100 transition" onClick={handleCancel} disabled={saving}>취소</button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">{blog.title}</h1>
              <p className="text-base text-black/70 whitespace-pre-line mb-4">{blog.summary}</p>
              <div
                className="text-sm text-black/90 whitespace-pre-line leading-relaxed"
                dangerouslySetInnerHTML={{ __html: autoLinkKeywords(blog.content, blog.tag, baseUrl) }}
              />
            </>
          )}
        </div>
      </article>
      {/* 댓글 영역 */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black">댓글</h2>
        </div>
        {/* 댓글 작성 폼 */}
        {isLoggedIn ? (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-semibold text-sm">
                {userEmail?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-semibold text-black text-sm">
                  {userEmail?.split('@')[0] || '사용자'}
                </div>
                <div className="text-black/50 text-xs">댓글을 작성해주세요</div>
              </div>
            </div>
            
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  className="w-full border border-black/10 rounded-2xl px-4 py-3 text-sm resize-none focus:border-black focus:ring-0 outline-none transition-colors bg-white"
                  rows={4}
                  placeholder="이 글에 대한 생각을 공유해주세요..."
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  disabled={commentSubmitting}
                  required
                />
                <div className="absolute bottom-3 right-3 text-xs text-black/30">
                  {commentContent.length}/500
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-black/50">
                  댓글은 수정할 수 없습니다
                </div>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-black text-white rounded-full font-semibold text-sm hover:bg-black/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!commentContent.trim() || commentSubmitting}
                >
                  {commentSubmitting ? "등록 중..." : "댓글 등록"}
                </button>
              </div>
              
              {commentSubmitMsg && (
                <div className={`text-sm font-medium p-3 rounded-lg ${
                  commentSubmitMsg.includes('등록되었습니다') 
                    ? 'bg-black/5 text-black border border-black/10' 
                    : 'bg-black/5 text-black border border-black/10'
                }`}>
                  {commentSubmitMsg}
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-black/10 rounded-2xl bg-black/2 mb-8">
            <div className="text-black/30 text-4xl mb-4">💬</div>
            <div className="text-black font-medium mb-2">댓글을 작성하려면 로그인이 필요합니다</div>
            <div className="text-black/50 text-sm mb-6">로그인하고 의견을 공유해보세요</div>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-black/80 transition-colors shadow-sm"
            >
              로그인하기
            </button>
          </div>
        )}
        {/* 댓글 리스트 */}
        {commentLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            <span className="ml-2 text-black/50">댓글을 불러오는 중...</span>
          </div>
        ) : commentError ? (
          <div className="text-center py-8">
            <div className="text-black/50 mb-2">⚠️</div>
            <div className="text-black font-medium">{commentError}</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-black/10 rounded-lg bg-black/2">
            <div className="text-black/30 text-4xl mb-3">💬</div>
            <div className="text-black font-medium mb-1">아직 댓글이 없습니다</div>
            <div className="text-black/50 text-sm">첫 번째 댓글을 남겨보세요!</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">댓글 {comments.length}개</h3>
            </div>
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="group relative">
                  <div className="flex gap-3">
                    {/* 사용자 아바타 */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold text-sm">
                        {c.user.email.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* 댓글 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-black/5 rounded-2xl px-4 py-3 border border-black/5">
                        {/* 댓글 헤더 */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-black text-sm">
                            {c.user.email.split('@')[0]}
                          </span>
                          {c.user.isAdmin && (
                            <span className="bg-black text-white px-2 py-0.5 rounded-full text-xs font-medium">
                              관리자
                            </span>
                          )}
                          <span className="text-black/30 text-xs">•</span>
                          <span className="text-black/50 text-xs">
                            {new Date(c.createdAt).toLocaleDateString("ko-KR", { 
                              year: "numeric", 
                              month: "short", 
                              day: "numeric" 
                            })}
                          </span>
                          <span className="text-black/30 text-xs">•</span>
                          <span className="text-black/50 text-xs">
                            {new Date(c.createdAt).toLocaleTimeString("ko-KR", { 
                              hour: "2-digit", 
                              minute: "2-digit" 
                            })}
                          </span>
                          {/* 신고 횟수 표시 */}
                          {c._count?.reports > 0 && (
                            <>
                              <span className="text-black/30 text-xs">•</span>
                              <span className={`text-xs font-medium flex items-center gap-1 ${
                                c._count.reports >= 3 
                                  ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200' 
                                  : 'text-red-500'
                              }`}>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                신고 {c._count.reports}회
                                {c._count.reports >= 3 && (
                                  <span className="ml-1 text-xs">⚠️</span>
                                )}
                              </span>
                            </>
                          )}
                        </div>
                        
                        {/* 댓글 본문 */}
                        <div className="text-black/80 text-sm leading-relaxed whitespace-pre-line">
                          {c._count?.reports >= 3 ? (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <span className="font-medium">해당 댓글은 신고 누적으로 볼수 없습니다.</span>
                            </div>
                          ) : (
                            c.content
                          )}
                        </div>
                      </div>
                      
                      {/* 댓글 액션 버튼 (호버 시 표시) */}
                      <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-black/50 hover:text-black text-xs font-medium transition-colors">
                          답글
                        </button>
                        <button 
                          onClick={() => handleLike(c.id)}
                          className={`text-xs font-medium transition-colors flex items-center gap-1 ${
                            likeStates[c.id] ? 'text-red-500' : 'text-black/50 hover:text-black'
                          }`}
                        >
                          <svg className="w-3 h-3" fill={likeStates[c.id] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          좋아요 {c._count?.likes || 0}
                        </button>
                        <button 
                          onClick={() => handleReportClick(c.id)}
                          className={`text-xs font-medium transition-colors ${
                            reportStates[c.id] ? 'text-red-500' : 'text-black/50 hover:text-black'
                          }`}
                        >
                          {reportStates[c.id] ? '신고됨' : '신고'}
                        </button>
                        {/* 삭제 버튼 - 자신의 댓글이거나 관리자인 경우만 표시 */}
                        {(c.user.id === userId || isAdmin) && (
                          <button 
                            onClick={() => handleCommentDelete(c.id)}
                            disabled={deletingCommentId === c.id}
                            className="text-red-500 hover:text-red-600 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingCommentId === c.id ? '삭제 중...' : '삭제'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 신고 모달 */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">댓글 신고</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">신고 사유</label>
              <textarea
                className="w-full border border-black/10 rounded-lg p-3 text-sm resize-none focus:border-black focus:ring-0 outline-none"
                rows={4}
                placeholder="신고 사유를 구체적으로 작성해주세요 (최소 5자 이상)"
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                maxLength={500}
              />
              <div className="text-xs text-black/50 mt-1">
                {reportReason.length}/500
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                  setSelectedCommentId(null);
                }}
                className="flex-1 px-4 py-2 border border-black/10 text-black rounded-lg font-medium hover:bg-black/5 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={reportReason.trim().length < 5}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                신고하기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogDetailPage; 