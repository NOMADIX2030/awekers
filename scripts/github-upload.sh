#!/bin/bash

# GitHub 업로드 스크립트
echo "🚀 GitHub 업로드 시작..."

# .env 파일에서 GitHub 정보 로드
source .env

# Git 상태 확인
echo "📋 Git 상태 확인 중..."
git status

# 변경사항 스테이징
echo "📦 변경사항 스테이징 중..."
git add .

# 커밋
echo "💾 커밋 중..."
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S') - Auto commit from script"

# 원격 저장소 확인
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 원격 저장소 설정 중..."
    git remote add origin https://github.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}.git
fi

# 메인 브랜치 설정
echo "🌿 브랜치 설정 중..."
git branch -M main

# GitHub에 푸시
echo "📤 GitHub에 푸시 중..."
git push -u origin main

echo "✅ GitHub 업로드 완료!"
echo "🌐 저장소 URL: https://github.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}" 