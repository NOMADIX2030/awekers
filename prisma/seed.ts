import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  console.log('시드 데이터 시작...');

  // 기존 하위메뉴 데이터 삭제 (선택사항)
  await prisma.subMenu.deleteMany({});
  
  // 기존 메뉴 데이터 삭제 (선택사항)
  await prisma.menu.deleteMany({});

  // 메뉴 데이터 추가
  const menuData = [
    {
      label: "검색엔진최적화",
      href: "/tag/SEO",
      order: 1,
      isActive: true
    },
    {
      label: "홈페이지 제작",
      href: "/tag/홈페이지제작",
      order: 2,
      isActive: true
    },
    {
      label: "AI답변 최적화",
      href: "/tag/AI답변최적화",
      order: 3,
      isActive: true
    },
    {
      label: "AI앱 개발",
      href: "/tag/AI앱개발",
      order: 4,
      isActive: true
    },
    {
      label: "서비스",
      href: "/services",
      order: 5,
      isActive: true
    },
    {
      label: "블로그",
      href: "/blog",
      order: 6,
      isActive: true
    },
    {
      label: "문의하기",
      href: "/inquiry",
      order: 7,
      isActive: true
    }
  ];

  const createdMenus = [];
  for (const menu of menuData) {
    const createdMenu = await prisma.menu.create({
      data: menu
    });
    createdMenus.push(createdMenu);
    console.log(`메뉴 생성됨: ${menu.label}`);
  }

  // 하위메뉴 데이터 추가
  const subMenuData = [
    // 검색엔진최적화 하위메뉴
    {
      parentMenuId: createdMenus[0].id, // 검색엔진최적화
      label: "포트폴리오",
      href: "/tag/포트폴리오",
      icon: "📁",
      order: 1,
      isActive: true
    },
    {
      parentMenuId: createdMenus[0].id,
      label: "검색엔진최적화 소개",
      href: "/tag/SEO소개",
      icon: "🔍",
      order: 2,
      isActive: true
    },
    {
      parentMenuId: createdMenus[0].id,
      label: "검색엔진최적화 진행과정",
      href: "/tag/SEO진행과정",
      icon: "🔄",
      order: 3,
      isActive: true
    },
    {
      parentMenuId: createdMenus[0].id,
      label: "검색엔진최적화 적용효과",
      href: "/tag/SEO효과",
      icon: "📈",
      order: 4,
      isActive: true
    },
    {
      parentMenuId: createdMenus[0].id,
      label: "검색엔진최적화란?",
      href: "/tag/SEO정의",
      icon: "❓",
      order: 5,
      isActive: true
    },

    // 홈페이지 제작 하위메뉴
    {
      parentMenuId: createdMenus[1].id, // 홈페이지 제작
      label: "포트폴리오",
      href: "/tag/포트폴리오",
      icon: "📁",
      order: 1,
      isActive: true
    },
    {
      parentMenuId: createdMenus[1].id,
      label: "홈페이지 제작방법",
      href: "/tag/홈페이지제작방법",
      icon: "⚙️",
      order: 2,
      isActive: true
    },
    {
      parentMenuId: createdMenus[1].id,
      label: "홈페이지 제작혜택",
      href: "/tag/홈페이지제작혜택",
      icon: "📦",
      order: 3,
      isActive: true
    },
    {
      parentMenuId: createdMenus[1].id,
      label: "홈페이지 제작과정",
      href: "/tag/홈페이지제작과정",
      icon: "🔄",
      order: 4,
      isActive: true
    },

    // 서비스 하위메뉴
    {
      parentMenuId: createdMenus[4].id, // 서비스
      label: "SEO 점수 Checker",
      href: "/seo-checker",
      icon: "🔍",
      order: 1,
      isActive: true
    },
    {
      parentMenuId: createdMenus[4].id,
      label: "웹사이트 분석",
      href: "/website-analysis",
      icon: "📊",
      order: 2,
      isActive: true
    },
    {
      parentMenuId: createdMenus[4].id,
      label: "성능 최적화",
      href: "/performance-optimization",
      icon: "⚡",
      order: 3,
      isActive: true
    },
    {
      parentMenuId: createdMenus[4].id,
      label: "SEO 컨설팅",
      href: "/seo-consulting",
      icon: "💼",
      order: 4,
      isActive: true
    }
  ];

  for (const subMenu of subMenuData) {
    await prisma.subMenu.create({
      data: subMenu
    });
    console.log(`하위메뉴 생성됨: ${subMenu.label}`);
  }

  console.log('시드 데이터 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 