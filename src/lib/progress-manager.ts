// 진행상황 상태 관리
interface ProgressState {
  stepId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message: string;
  timestamp: number;
}

const progressSubscribers: Set<(data: string) => void> = new Set();
let currentProgress: ProgressState[] = [];

// 진행상황 업데이트 함수
export function updateProgress(stepId: string, status: ProgressState['status'], message: string) {
  const progress: ProgressState = {
    stepId,
    status,
    message,
    timestamp: Date.now()
  };
  
  // 기존 진행상황 업데이트 또는 추가
  const existingIndex = currentProgress.findIndex(p => p.stepId === stepId);
  if (existingIndex >= 0) {
    currentProgress[existingIndex] = progress;
  } else {
    currentProgress.push(progress);
  }
  
  // 모든 구독자에게 실시간 업데이트 전송
  const data = JSON.stringify({
    type: 'progress',
    data: progress,
    allProgress: currentProgress
  });
  
  progressSubscribers.forEach(send => {
    try {
      send(data);
    } catch (error) {
      console.error('SSE 전송 오류:', error);
    }
  });
}

// 진행상황 초기화
export function resetProgress() {
  currentProgress = [];
  const data = JSON.stringify({
    type: 'reset',
    data: currentProgress
  });
  
  progressSubscribers.forEach(send => {
    try {
      send(data);
    } catch (error) {
      console.error('SSE 전송 오류:', error);
    }
  });
}

// 구독자 관리
export function addSubscriber(send: (data: string) => void) {
  progressSubscribers.add(send);
}

export function removeSubscriber(send: (data: string) => void) {
  progressSubscribers.delete(send);
}

export function getCurrentProgress() {
  return currentProgress;
} 