'use client';

interface ScoreCardProps {
  score: number;
  maxScore: number;
  grade: string;
  percentage: number;
}

export function ScoreCard({ score, maxScore, grade, percentage }: ScoreCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return 'text-green-600';
      case 'B+': case 'B': return 'text-blue-600';
      case 'C+': case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getGradeBgColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return 'bg-green-50 border-green-200';
      case 'B+': case 'B': return 'bg-blue-50 border-blue-200';
      case 'C+': case 'C': return 'bg-yellow-50 border-yellow-200';
      case 'D': return 'bg-orange-50 border-orange-200';
      case 'F': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border p-8 text-center ${getGradeBgColor(grade)}`}>
      <div className="mb-6">
        <div className={`text-8xl font-bold mb-4 ${getGradeColor(grade)}`}>
          {grade}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {score}점 / {maxScore}점
        </div>
        <div className="text-lg text-gray-600">
          전체 {percentage}% 달성
        </div>
      </div>
    </div>
  );
} 