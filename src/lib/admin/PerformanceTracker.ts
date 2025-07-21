// 📊 성능 추적 유틸리티 (싱글톤)
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private activeTracking = new Map<string, { startTime: number; name: string }>();
  private completedTracking = new Map<string, { duration: number; metadata?: any }>();

  private constructor() {}

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  // 🚀 성능 추적 시작
  start(name: string): string {
    const trackingId = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.activeTracking.set(trackingId, {
      startTime: performance.now(),
      name
    });
    
    return trackingId;
  }

  // 🎯 성능 추적 종료
  end(trackingId: string, metadata?: any): number {
    const tracking = this.activeTracking.get(trackingId);
    
    if (!tracking) {
      console.warn(`⚠️ 추적 ID를 찾을 수 없습니다: ${trackingId}`);
      return 0;
    }

    const duration = performance.now() - tracking.startTime;
    
    // 완료된 추적에 저장
    this.completedTracking.set(trackingId, {
      duration,
      metadata
    });
    
    // 활성 추적에서 제거
    this.activeTracking.delete(trackingId);
    
    // 느린 작업 경고
    if (duration > 1000) {
      console.warn(`🐌 느린 작업 감지: ${tracking.name} - ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  // ⚡ 간단한 시간 측정
  getTime(trackingId: string): string {
    const completed = this.completedTracking.get(trackingId);
    const active = this.activeTracking.get(trackingId);
    
    if (completed) {
      return `${completed.duration.toFixed(2)}ms`;
    }
    
    if (active) {
      const currentDuration = performance.now() - active.startTime;
      return `${currentDuration.toFixed(2)}ms (진행중)`;
    }
    
    return '0ms';
  }

  // 📊 통계 조회
  getStats() {
    const stats = {
      active: this.activeTracking.size,
      completed: this.completedTracking.size,
      averageDuration: 0,
      slowQueries: [] as Array<{ name: string; duration: number }>
    };

    // 평균 시간 계산
    const durations = Array.from(this.completedTracking.values()).map(t => t.duration);
    if (durations.length > 0) {
      stats.averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    }

    // 느린 쿼리 찾기 (상위 10개)
    const slowQueries = Array.from(this.completedTracking.entries())
      .filter(([id, data]) => data.duration > 100)
      .map(([id, data]) => {
        const tracking = this.activeTracking.get(id);
        return {
          name: tracking?.name || 'unknown',
          duration: data.duration
        };
      })
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    stats.slowQueries = slowQueries;

    return stats;
  }

  // 🧹 오래된 추적 데이터 정리
  cleanup(maxAge: number = 3600000): void { // 기본 1시간
    const cutoff = Date.now() - maxAge;
    
    // 완료된 추적 정리
    for (const [id, data] of this.completedTracking.entries()) {
      const timestamp = parseInt(id.split('_')[1]);
      if (timestamp < cutoff) {
        this.completedTracking.delete(id);
      }
    }

    // 오래된 활성 추적 정리 (메모리 누수 방지)
    for (const [id, tracking] of this.activeTracking.entries()) {
      const timestamp = parseInt(id.split('_')[1]);
      if (timestamp < cutoff) {
        console.warn(`⚠️ 오래된 활성 추적 제거: ${tracking.name}`);
        this.activeTracking.delete(id);
      }
    }
  }

  // 🎯 성능 보고서 생성
  generateReport() {
    const stats = this.getStats();
    
    return {
      summary: {
        totalOperations: stats.completed,
        averageResponseTime: `${stats.averageDuration.toFixed(2)}ms`,
        activeOperations: stats.active
      },
      slowOperations: stats.slowQueries,
      recommendations: this.generateRecommendations(stats)
    };
  }

  // 💡 성능 개선 권장사항
  private generateRecommendations(stats: any) {
    const recommendations = [];

    if (stats.averageDuration > 500) {
      recommendations.push('평균 응답 시간이 500ms를 초과합니다. 쿼리 최적화를 고려하세요.');
    }

    if (stats.slowQueries.length > 5) {
      recommendations.push('느린 쿼리가 많이 감지되었습니다. 인덱스 추가를 고려하세요.');
    }

    if (stats.active > 10) {
      recommendations.push('동시 실행 중인 작업이 많습니다. 동시성 제한을 고려하세요.');
    }

    return recommendations;
  }
} 