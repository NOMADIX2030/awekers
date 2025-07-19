#!/bin/bash

# 버전 관리 스크립트
# 사용법: ./scripts/version.sh [major|minor|patch]

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 버전 가져오기
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}현재 버전: ${CURRENT_VERSION}${NC}"

# 버전 타입 확인
if [ -z "$1" ]; then
    echo -e "${RED}사용법: $0 [major|minor|patch]${NC}"
    echo -e "${YELLOW}예시: $0 patch${NC}"
    exit 1
fi

VERSION_TYPE=$1

# 새 버전 계산
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

case $VERSION_TYPE in
    "major")
        NEW_MAJOR=$((MAJOR + 1))
        NEW_VERSION="${NEW_MAJOR}.0.0"
        ;;
    "minor")
        NEW_MINOR=$((MINOR + 1))
        NEW_VERSION="${MAJOR}.${NEW_MINOR}.0"
        ;;
    "patch")
        NEW_PATCH=$((PATCH + 1))
        NEW_VERSION="${MAJOR}.${MINOR}.${NEW_PATCH}"
        ;;
    *)
        echo -e "${RED}잘못된 버전 타입: $VERSION_TYPE${NC}"
        echo -e "${YELLOW}사용 가능한 타입: major, minor, patch${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}새 버전: ${NEW_VERSION}${NC}"

# 베타 버전 표시
if [[ "${NEW_VERSION}" == "0.1.0" ]]; then
    echo -e "${YELLOW}베타 버전: AWEKERS SEO AI BLOG APP 초기 기반 모델${NC}"
fi

# 사용자 확인
read -p "버전을 ${NEW_VERSION}로 업데이트하시겠습니까? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}버전 업데이트가 취소되었습니다.${NC}"
    exit 1
fi

# package.json 버전 업데이트
echo -e "${BLUE}package.json 버전 업데이트 중...${NC}"
npm version $NEW_VERSION --no-git-tag-version

# CHANGELOG.md에 새 버전 섹션 추가
echo -e "${BLUE}CHANGELOG.md 업데이트 중...${NC}"
TODAY=$(date +%Y-%m-%d)

# CHANGELOG.md 파일의 [Unreleased] 섹션을 새 버전으로 변경
sed -i.bak "s/## \[Unreleased\]/## [Unreleased]\n\n## [${NEW_VERSION}] - ${TODAY}\n\n### Added\n- 새로운 기능들\n\n### Changed\n- 기존 기능 변경사항\n\n### Fixed\n- 버그 수정사항\n\n## [${CURRENT_VERSION}]/" CHANGELOG.md

# 백업 파일 삭제
rm -f CHANGELOG.md.bak

# Git 커밋
echo -e "${BLUE}Git 커밋 중...${NC}"
git add package.json CHANGELOG.md
git commit -m "Bump version to ${NEW_VERSION}"

# Git 태그 생성
echo -e "${BLUE}Git 태그 생성 중...${NC}"
git tag "v${NEW_VERSION}"

echo -e "${GREEN}✅ 버전 ${NEW_VERSION}로 성공적으로 업데이트되었습니다!${NC}"
echo -e "${YELLOW}다음 단계:${NC}"
echo -e "  git push origin main"
echo -e "  git push origin v${NEW_VERSION}" 