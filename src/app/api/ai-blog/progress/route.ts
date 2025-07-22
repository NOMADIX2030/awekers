import { NextRequest, NextResponse } from "next/server";

// 진행상황 상태 관리
interface ProgressState {
  stepId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message: string;
  timestamp: number;
}

let progressSubscribers: Set<(data: string) => void> = new Set();
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

// SSE 연결 처리
export async function GET(req: NextRequest) {
  const response = new Response(
    new ReadableStream({
      start(controller) {
        // 클라이언트 연결 시 현재 진행상황 전송
        const initialData = JSON.stringify({
          type: 'init',
          data: currentProgress
        });
        
        controller.enqueue(`data: ${initialData}\n\n`);
        
        // 구독자 등록
        const send = (data: string) => {
          try {
            controller.enqueue(`data: ${data}\n\n`);
          } catch (error) {
            console.error('SSE 컨트롤러 오류:', error);
            progressSubscribers.delete(send);
          }
        };
        
        progressSubscribers.add(send);
        
        // 연결 종료 시 구독자 제거
        req.signal.addEventListener('abort', () => {
          progressSubscribers.delete(send);
        });
      }
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    }
  );
  
  return response;
} 