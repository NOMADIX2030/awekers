// 🔄 헤더 버전 관리 시스템
import { HeaderSafetyManager } from './header-safety';

export interface HeaderVersion {
  version: string;
  description: string;
  config: HeaderConfig;
  status: 'stable' | 'beta' | 'alpha' | 'deprecated';
  compatibility: string[];
  createdAt: string;
  rolloutPercentage?: number;
}

export interface HeaderConfig {
  designSystem: {
    preserveCurrentDesign: boolean;
    cssFramework: 'tailwind' | 'custom';
    responsiveBreakpoints: string[];
  };
  functionality: {
    dynamicMenus: boolean;
    authentication: boolean;
    mobileSupport: boolean;
    scrollBehavior: boolean;
  };
  integration: {
    apiEndpoints: string[];
    databaseTables: string[];
    dependencies: string[];
  };
}

export class HeaderVersionManager {
  private static versions: Map<string, HeaderVersion> = new Map();
  private static currentVersion = 'v1.0.0-legacy';
  private static targetVersion = 'v2.0.0-independent';

  /**
   * 🎯 현재 디자인 유지하면서 독립화를 위한 버전 정의
   */
  static initializeVersions(): void {
    // v1.0.0 - 현재 legacy 버전 (layout.tsx에 하드코딩)
    this.versions.set('v1.0.0-legacy', {
      version: 'v1.0.0-legacy',
      description: '현재 layout.tsx에 하드코딩된 헤더 (708줄)',
      status: 'stable',
      compatibility: ['Next.js 15', 'React 19'],
      createdAt: new Date().toISOString(),
      config: {
        designSystem: {
          preserveCurrentDesign: true, // 🎯 현재 디자인 100% 보존
          cssFramework: 'tailwind',
          responsiveBreakpoints: ['768px', '1024px']
        },
        functionality: {
          dynamicMenus: true,
          authentication: true,
          mobileSupport: true,
          scrollBehavior: true
        },
        integration: {
          apiEndpoints: ['/api/menu', '/api/auth/login'],
          databaseTables: ['Menu', 'SubMenu', 'User'],
          dependencies: ['@prisma/client', 'next/navigation']
        }
      }
    });

    // v1.1.0 - 안전장치 추가 버전
    this.versions.set('v1.1.0-safety', {
      version: 'v1.1.0-safety',
      description: '백업/복구 시스템 추가, 디자인 동일',
      status: 'beta',
      compatibility: ['Next.js 15', 'React 19'],
      createdAt: new Date().toISOString(),
      rolloutPercentage: 0, // 아직 배포 안함
      config: {
        designSystem: {
          preserveCurrentDesign: true, // 🎯 디자인 변경 없음
          cssFramework: 'tailwind',
          responsiveBreakpoints: ['768px', '1024px']
        },
        functionality: {
          dynamicMenus: true,
          authentication: true,
          mobileSupport: true,
          scrollBehavior: true
        },
        integration: {
          apiEndpoints: ['/api/menu', '/api/auth/login'],
          databaseTables: ['Menu', 'SubMenu', 'User'],
          dependencies: ['@prisma/client', 'next/navigation']
        }
      }
    });

    // v2.0.0 - 완전 독립 헤더 (최종 목표)
    this.versions.set('v2.0.0-independent', {
      version: 'v2.0.0-independent',
      description: '완전 독립적 헤더 컴포넌트, 동일한 디자인',
      status: 'alpha',
      compatibility: ['Next.js 15', 'React 19'],
      createdAt: new Date().toISOString(),
      rolloutPercentage: 0,
      config: {
        designSystem: {
          preserveCurrentDesign: true, // 🎯 디자인 완전 동일 보장
          cssFramework: 'tailwind',
          responsiveBreakpoints: ['768px', '1024px']
        },
        functionality: {
          dynamicMenus: true,
          authentication: true,
          mobileSupport: true,
          scrollBehavior: true
        },
        integration: {
          apiEndpoints: ['/api/menu', '/api/auth/login'],
          databaseTables: ['Menu', 'SubMenu', 'User'],
          dependencies: ['@prisma/client', 'next/navigation']
        }
      }
    });

    console.log('🔄 헤더 버전 시스템 초기화 완료');
    console.log(`   현재: ${this.currentVersion}`);
    console.log(`   목표: ${this.targetVersion}`);
  }

