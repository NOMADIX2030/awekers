"use client";
// src/app/login/page.tsx - 트랜디한 로그인 페이지
import React from "react";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // 로그인 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "로그인에 실패했습니다.");
      // 관리자면 관리자 대시보드로 이동
      if (data.isAdmin) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("userId", data.userId);
        window.dispatchEvent(new Event("storage")); // 헤더 갱신
        router.push("/admin/dashboard");
      } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("userId", data.userId);
        window.dispatchEvent(new Event("storage")); // 헤더 갱신
        router.push("/");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-black/10 rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-extrabold text-center mb-2 tracking-tight">로그인</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-black/80">이메일</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="px-4 py-2 rounded-lg border border-black/10 bg-gray-50 focus:border-black focus:bg-white outline-none transition"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-semibold text-black/80">비밀번호</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="px-4 py-2 rounded-lg border border-black/10 bg-gray-50 focus:border-black focus:bg-white outline-none transition"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <div className="text-xs text-red-600 font-semibold mb-2">{error}</div>}
          <button
            type="submit"
            className="mt-4 w-full py-2 rounded-full bg-black text-white font-bold shadow hover:bg-gray-900 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className="text-xs text-center text-black/50 mt-2">
          아직 회원이 아니신가요? <a href="#" className="underline hover:text-black">회원가입</a>
        </div>
      </div>
    </section>
  );
};

export default LoginPage; 