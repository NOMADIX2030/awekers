// 🛡️ 헤더 안전 관리 시스템
import fs from 'fs/promises';
import path from 'path';

export interface BackupMetadata {
  version: string;
  timestamp: string;
  description: string;
  filePaths: string[];
  checksum: string;
}

export interface SafetyReport {
  isSafe: boolean;
  checks: SafetyCheck[];
  recommendations: string[];
}

export interface SafetyCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class HeaderSafetyManager {
  private static backupDir = 'backups/header';
  private static currentVersion = '1.0.0-current';

  /**
   * 🚨 헤더 수정 전 필수 안전 체크
   */
  static async preUpdateSafetyCheck(): Promise<SafetyReport> {
    console.log('🔍 헤더 안전성 검사 시작...');
    
    const checks: SafetyCheck[] = [
      await this.checkLayoutFileIntegrity(),
      await this.checkAPIEndpoints(),
      await this.checkDatabaseConnection(),
      await this.checkEnvironmentVariables(),
      await this.checkDependencies(),
      await this.checkBackupSpace()
    ];

    const isSafe = checks.every(check => check.passed || check.severity === 'low');
    const recommendations = this.generateRecommendations(checks);

    return { isSafe, checks, recommendations };
  }

  /**
   * 📦 완전한 헤더 백업 생성
   */
  static async createFullBackup(description: string = '자동 백업'): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupVersion = `backup-${timestamp}`;
    const backupPath = path.join(this.backupDir, backupVersion);

