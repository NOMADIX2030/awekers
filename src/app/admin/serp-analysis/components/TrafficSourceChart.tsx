"use client";
import React from 'react';
import '../../components/styles.css';

interface TrafficSourceData {
  source: string;
  visits: number;
  percentage: number;
}

interface TrafficSourceChartProps {
  data?: TrafficSourceData[];
}

const TrafficSourceChart: React.FC<TrafficSourceChartProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        트래픽 소스 데이터가 없습니다.
      </div>
    );
  }

  const totalVisits = data.reduce((sum, item) => sum + item.visits, 0);

  return (
    <div className="space-y-4">
      {data.map((source, index) => (
        <div key={source.source} className="flex items-center">
          <div className="w-24 text-sm font-medium text-gray-700 truncate">
            {source.source}
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full traffic-source-progress"
                style={{ width: `${source.percentage}%` }}
              />
            </div>
          </div>
          <div className="w-20 text-right">
            <div className="text-sm font-semibold text-gray-900">
              {(source.visits || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {(source.percentage || 0).toFixed(1)}%
            </div>
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">총 방문자</span>
          <span className="font-semibold text-gray-900">
            {totalVisits.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrafficSourceChart; 
 
 