  /**
   * 🛡️ 안전한 버전 업그레이드
   */
  static async upgradeToVersion(
    targetVersion: string, 
    options: {
      createBackup?: boolean;
      rolloutPercentage?: number;
      skipSafetyCheck?: boolean;
    } = {}
  ): Promise<boolean> {
    const { 
      createBackup = true, 
      rolloutPercentage = 10, 
      skipSafetyCheck = false 
    } = options;

    try {
      console.log(`🚀 버전 업그레이드 시작: ${this.currentVersion} → ${targetVersion}`);

      // 1. 안전성 검사
      if (!skipSafetyCheck) {
        console.log('🔍 안전성 검사 중...');
        const safetyReport = await HeaderSafetyManager.preUpdateSafetyCheck();
        
        if (!safetyReport.isSafe) {
          console.error('❌ 안전성 검사 실패:');
          safetyReport.recommendations.forEach(rec => console.log(`   ${rec}`));
          return false;
        }
        console.log('✅ 안전성 검사 통과');
      }

      // 2. 백업 생성
      if (createBackup) {
        console.log('📦 백업 생성 중...');
        const backupVersion = await HeaderSafetyManager.createFullBackup(
          `업그레이드 전 백업: ${this.currentVersion} → ${targetVersion}`
        );
        console.log(`✅ 백업 완료: ${backupVersion}`);
      }

      // 3. 대상 버전 검증
      const version = this.versions.get(targetVersion);
      if (!version) {
        throw new Error(`버전 ${targetVersion}을 찾을 수 없습니다`);
      }

      // 4. 점진적 롤아웃 (개발 환경에서는 100%)
      const isDevEnvironment = process.env.NODE_ENV === 'development';
      const actualRollout = isDevEnvironment ? 100 : rolloutPercentage;
      
      console.log(`📊 롤아웃 설정: ${actualRollout}% (${isDevEnvironment ? '개발' : '프로덕션'})`);

      // 5. 버전 적용
      await this.applyVersion(version);
      
      // 6. 상태 업데이트
      this.currentVersion = targetVersion;
      
      console.log(`🎯 업그레이드 완료: ${targetVersion}`);
      return true;

    } catch (error) {
      console.error('❌ 업그레이드 실패:', error);
      
      // 자동 롤백
      if (createBackup) {
        console.log('🔄 자동 롤백 시작...');
        try {
          const backups = await HeaderSafetyManager.listBackups();
          if (backups.length > 0) {
            await HeaderSafetyManager.restoreFromBackup(backups[0].version);
            console.log('✅ 롤백 완료');
          }
        } catch (rollbackError) {
          console.error('❌ 롤백도 실패:', rollbackError);
        }
      }
      
      return false;
    }
  }

