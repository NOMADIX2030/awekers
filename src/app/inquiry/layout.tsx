import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의하기 | AWEKERS - 전문 IT 솔루션 상담',
  description: 'AWEKERS의 전문 IT 서비스에 대해 문의하세요. SEO, AI 솔루션, 웹 개발까지 맞춤형 상담을 제공합니다. 24시간 내 빠른 응답 보장.',
  keywords: ['문의하기', 'IT 상담', 'SEO 문의', 'AI 솔루션', '웹 개발 상담', 'AWEKERS', '맞춤형 상담', 'IT 솔루션', '디지털 마케팅'],
  
  // Open Graph
  openGraph: {
    title: '문의하기 | AWEKERS - 전문 IT 솔루션 상담',
    description: 'AWEKERS의 전문 IT 서비스에 대해 문의하세요. SEO, AI 솔루션, 웹 개발까지 맞춤형 상담을 제공합니다.',
    type: 'website',
    locale: 'ko_KR',
    url: 'https://awekers.com/inquiry',
    siteName: 'AWEKERS',
    images: [
      {
        url: '/og-inquiry.jpg',
        width: 1200,
        height: 630,
        alt: 'AWEKERS 문의하기 - 전문 IT 솔루션 상담',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: '문의하기 | AWEKERS - 전문 IT 솔루션 상담',
    description: 'AWEKERS의 전문 IT 서비스에 대해 문의하세요. 24시간 내 빠른 응답 보장.',
    images: ['/twitter-inquiry.jpg'],
    creator: '@awekers',
    site: '@awekers',
  },

  // 추가 메타 태그
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || '',
    },
  },

  alternates: {
    canonical: 'https://awekers.com/inquiry',
    languages: {
      'ko-KR': 'https://awekers.com/inquiry',
    },
  },

  category: 'technology',
  classification: 'Business',
};

export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": "https://awekers.com/inquiry#webpage",
                "url": "https://awekers.com/inquiry",
                "name": "문의하기 | AWEKERS - 전문 IT 솔루션 상담",
                "isPartOf": {
                  "@id": "https://awekers.com#website"
                },
                "about": {
                  "@id": "https://awekers.com#organization"
                },
                "primaryImageOfPage": {
                  "@id": "https://awekers.com/inquiry#primaryimage"
                },
                "description": "AWEKERS의 전문 IT 서비스에 대해 문의하세요. SEO, AI 솔루션, 웹 개발까지 맞춤형 상담을 제공합니다.",
                "breadcrumb": {
                  "@id": "https://awekers.com/inquiry#breadcrumb"
                },
                "inLanguage": "ko-KR",
                "potentialAction": [
                  {
                    "@type": "ReadAction",
                    "target": ["https://awekers.com/inquiry"]
                  }
                ]
              },
              {
                "@type": "ContactPage",
                "@id": "https://awekers.com/inquiry#contactpage",
                "url": "https://awekers.com/inquiry",
                "name": "AWEKERS 문의하기",
                "description": "전문 IT 솔루션 상담 및 문의 페이지",
                "mainEntity": {
                  "@type": "Organization",
                  "@id": "https://awekers.com#organization"
                }
              },
              {
                "@type": "BreadcrumbList",
                "@id": "https://awekers.com/inquiry#breadcrumb",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "홈",
                    "item": "https://awekers.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "문의하기",
                    "item": "https://awekers.com/inquiry"
                  }
                ]
              },
              {
                "@type": "Organization",
                "@id": "https://awekers.com#organization",
                "name": "AWEKERS",
                "alternateName": "어웨이커스",
                "url": "https://awekers.com",
                "logo": {
                  "@type": "ImageObject",
                  "@id": "https://awekers.com#logo",
                  "inLanguage": "ko-KR",
                  "url": "https://awekers.com/logo.png",
                  "contentUrl": "https://awekers.com/logo.png",
                  "width": 512,
                  "height": 512,
                  "caption": "AWEKERS"
                },
                "image": {
                  "@id": "https://awekers.com#logo"
                },
                "description": "SEO, AI 솔루션, 웹 개발 전문 IT 솔루션 회사",
                "founder": {
                  "@type": "Person",
                  "name": "AWEKERS 팀"
                },
                "foundingDate": "2024",
                "slogan": "웹앱개발과 마케팅 서비스를 제공하는 IT 솔루션 회사",
                "knowsAbout": [
                  "검색엔진최적화 (SEO)",
                  "AI 블로그 자동화",
                  "AI 챗봇 개발",
                  "홈페이지 제작",
                  "AI 자동화 솔루션",
                  "AI 데이터베이스"
                ],
                "contactPoint": [
                  {
                    "@type": "ContactPoint",
                    "telephone": "+82-2-1234-5678",
                    "contactType": "customer service",
                    "availableLanguage": ["Korean"],
                    "areaServed": "KR"
                  }
                ],
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "KR",
                  "addressLocality": "서울특별시"
                },
                "sameAs": [
                  "https://www.facebook.com/awekers",
                  "https://www.instagram.com/awekers",
                  "https://www.linkedin.com/company/awekers"
                ]
              },
              {
                "@type": "Service",
                "@id": "https://awekers.com/inquiry#service",
                "name": "IT 솔루션 상담 서비스",
                "description": "SEO, AI 솔루션, 웹 개발 등 전문 IT 상담을 제공합니다",
                "provider": {
                  "@id": "https://awekers.com#organization"
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "대한민국"
                },
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "IT 솔루션 서비스",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "SEO 캠페인"
                      }
                    },
                    {
                      "@type": "Offer", 
                      "itemOffered": {
                        "@type": "Service",
                        "name": "AI 블로그"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service", 
                        "name": "AI 챗봇"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "홈페이지 제작"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "AI 자동화"
                      }
                    },
                    {
                      "@type": "Offer", 
                      "itemOffered": {
                        "@type": "Service",
                        "name": "AI 데이터베이스"
                      }
                    }
                  ]
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
} 