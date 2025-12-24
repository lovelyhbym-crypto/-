'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DecisionOption } from '@/types/decision';
import { calculateProbabilities, pickWinner } from '@/lib/calculations';
import WeightSlider from '@/components/decision/WeightSlider';
import ProbabilityChart from '@/components/decision/ProbabilityChart';
import ResultOverlay from '@/components/decision/ResultOverlay';

/**
 * 영만이의 뽑기 도사 - 메인 대시보드
 * 가중치 기반 결정 도구
 */
export default function DashboardPage() {
  const [options, setOptions] = useState<DecisionOption[]>([
    { id: '1', label: '새 옵션', weight: 50, probability: 0 },
    { id: '2', label: '새 옵션', weight: 50, probability: 0 },
  ]);
  const [winner, setWinner] = useState<DecisionOption | null>(null);
  const [competitors, setCompetitors] = useState<DecisionOption[]>([]);
  const [isDeciding, setIsDeciding] = useState(false);
  
  // 확률 계산 (옵션이 변경될 때마다 자동 계산)
  const optionsWithProbability = useMemo(() => {
    return calculateProbabilities(options);
  }, [options]);
  
  // 옵션 추가 함수
  const handleAddOption = () => {
    const newId = String(Date.now());
    const newOption: DecisionOption = {
      id: newId,
      label: '새 옵션',
      weight: 50,
      probability: 0,
    };
    setOptions([...options, newOption]);
  };
  
  // 옵션 삭제 함수
  const handleDeleteOption = (id: string) => {
    if (options.length <= 1) {
      alert('최소 1개의 옵션이 필요합니다.');
      return;
    }
    setOptions(options.filter(opt => opt.id !== id));
  };
  
  // 가중치 변경 함수
  const handleWeightChange = (id: string, weight: number) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, weight } : opt
    ));
  };
  
  // 옵션 이름 변경 함수
  const handleLabelChange = (id: string, label: string) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, label } : opt
    ));
  };
  
  // 결정하기 함수
  const handleDecide = async () => {
    if (options.length === 0) {
      alert('옵션을 추가해주세요.');
      return;
    }
    
    setIsDeciding(true);
    
    // 확률 기준으로 상위 2개 옵션 선택 (경쟁자)
    const sortedOptions = [...optionsWithProbability].sort((a, b) => b.probability - a.probability);
    setCompetitors(sortedOptions);
    
    // 애니메이션을 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const selectedWinner = pickWinner(optionsWithProbability);
    setWinner(selectedWinner);
    setIsDeciding(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            영만이의 뽑기 도사
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            가중치를 설정하고 운명을 결정하세요
          </p>
        </motion.div>
        
        {/* 메인 컨텐츠 */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 왼쪽: 옵션 설정 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  옵션 설정
                </h2>
                <button
                  onClick={handleAddOption}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  + 추가
                </button>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {options.map((option) => (
                    <WeightSlider
                      key={option.id}
                      option={option}
                      onChange={handleWeightChange}
                      onLabelChange={handleLabelChange}
                      onDelete={handleDeleteOption}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          {/* 오른쪽: 확률 차트 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                확률 분포
              </h2>
              <ProbabilityChart options={optionsWithProbability} />
            </div>
          </motion.div>
        </div>
        
        {/* 결정하기 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={handleDecide}
            disabled={isDeciding || options.length === 0}
            className="px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {isDeciding ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>
                결정 중...
              </span>
            ) : (
              '🎲 결정하기'
            )}
          </button>
        </motion.div>
      </div>
      
      {/* 결과 오버레이 */}
      <ResultOverlay 
        winner={winner} 
        competitors={competitors}
        onClose={() => {
          setWinner(null);
          setCompetitors([]);
        }} 
      />
    </div>
  );
}




