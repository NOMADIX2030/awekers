"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BlogNewPage: React.FC = () => {
  const router = useRouter();
  // 권한 체크: 관리자가 아니면 접근 불가
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("isAdmin") !== "true") {
        alert("관리자만 블로그를 작성할 수 있습니다.");
        router.replace("/login");
      }
    }
  }, [router]);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Unsplash 이미지 후보 상태
  const [unsplashImages, setUnsplashImages] = useState<string[]>([]);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashError, setUnsplashError] = useState("");

  // 이미지 URL 유효성 검사 (Unsplash, Google Images 허용)
  function isValidImageUrl(url: string) {
    // Unsplash, Google Images (images.unsplash.com, images.googleusercontent.com 등) 허용
    return /^https:\/\/(images\.unsplash\.com|encrypted-tbn0\.gstatic\.com|lh3\.googleusercontent\.com)\//.test(url);
  }

  // Unsplash 이미지 검색 핸들러
  async function handleUnsplashSearch() {
    setUnsplashLoading(true);
    setUnsplashError("");
    try {
      const res = await fetch("/api/blog/unsplash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tag }),
      });
      if (!res.ok) throw new Error("이미지 검색에 실패했습니다.");
      const data = await res.json();
      setUnsplashImages(data.images || []);
    } catch (e) {
      setUnsplashError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setUnsplashLoading(false);
    }
  }

  // 이미지가 Google 이미지가 아니면 입력란을 비움
  useEffect(() => {
    if (image && !isValidImageUrl(image)) {
      setImage(""); // 유효하지 않은 이미지 URL이면 입력란 비움
    }
  }, [image]);

  // 실제 이미지 유효성 검사 (비동기, HEAD 요청)
  const [imageValid, setImageValid] = useState(true);
  useEffect(() => {
    let ignore = false;
    async function check() {
      if (!image) {
        setImageValid(false);
        return;
      }
      try {
        const res = await fetch(image, { method: 'HEAD' });
        const contentType = res.headers.get('Content-Type') || '';
        // 200 OK & Content-Type: image/* 인 경우만 true
        if (!ignore) setImageValid(res.ok && contentType.startsWith('image/'));
      } catch {
        if (!ignore) setImageValid(false);
      }
    }
    check();
    return () => { ignore = true; };
  }, [image]);

  // 이미지 유효성 검사 실패 시 입력란을 비움
  useEffect(() => {
    if (image && !imageValid) {
      setImage(""); // 유효하지 않은 이미지면 입력란 비움
    }
  }, [imageValid]);

  // 모든 필드가 채워져 있고 이미지가 유효한지 체크
  const isFormValid = title.trim() && summary.trim() && content.trim() && tag.trim() && image.trim() && isValidImageUrl(image) && imageValid;

  // 저장
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, content, tag, image }),
      });
      if (!res.ok) throw new Error("저장에 실패했습니다.");
      const newBlog = await res.json();
      router.push(`/blog/${newBlog.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  };

  // AI 블로그 자동 작성
  const handleAIGenerate = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/ai-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // 파싱 실패 시 fallback 데이터가 있는 경우 사용
        if (data.data) {
          setTitle(data.data.title || "");
          setSummary(data.data.summary || "");
          setContent(data.data.content || "");
          setTag(data.data.tag || "");
          setImage(data.data.image || "");
          setAiError("AI 응답 파싱에 실패했지만 기본 구조로 생성했습니다. 내용을 확인하고 수정해주세요.");
        } else {
          throw new Error(data.error || "AI 블로그 생성에 실패했습니다.");
        }
      } else {
        // 정상 응답
        setTitle(data.title || "");
        setSummary(data.summary || "");
        setContent(data.content || "");
        setTag(data.tag || "");
        setImage(data.image || "");
      }
    } catch (e) {
      if (e instanceof Error) {
        setAiError(e.message);
      } else {
        setAiError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto py-16 px-4">
      <form className="bg-white border border-black/10 rounded-2xl shadow-lg p-8 flex flex-col gap-4" onSubmit={handleSave}>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">블로그 작성</h1>
        {/* AI 블로그 작성 영역 */}
        <div className="flex flex-col md:flex-row gap-2 mb-2">
          <input
            className="flex-1 px-4 py-2 rounded-lg border border-black/10 bg-gray-50 focus:border-black focus:bg-white outline-none transition"
            placeholder="AI에게 요청할 프롬프트(주제, 키워드 등)를 입력하세요"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            disabled={aiLoading || saving}
          />
          <button
            type="button"
            className="px-6 py-2 rounded-full bg-black text-white font-bold shadow hover:bg-gray-900 transition disabled:opacity-60"
            onClick={handleAIGenerate}
            disabled={aiLoading || saving || !aiPrompt.trim()}
          >
            {aiLoading ? "AI 작성 중..." : "AI로 작성"}
          </button>
        </div>
        {aiError && <div className="text-xs text-red-600 font-semibold mb-2">{aiError}</div>}
        <input
          className="text-xl font-bold border-b border-black/10 focus:border-black outline-none bg-transparent mb-2"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          disabled={saving}
        />
        <input
          className="text-base border-b border-black/10 focus:border-black outline-none bg-transparent mb-2"
          placeholder="요약을 입력하세요"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          required
          disabled={saving}
        />
        <textarea
          className="text-sm border border-black/10 focus:border-black outline-none bg-transparent rounded-lg p-3 min-h-[500px] mb-2"
          placeholder="본문을 입력하세요 (AI 생성 시 매우 상세한 내용이 자동으로 입력됩니다)"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={25}
          required
          disabled={saving}
        />
        <input
          className="text-base border-b border-black/10 focus:border-black outline-none bg-transparent mb-2"
          placeholder="태그 (예: Next.js, AI)"
          value={tag}
          onChange={e => setTag(e.target.value)}
          required
          disabled={saving}
        />
        <input
          className="text-base border-b border-black/10 focus:border-black outline-none bg-transparent mb-2"
          placeholder="대표 이미지 URL"
          value={image}
          onChange={e => setImage(e.target.value)}
          // required 제거: 이미지는 선택사항
          disabled={saving}
        />
        {/* 대표 이미지 미리보기: image가 있을 때만 렌더링 */}
        {image && (
          <img
            src={image}
            alt="대표 이미지"
            className="w-full max-h-60 object-contain rounded mb-2 border border-black/10"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {/* Unsplash 이미지 검색 옵션 UI */}
        <div className="flex flex-row gap-2 mb-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-100 border border-black/10 text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-60"
            onClick={handleUnsplashSearch}
            disabled={unsplashLoading || saving}
          >
            {unsplashLoading ? "이미지 검색 중..." : "관련 이미지 검색(Unsplash)"}
          </button>
          {unsplashError && <span className="text-xs text-red-600 font-semibold">{unsplashError}</span>}
        </div>
        {/* Unsplash 이미지 미리보기 그리드 */}
        {unsplashImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-2">
            {unsplashImages.map((url, idx) => (
              <img
                key={url}
                src={url}
                alt="미리보기"
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${image === url ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setImage(url)}
                title="이미지 선택"
              />
            ))}
          </div>
        )}
        {error && <div className="text-xs text-red-600 font-semibold mb-2">{error}</div>}
        {/* 이미지가 입력된 경우에만 유효성 안내 표시 */}
        {image && !imageValid && (
          <div className="text-xs text-red-600 font-semibold mb-2">이미지 URL이 실제로 유효하지 않습니다. Unsplash에서 정상 이미지를 선택해 주세요.</div>
        )}
        <button
          type="submit"
          className="mt-4 w-full py-3 rounded-full bg-black text-white font-bold shadow hover:bg-gray-900 transition disabled:opacity-60"
          // 저장 버튼 활성화 조건에서 이미지 관련 조건 제거
          disabled={saving || !(title.trim() && summary.trim() && content.trim() && tag.trim())}
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </form>
    </section>
  );
};

export default BlogNewPage; 