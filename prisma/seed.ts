import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // 기존 댓글 데이터 삭제 (새로운 스키마와 호환되지 않음)
  console.log('기존 댓글 데이터를 삭제합니다...');
  await prisma.comment.deleteMany({});
  console.log('기존 댓글 데이터 삭제 완료');

  // 관리자 계정 생성
  const adminId = process.env.ADMIN_ID;
  const adminPass = process.env.ADMIN_PASS;
  if (adminId && adminPass) {
    const exists = await prisma.user.findUnique({ where: { email: adminId } });
    if (!exists) {
      const hash = await bcrypt.hash(adminPass, 10);
      await prisma.user.create({
        data: {
          email: adminId,
          password: hash,
          isAdmin: true,
        },
      });
      console.log('관리자 계정이 생성되었습니다:', adminId);
    } else {
      console.log('관리자 계정이 이미 존재합니다:', adminId);
    }
  } else {
    console.log('ADMIN_ID, ADMIN_PASS 환경변수를 .env에 설정하세요.');
  }

  // 일반 사용자 계정 생성 (테스트용)
  const testUserEmail = 'user@example.com';
  const testUserPass = 'password123';
  const testUserExists = await prisma.user.findUnique({ where: { email: testUserEmail } });
  if (!testUserExists) {
    const hash = await bcrypt.hash(testUserPass, 10);
    await prisma.user.create({
      data: {
        email: testUserEmail,
        password: hash,
        isAdmin: false,
      },
    });
    console.log('테스트 사용자 계정이 생성되었습니다:', testUserEmail);
  } else {
    console.log('테스트 사용자 계정이 이미 존재합니다:', testUserEmail);
  }

  await prisma.blog.createMany({
    data: [
      {
        title: "Next.js로 만드는 트렌디한 웹사이트",
        summary: "최신 Next.js와 TailwindCSS로 빠르고 세련된 웹사이트를 만드는 방법을 소개합니다.",
        content: `Next.js와 TailwindCSS를 활용하면 빠르고 트렌디한 웹사이트를 손쉽게 만들 수 있습니다.\n\n1. 프로젝트 초기화\n2. 컴포넌트 설계\n3. 반응형 스타일 적용\n4. 배포까지 한 번에!`,
        tag: "Next.js",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
        date: new Date("2024-07-01"),
      },
      {
        title: "디자인 시스템 구축 가이드",
        summary: "일관된 UI/UX를 위한 디자인 시스템 설계와 도입 노하우를 공유합니다.",
        content: `디자인 시스템은 일관된 UI/UX를 제공하는 핵심입니다.\n\n- 컴포넌트 재사용\n- 컬러/타이포/스페이싱 토큰 관리\n- 문서화와 협업 프로세스 정립`,
        tag: "Design",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        date: new Date("2024-06-25"),
      },
      {
        title: "프론트엔드 개발 생산성 툴 TOP 5",
        summary: "개발 속도를 높여주는 필수 프론트엔드 툴과 활용법을 정리했습니다.",
        content: `생산성을 높여주는 툴\n\n1. VSCode\n2. Figma\n3. Storybook\n4. GitHub Copilot\n5. Prettier/ESLint`,
        tag: "Productivity",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
        date: new Date("2024-06-20"),
      },
      {
        title: "AI와 웹개발의 미래",
        summary: "AI 기술이 웹개발에 미치는 영향과 앞으로의 트렌드를 전망합니다.",
        content: `AI는 웹개발의 많은 부분을 자동화하고 있습니다.\n\n- 코드 생성\n- 디자인 자동화\n- 사용자 맞춤형 경험\n\n앞으로의 웹은 AI와 더욱 밀접하게 연결될 것입니다.`,
        tag: "AI",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
        date: new Date("2024-06-10"),
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 