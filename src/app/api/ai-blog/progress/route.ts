import { NextRequest } from "next/server";
import { addSubscriber, removeSubscriber, getCurrentProgress } from "@/lib/progress-manager";

// SSE 연결 처리
export async function GET(req: NextRequest) {
  const response = new Response(
    new ReadableStream({
      start(controller) {
        // 클라이언트 연결 시 현재 진행상황 전송
        const initialData = JSON.stringify({
          type: 'init',
          data: getCurrentProgress()
        });
        
        controller.enqueue(`data: ${initialData}\n\n`);
        
        // 구독자 등록
        const send = (data: string) => {
          try {
            controller.enqueue(`data: ${data}\n\n`);
          } catch (error) {
            console.error('SSE 컨트롤러 오류:', error);
            removeSubscriber(send);
          }
        };
        
        addSubscriber(send);
        
        // 연결 종료 시 구독자 제거
        req.signal.addEventListener('abort', () => {
          removeSubscriber(send);
        });
      }
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    }
  );

  return response;
} 