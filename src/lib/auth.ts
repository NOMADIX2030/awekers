import { NextRequest } from 'next/server';

export enum UserRole {
  GUEST = 'GUEST',   // 일반방문자 (비로그인)
  USER = 'USER',     // 일반회원 (로그인)
  ADMIN = 'ADMIN'    // 관리자
}

export enum VisibilityLevel {
  GUEST = 'GUEST',
  USER = 'USER', 
  ADMIN = 'ADMIN'
}

// 권한 레벨 순서 (높은 권한이 낮은 권한의 메뉴도 볼 수 있음)
const PERMISSION_HIERARCHY = {
  [UserRole.GUEST]: 0,
  [UserRole.USER]: 1,
  [UserRole.ADMIN]: 2
};

/**
 * 사용자 권한을 확인합니다
 * @param request NextRequest 객체 (쿠키/헤더에서 권한 정보 추출)
 * @returns UserRole
 */
export function getUserRole(request?: NextRequest): UserRole {
  if (!request) {
    return UserRole.GUEST;
  }

  try {
    // 쿠키에서 로그인 상태 확인
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
    const isAdmin = request.cookies.get('isAdmin')?.value === 'true';

    if (isAdmin && isLoggedIn) {
      return UserRole.ADMIN;
    } else if (isLoggedIn) {
      return UserRole.USER;
    } else {
      return UserRole.GUEST;
    }
  } catch (error) {
    console.error('권한 확인 오류:', error);
    return UserRole.GUEST;
  }
}

/**
 * 클라이언트 사이드에서 사용자 권한을 확인합니다
 * @returns UserRole
 */
export function getClientUserRole(): UserRole {
  if (typeof window === 'undefined') {
    return UserRole.GUEST;
  }

  try {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (isAdmin && isLoggedIn) {
      return UserRole.ADMIN;
    } else if (isLoggedIn) {
      return UserRole.USER;
    } else {
      return UserRole.GUEST;
    }
  } catch (error) {
    console.error('클라이언트 권한 확인 오류:', error);
    return UserRole.GUEST;
  }
}

/**
 * 사용자가 특정 권한 레벨의 메뉴를 볼 수 있는지 확인합니다
 * @param userRole 사용자 권한
 * @param requiredLevel 필요한 권한 레벨
 * @returns boolean
 */
export function canAccessMenu(userRole: UserRole, requiredLevel: VisibilityLevel): boolean {
  const userLevel = PERMISSION_HIERARCHY[userRole];
  const requiredLevelValue = PERMISSION_HIERARCHY[requiredLevel as UserRole];
  
  return userLevel >= requiredLevelValue;
}

/**
 * 권한 레벨을 한국어로 변환합니다
 * @param level VisibilityLevel
 * @returns string
 */
export function getVisibilityLevelLabel(level: VisibilityLevel): string {
  switch (level) {
    case VisibilityLevel.GUEST:
      return '일반방문자';
    case VisibilityLevel.USER:
      return '일반회원';
    case VisibilityLevel.ADMIN:
      return '관리자';
    default:
      return '일반방문자';
  }
} 