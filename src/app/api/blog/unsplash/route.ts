import { NextRequest, NextResponse } from 'next/server';

// POST /api/blog/unsplash
export async function POST(req: NextRequest) {
  const { tag, title } = await req.json();

  // 태그 분리
  const tags = (tag || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  let images: string[] = [];

  if (tags.length > 0) {
    // 태그가 있을 때: 각 태그별로 6개씩 검색
    for (let i = 0; i < tags.length; i++) {
      const t: string = tags[i];
      if (!t) continue;
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(t)}&client_id=${accessKey}&per_page=6`;
      const res = await fetch(url);
      const data = await res.json();
      images = images.concat((data.results || []).map((item: any) => item.urls.small));
    }
  } else if (title && title.trim()) {
    // 태그가 없을 때: 제목 기반으로 18개 검색
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(title)}&client_id=${accessKey}&per_page=18`;
    const res = await fetch(url);
    const data = await res.json();
    images = (data.results || []).map((item: any) => item.urls.small);
  }

  // 중복 제거
  images = Array.from(new Set(images));

  return NextResponse.json({ images });
} 