"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "../components/AdminCard";

const AdminBlogWritePage: React.FC = () => {
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
  const [aiSuccess, setAiSuccess] = useState("");

  // Unsplash 이미지 후보 상태
  const [unsplashImages, setUnsplashImages] = useState<string[]>([]);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashError, setUnsplashError] = useState("");

  // 이미지 URL 유효성 검사 (Unsplash, Google Images 허용)
  function isValidImageUrl(url: string) {
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
      setImage("");
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
      setImage("");
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
    setAiSuccess("");
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
          setAiSuccess("AI 응답 파싱에 실패했지만 기본 구조로 생성했습니다. 내용을 확인하고 수정해주세요.");
          setAiError(""); // 성공 메시지가 있으면 에러 메시지 제거
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
        setAiSuccess("AI 블로그 생성이 완료되었습니다! 내용을 확인하고 필요시 수정해주세요.");
        setAiError(""); // 성공 메시지가 있으면 에러 메시지 제거
      }
    } catch (e) {
      if (e instanceof Error) {
        setAiError(e.message);
      } else {
        setAiError("알 수 없는 오류가 발생했습니다.");
      }
      setAiSuccess(""); // 에러가 있으면 성공 메시지 제거
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          블로그 작성
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          새로운 블로그 글을 작성하거나 AI를 활용하여 자동으로 생성할 수 있습니다.
        </p>
      </div>

      {/* AI 블로그 생성 섹션 */}
      <AdminCard>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">AI 블로그 생성</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              placeholder="AI에게 요청할 프롬프트(주제, 키워드 등)를 입력하세요"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              disabled={aiLoading || saving}
            />
            <button
              type="button"
              className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAIGenerate}
              disabled={aiLoading || saving || !aiPrompt.trim()}
            >
              {aiLoading ? "AI 작성 중..." : "AI로 작성"}
            </button>
          </div>
          
          {/* AI 성공 메시지 */}
          {aiSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">{aiSuccess}</p>
            </div>
          )}
          
          {/* AI 에러 메시지 */}
          {aiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{aiError}</p>
            </div>
          )}
        </div>
      </AdminCard>

      {/* 블로그 작성 폼 */}
      <AdminCard>
        <form className="space-y-6" onSubmit={handleSave}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">블로그 내용 작성</h2>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              제목 *
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="블로그 제목을 입력하세요"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          {/* 요약 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              요약 *
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="블로그 요약을 입력하세요"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          {/* 본문 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              본문 *
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="블로그 본문을 입력하세요 (AI 생성 시 매우 상세한 내용이 자동으로 입력됩니다)"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={15}
              required
              disabled={saving}
            />
            <p className="text-xs text-gray-500">
              현재 {content.length}자 입력됨 (최소 100자 권장)
            </p>
          </div>

          {/* 태그 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              태그 *
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="태그 (예: Next.js, AI, React)"
              value={tag}
              onChange={e => setTag(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          {/* 이미지 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <h3 className="text-md font-semibold text-gray-900">대표 이미지</h3>
            </div>

            {/* 이미지 URL 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이미지 URL
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="대표 이미지 URL (Unsplash 이미지 권장)"
                value={image}
                onChange={e => setImage(e.target.value)}
                disabled={saving}
              />
            </div>

            {/* Unsplash 이미지 검색 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="px-4 py-3 rounded-lg bg-green-100 border border-green-300 text-green-700 font-medium hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUnsplashSearch}
                disabled={unsplashLoading || saving}
              >
                {unsplashLoading ? "이미지 검색 중..." : "관련 이미지 검색 (Unsplash)"}
              </button>
              {unsplashError && (
                <span className="text-sm text-red-600 font-medium">{unsplashError}</span>
              )}
            </div>

            {/* 이미지 미리보기 */}
            {image && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  이미지 미리보기
                </label>
                <img
                  src={image}
                  alt="대표 이미지"
                  className="w-full max-h-60 object-contain rounded-lg border border-gray-300"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}

            {/* Unsplash 이미지 선택 */}
            {unsplashImages.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  추천 이미지 선택
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {unsplashImages.map((url, idx) => (
                    <img
                      key={url}
                      src={url}
                      alt="미리보기"
                      className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                        image === url ? 'border-green-500' : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setImage(url)}
                      title="이미지 선택"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 이미지 유효성 경고 */}
            {image && !imageValid && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 font-medium">
                  이미지 URL이 유효하지 않습니다. Unsplash에서 정상 이미지를 선택해 주세요.
                </p>
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* 저장 버튼 */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving || !(title.trim() && summary.trim() && content.trim() && tag.trim())}
            >
              {saving ? "저장 중..." : "블로그 저장"}
            </button>
          </div>
        </form>
      </AdminCard>
    </>
  );
};

export default AdminBlogWritePage; 