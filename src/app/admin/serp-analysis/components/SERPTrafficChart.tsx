"use client";
import React, { useState, useEffect } from 'react';

interface TrafficData {
  date: string;
  visits: number;
  organic: number;
  direct: number;
  social: number;
}

interface SERPTrafficChartProps {
  data?: TrafficData[];
}

const SERPTrafficChart: React.FC<SERPTrafficChartProps> = ({ data = [] }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm sm:text-base">트래픽 데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  const maxVisits = Math.max(...data.map(d => d.visits));
  const chartHeight = 200;

  // 라벨 표시 간격 계산 (데이터 포인트가 많을 때 간격 조정)
  const getLabelInterval = () => {
    const dataLength = data.length;
    if (dataLength <= 7) return 1; // 7개 이하면 모든 라벨 표시
    if (dataLength <= 14) return 2; // 14개 이하면 2개마다 표시
    if (dataLength <= 21) return 3; // 21개 이하면 3개마다 표시
    return Math.ceil(dataLength / 10); // 그 이상이면 10개 정도로 제한
  };

  const labelInterval = getLabelInterval();

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string, isMobile: boolean) => {
    const date = new Date(dateString);
    if (isMobile) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {/* 범례 - 모바일에서 세로 배치 */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>총 방문자</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>유기적 트래픽</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>직접 유입</span>
        </div>
      </div>

      {/* 차트 컨테이너 */}
      <div className="relative h-64 sm:h-80">
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* 그리드 라인 */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={`grid-${percent}`}
              x1="0"
              y1={chartHeight - (chartHeight * percent / 100)}
              x2="100%"
              y2={chartHeight - (chartHeight * percent / 100)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* 데이터 포인트 연결 */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y1 = chartHeight - (point.visits / maxVisits) * chartHeight;
            const y2 = chartHeight - (point.organic / maxVisits) * chartHeight;
            const y3 = chartHeight - (point.direct / maxVisits) * chartHeight;

            return (
              <g key={`data-point-${point.date}-${index}`}>
                {/* 총 방문자 라인 */}
                <circle
                  cx={`${x}%`}
                  cy={y1}
                  r={hoveredPoint === index ? "4" : "3"}
                  fill="#3b82f6"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {index > 0 && (
                  <line
                    x1={`${((index - 1) / (data.length - 1)) * 100}%`}
                    y1={chartHeight - (data[index - 1].visits / maxVisits) * chartHeight}
                    x2={`${x}%`}
                    y2={y1}
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                )}

                {/* 유기적 트래픽 라인 */}
                <circle
                  cx={`${x}%`}
                  cy={y2}
                  r={hoveredPoint === index ? "3" : "2"}
                  fill="#10b981"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {index > 0 && (
                  <line
                    x1={`${((index - 1) / (data.length - 1)) * 100}%`}
                    y1={chartHeight - (data[index - 1].organic / maxVisits) * chartHeight}
                    x2={`${x}%`}
                    y2={y2}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                )}

                {/* 직접 유입 라인 */}
                <circle
                  cx={`${x}%`}
                  cy={y3}
                  r={hoveredPoint === index ? "3" : "2"}
                  fill="#8b5cf6"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {index > 0 && (
                  <line
                    x1={`${((index - 1) / (data.length - 1)) * 100}%`}
                    y1={chartHeight - (data[index - 1].direct / maxVisits) * chartHeight}
                    x2={`${x}%`}
                    y2={y3}
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                )}

                {/* 툴팁 */}
                {hoveredPoint === index && (
                  <foreignObject
                    x={`${x}%`}
                    y={Math.min(y1, y2, y3) - 60}
                    width="120"
                    height="50"
                    className="transform -translate-x-1/2"
                  >
                    <div className="bg-gray-900 text-white text-xs p-2 rounded shadow-lg">
                      <div className="font-medium">
                        {formatDate(point.date, isMobile)}
                      </div>
                      <div>총: {point.visits.toLocaleString()}</div>
                      <div>유기: {point.organic.toLocaleString()}</div>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>

        {/* X축 라벨 - 개선된 간격 및 회전 */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
          {data.map((point, index) => {
            // 라벨 간격에 따라 표시 여부 결정
            if (index % labelInterval !== 0 && index !== data.length - 1) {
              return <div key={`spacer-${index}`} className="flex-1"></div>;
            }

            return (
              <span 
                key={`label-${point.date}-${index}`} 
                className={`transform origin-left whitespace-nowrap ${
                  isMobile 
                    ? '-rotate-90 translate-y-2' 
                    : data.length > 10 
                      ? '-rotate-45 translate-y-1' 
                      : '-rotate-45'
                }`}
                style={{
                  fontSize: isMobile ? '10px' : '12px',
                  maxWidth: isMobile ? '20px' : '40px'
                }}
              >
                {formatDate(point.date, isMobile)}
              </span>
            );
          })}
        </div>
      </div>

      {/* 통계 요약 - 모바일에서 더 큰 텍스트 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-base sm:text-lg font-semibold text-blue-600">
            {data.reduce((sum, d) => sum + d.visits, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">총 방문자</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-base sm:text-lg font-semibold text-green-600">
            {data.reduce((sum, d) => sum + d.organic, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">유기적 트래픽</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-base sm:text-lg font-semibold text-purple-600">
            {data.reduce((sum, d) => sum + d.direct, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">직접 유입</div>
        </div>
      </div>
    </div>
  );
};

export default SERPTrafficChart; 
 
 