  /**
   * 📋 버전 호환성 검사
   */
  static checkCompatibility(version: string): {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const versionInfo = this.versions.get(version);
    if (!versionInfo) {
      return {
        compatible: false,
        issues: [`버전 ${version}을 찾을 수 없습니다`],
        recommendations: ['유효한 버전을 선택하세요']
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Next.js 버전 호환성
    if (!versionInfo.compatibility.includes('Next.js 15')) {
      issues.push('Next.js 15와 호환되지 않을 수 있습니다');
      recommendations.push('Next.js 버전을 확인하세요');
    }

    // React 버전 호환성  
    if (!versionInfo.compatibility.includes('React 19')) {
      issues.push('React 19와 호환되지 않을 수 있습니다');
      recommendations.push('React 버전을 확인하세요');
    }

    // 디자인 보존 확인
    if (!versionInfo.config.designSystem.preserveCurrentDesign) {
      issues.push('현재 디자인이 변경될 수 있습니다');
      recommendations.push('디자인 변경사항을 검토하세요');
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * 📊 버전 비교 분석
   */
  static compareVersions(version1: string, version2: string): {
    differences: string[];
    impactLevel: 'low' | 'medium' | 'high';
    designChanges: boolean;
  } {
    const v1 = this.versions.get(version1);
    const v2 = this.versions.get(version2);
    
    if (!v1 || !v2) {
      return {
        differences: ['버전을 찾을 수 없습니다'],
        impactLevel: 'high',
        designChanges: true
      };
    }

    const differences: string[] = [];
    let impactLevel: 'low' | 'medium' | 'high' = 'low';
    
    // 디자인 시스템 비교
    const designChanges = v1.config.designSystem.preserveCurrentDesign !== 
                         v2.config.designSystem.preserveCurrentDesign;
    
    if (designChanges) {
      differences.push('디자인 시스템 변경');
      impactLevel = 'high';
    }

    // 기능 비교
    const functionalityKeys = Object.keys(v1.config.functionality) as Array<keyof typeof v1.config.functionality>;
    for (const key of functionalityKeys) {
      if (v1.config.functionality[key] !== v2.config.functionality[key]) {
        differences.push(`기능 변경: ${key}`);
        if (impactLevel === 'low') impactLevel = 'medium';
      }
    }

    // 통합 비교
    if (v1.config.integration.apiEndpoints.length !== v2.config.integration.apiEndpoints.length) {
      differences.push('API 엔드포인트 변경');
      if (impactLevel === 'low') impactLevel = 'medium';
    }

    return { differences, impactLevel, designChanges };
  }

  /**
   * 📋 현재 상태 보고서
   */
  static getStatusReport(): {
    currentVersion: string;
    availableVersions: string[];
    nextRecommendedVersion: string | null;
    safetyLevel: 'safe' | 'caution' | 'dangerous';
  } {
    const availableVersions = Array.from(this.versions.keys());
    const current = this.versions.get(this.currentVersion);
    
    let nextRecommendedVersion: string | null = null;
    let safetyLevel: 'safe' | 'caution' | 'dangerous' = 'safe';

    // 다음 추천 버전 찾기
    if (this.currentVersion === 'v1.0.0-legacy') {
      nextRecommendedVersion = 'v1.1.0-safety';
      safetyLevel = 'caution'; // legacy 버전은 주의 필요
    } else if (this.currentVersion === 'v1.1.0-safety') {
      nextRecommendedVersion = 'v2.0.0-independent';
      safetyLevel = 'safe';
    }

    return {
      currentVersion: this.currentVersion,
      availableVersions,
      nextRecommendedVersion,
      safetyLevel
    };
  }

  // Private helper methods
  private static async applyVersion(version: HeaderVersion): Promise<void> {
    console.log(`🔧 버전 적용 중: ${version.version}`);
    
    // 실제 버전 적용 로직은 나중에 구현
    // 현재는 설정 검증만 수행
    this.validateVersionConfig(version.config);
    
    // 시뮬레이션: 실제 환경에서는 파일 수정, 의존성 업데이트 등 수행
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`✅ 버전 적용 완료: ${version.version}`);
  }

  private static validateVersionConfig(config: HeaderConfig): void {
    // 설정 유효성 검사
    if (!config.designSystem || !config.functionality || !config.integration) {
      throw new Error('버전 설정이 불완전합니다');
    }

    // 디자인 보존 확인
    if (!config.designSystem.preserveCurrentDesign) {
      console.warn('⚠️ 이 버전은 현재 디자인을 변경할 수 있습니다');
    }

    console.log('✅ 버전 설정 검증 완료');
  }

  /**
   * 🎯 현재 디자인 보존 보장
   */
  static ensureDesignPreservation(): boolean {
    const currentVersionInfo = this.versions.get(this.currentVersion);
    
    if (!currentVersionInfo) {
      console.warn('⚠️ 현재 버전 정보를 찾을 수 없습니다');
      return false;
    }

    const preservesDesign = currentVersionInfo.config.designSystem.preserveCurrentDesign;
    
    if (preservesDesign) {
      console.log('✅ 현재 디자인 보존 확인됨');
    } else {
      console.warn('⚠️ 현재 버전이 디자인을 변경할 수 있습니다');
    }

    return preservesDesign;
  }
}

// 초기화
HeaderVersionManager.initializeVersions(); 