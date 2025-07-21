import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO 점수 Checker - Awekers",
  description: "웹사이트 SEO 점수를 자동으로 분석하고 개선 방안을 제시합니다.",
  keywords: "SEO, 검색엔진최적화, 웹사이트분석, SEO점수, Core Web Vitals",
};

export default function SEOCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
} 