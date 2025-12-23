'use client';

import { motion } from 'framer-motion';
import { DecisionOption } from '@/types/decision';

interface WeightSliderProps {
  option: DecisionOption;
  onChange: (id: string, weight: number) => void;
  onLabelChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
}

/**
 * 가중치를 조절하는 슬라이더 컴포넌트
 * Framer Motion을 사용하여 실시간 애니메이션 효과 제공
 */
export default function WeightSlider({ option, onChange, onLabelChange, onDelete }: WeightSliderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      {/* 옵션 라벨 및 입력 */}
      <div className="flex-1 min-w-0">
        {/* 옵션 이름 입력 필드 */}
        <input
          type="text"
          value={option.label}
          onChange={(e) => onLabelChange(option.id, e.target.value)}
          onBlur={(e) => {
            // 빈 값일 경우 기본값으로 설정
            if (!e.target.value.trim()) {
              onLabelChange(option.id, '새 옵션');
            }
          }}
          className="w-full mb-2 px-3 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 focus:border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-750 transition-all"
          placeholder="옵션 이름 입력..."
        />
        
        {/* 슬라이더 */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={option.weight}
            onChange={(e) => onChange(option.id, Number(e.target.value))}
            className="flex-1 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:bg-zinc-700 dark:accent-zinc-100"
          />
          
          {/* 가중치 숫자 표시 (애니메이션) */}
          <motion.div
            key={option.weight}
            initial={{ scale: 1.2, color: '#3b82f6' }}
            animate={{ scale: 1, color: 'inherit' }}
            transition={{ duration: 0.2 }}
            className="w-12 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums"
          >
            {option.weight}
          </motion.div>
        </div>
      </div>
      
      {/* 삭제 버튼 */}
      <button
        onClick={() => onDelete(option.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400"
        aria-label="옵션 삭제"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </motion.div>
  );
}