    try {
      // 백업 디렉토리 생성
      await fs.mkdir(backupPath, { recursive: true });

      // 백업할 파일들
      const filesToBackup = [
        'src/app/layout.tsx',
        'src/app/globals.css',
        'src/lib/auth.ts',
        'src/app/api/menu/route.ts',
        'package.json',
        'prisma/schema.prisma'
      ];

      const backedUpFiles: string[] = [];

      for (const filePath of filesToBackup) {
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const backupFilePath = path.join(backupPath, filePath.replace(/\//g, '_'));
          await fs.writeFile(backupFilePath, content);
          backedUpFiles.push(filePath);
          console.log(`✅ 백업 완료: ${filePath}`);
        } catch (error) {
          console.warn(`⚠️ 백업 실패: ${filePath}`, error);
        }
      }

      // 메타데이터 생성
      const metadata: BackupMetadata = {
        version: backupVersion,
        timestamp,
        description,
        filePaths: backedUpFiles,
        checksum: await this.generateChecksum(backedUpFiles)
      };

      await fs.writeFile(
        path.join(backupPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      console.log(`🎯 백업 완료: ${backupVersion}`);
      return backupVersion;
    } catch (error) {
      console.error('❌ 백업 실패:', error);
      throw new Error(`백업 생성 실패: ${error}`);
    }
  }

  /**
   * 🔄 백업에서 복구
   */
  static async restoreFromBackup(backupVersion: string): Promise<void> {
    const backupPath = path.join(this.backupDir, backupVersion);
    
    try {
      // 메타데이터 읽기
      const metadataContent = await fs.readFile(
        path.join(backupPath, 'metadata.json'), 
        'utf-8'
      );
      const metadata: BackupMetadata = JSON.parse(metadataContent);

      console.log(`🔄 복구 시작: ${metadata.description} (${metadata.timestamp})`);

      // 현재 상태 백업 (복구 전)
      await this.createFullBackup(`복구 전 자동 백업 - ${new Date().toISOString()}`);

      // 파일별 복구
      for (const originalPath of metadata.filePaths) {
        const backupFilePath = path.join(backupPath, originalPath.replace(/\//g, '_'));
        try {
          const content = await fs.readFile(backupFilePath, 'utf-8');
          await fs.writeFile(originalPath, content);
          console.log(`✅ 복구 완료: ${originalPath}`);
        } catch (error) {
          console.error(`❌ 복구 실패: ${originalPath}`, error);
        }
      }

      console.log(`🎯 복구 완료: ${backupVersion}`);
    } catch (error) {
      console.error('❌ 복구 실패:', error);
      throw new Error(`복구 실패: ${error}`);
    }
  }

  /**
   * 📋 백업 목록 조회
   */
  static async listBackups(): Promise<BackupMetadata[]> {
    try {
      const backupDirs = await fs.readdir(this.backupDir);
      const backups: BackupMetadata[] = [];

      for (const dir of backupDirs) {
        try {
          const metadataPath = path.join(this.backupDir, dir, 'metadata.json');
          const content = await fs.readFile(metadataPath, 'utf-8');
          backups.push(JSON.parse(content));
        } catch {
          // 메타데이터가 없는 백업은 무시
        }
      }

      return backups.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch {
      return [];
    }
  }

  // Private helper methods
  private static async checkLayoutFileIntegrity(): Promise<SafetyCheck> {
    try {
      const content = await fs.readFile('src/app/layout.tsx', 'utf-8');
      const hasBasicStructure = content.includes('RootLayout') && 
                               content.includes('children') &&
                               content.includes('export default');
      
      return {
        name: 'Layout 파일 무결성',
        passed: hasBasicStructure,
        message: hasBasicStructure ? 
          'Layout 파일 구조 정상' : 
          'Layout 파일 구조에 문제가 있습니다',
        severity: hasBasicStructure ? 'low' : 'critical'
      };
    } catch {
      return {
        name: 'Layout 파일 무결성',
        passed: false,
        message: 'Layout 파일을 읽을 수 없습니다',
        severity: 'critical'
      };
    }
  }

  private static async checkAPIEndpoints(): Promise<SafetyCheck> {
    try {
      // 개발 서버에서 API 엔드포인트 확인
      const response = await fetch('http://localhost:3000/api/menu');
      const isWorking = response.status < 500;
      
      return {
        name: 'API 엔드포인트',
        passed: isWorking,
        message: isWorking ? 
          'API 엔드포인트 정상 동작' : 
          'API 엔드포인트에 문제가 있습니다',
        severity: isWorking ? 'low' : 'high'
      };
    } catch {
      return {
        name: 'API 엔드포인트',
        passed: false,
        message: '개발 서버가 실행되지 않았거나 API에 접근할 수 없습니다',
        severity: 'medium'
      };
    }
  }

  private static async checkDatabaseConnection(): Promise<SafetyCheck> {
    try {
      // Prisma 클라이언트로 DB 연결 확인
      const prismaModule = await import('@/lib/prisma');
      await prismaModule.default.$queryRaw`SELECT 1`;
      
      return {
        name: '데이터베이스 연결',
        passed: true,
        message: '데이터베이스 연결 정상',
        severity: 'low'
      };
    } catch {
      return {
        name: '데이터베이스 연결',
        passed: false,
        message: '데이터베이스에 연결할 수 없습니다',
        severity: 'high'
      };
    }
  }

  private static async checkEnvironmentVariables(): Promise<SafetyCheck> {
    const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    return {
      name: '환경 변수',
      passed: missingVars.length === 0,
      message: missingVars.length === 0 ?
        '필수 환경 변수 모두 설정됨' :
        `누락된 환경 변수: ${missingVars.join(', ')}`,
      severity: missingVars.length === 0 ? 'low' : 'high'
    };
  }

  private static async checkDependencies(): Promise<SafetyCheck> {
    try {
      const packageJson = JSON.parse(
        await fs.readFile('package.json', 'utf-8')
      );
      
      const criticalDeps = ['next', 'react', '@prisma/client'];
      const hasCriticalDeps = criticalDeps.every(dep => 
        packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
      );
      
      return {
        name: '의존성 패키지',
        passed: hasCriticalDeps,
        message: hasCriticalDeps ?
          '핵심 의존성 패키지 정상' :
          '일부 핵심 의존성이 누락되었습니다',
        severity: hasCriticalDeps ? 'low' : 'critical'
      };
    } catch {
      return {
        name: '의존성 패키지',
        passed: false,
        message: 'package.json을 읽을 수 없습니다',
        severity: 'critical'
      };
    }
  }

  private static async checkBackupSpace(): Promise<SafetyCheck> {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      
      return {
        name: '백업 공간',
        passed: true,
        message: '백업 디렉토리 사용 가능',
        severity: 'low'
      };
    } catch {
      return {
        name: '백업 공간',
        passed: false,
        message: '백업 디렉토리를 생성할 수 없습니다',
        severity: 'high'
      };
    }
  }

  private static generateRecommendations(checks: SafetyCheck[]): string[] {
    const recommendations: string[] = [];
    
    const criticalIssues = checks.filter(c => !c.passed && c.severity === 'critical');
    const highIssues = checks.filter(c => !c.passed && c.severity === 'high');
    
    if (criticalIssues.length > 0) {
      recommendations.push('🚨 중요: 치명적 문제를 먼저 해결해야 합니다');
      criticalIssues.forEach(issue => {
        recommendations.push(`   - ${issue.message}`);
      });
    }
    
    if (highIssues.length > 0) {
      recommendations.push('⚠️ 주의: 다음 문제들을 해결하는 것을 권장합니다');
      highIssues.forEach(issue => {
        recommendations.push(`   - ${issue.message}`);
      });
    }
    
    if (criticalIssues.length === 0 && highIssues.length === 0) {
      recommendations.push('✅ 모든 안전 검사 통과! 안전하게 진행할 수 있습니다');
    }
    
    return recommendations;
  }

  private static async generateChecksum(filePaths: string[]): Promise<string> {
    // 간단한 체크섬 생성 (실제로는 crypto 모듈 사용 권장)
    const timestamp = Date.now().toString();
    const pathsHash = filePaths.join('').length.toString();
    return `${timestamp}-${pathsHash}`;
  }
} 