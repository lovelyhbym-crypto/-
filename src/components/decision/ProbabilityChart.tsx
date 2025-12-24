'use client';

import { motion } from 'framer-motion';
import { DecisionOption } from '@/types/decision';

interface ProbabilityChartProps {
  options: DecisionOption[];
}

/**
 * 각 옵션의 확률을 시각적으로 보여주는 수평 바 차트 컴포넌트
 */
export default function ProbabilityChart({ options }: ProbabilityChartProps) {
  // 확률이 계산된 옵션들만 필터링
  const validOptions = options.filter(opt => opt.probability > 0);
  
  if (validOptions.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        옵션을 추가하고 가중치를 설정해주세요
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {validOptions.map((option, index) => (
        <div key={option.id} className="space-y-1">
          {/* 라벨과 확률 퍼센트 */}
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {option.label}
            </span>
            <span className="text-zinc-600 dark:text-zinc-400 tabular-nums">
              {(option.probability * 100).toFixed(1)}%
            </span>
          </div>
          
          {/* 확률 바 */}
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${option.probability * 100}%` }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="h-full bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}




