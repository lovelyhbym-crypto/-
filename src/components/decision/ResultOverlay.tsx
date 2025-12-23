'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DecisionOption } from '@/types/decision';

interface ResultOverlayProps {
  winner: DecisionOption | null;
  competitors: DecisionOption[];
  onClose: () => void;
}

/**
 * 박진감 넘치는 칼 싸움 애니메이션을 포함한 결과 오버레이 컴포넌트
 */
export default function ResultOverlay({ winner, competitors, onClose }: ResultOverlayProps) {
  const [animationStage, setAnimationStage] = useState<'idle' | 'battle' | 'winner'>('idle');
  
  // 상위 2개 옵션 선택 (경쟁자)
  const topTwo = competitors.slice(0, 2);
  const leftOption = topTwo[0];
  const rightOption = topTwo[1];
  
  useEffect(() => {
    if (winner) {
      // 애니메이션 시퀀스 시작
      setAnimationStage('battle');
      
      // 칼 싸움 애니메이션 후 승자 표시
      const battleTimer = setTimeout(() => {
        setAnimationStage('winner');
        
        // confetti 효과 실행
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          
          const particleCount = 50 * (timeLeft / duration);
          
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);
        
        return () => clearInterval(interval);
      }, 3000); // 3초 동안 칼 싸움
      
      return () => {
        clearTimeout(battleTimer);
        setAnimationStage('idle');
      };
    }
  }, [winner]);
  
  const handleClose = () => {
    setAnimationStage('idle');
    onClose();
  };
  
  // 칼 아이콘 SVG 컴포넌트
  const SwordIcon = ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.92 5L3 9l1.41 1.41 1.59-1.59V13h2V8.82l1.59 1.59L11 9 7.08 5H6.92zM3.5 15L2 16.5 7.5 22 9 20.5 3.5 15zm13-5.82V13h2V8.82l1.59 1.59L21 9l-3.92-4h-.16L13 9l1.41 1.41 1.59-1.59zM14.5 22L20 16.5 18.5 15 13 20.5 14.5 22z"/>
      <path d="M12 2L10 4l2 2 2-2-2-2z"/>
    </svg>
  );
  
  // 불꽃 파티클 효과
  const SparkParticle = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0],
        x: [0, Math.random() * 40 - 20],
        y: [0, Math.random() * 40 - 20],
      }}
      transition={{
        duration: 0.6,
        delay,
        repeat: Infinity,
        repeatDelay: 0.3,
      }}
      className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
      style={{
        filter: 'blur(1px)',
      }}
    />
  );
  
  return (
    <AnimatePresence>
      {winner && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
          />
          
          {/* 애니메이션 컨테이너 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 칼 싸움 애니메이션 단계 */}
            {animationStage === 'battle' && (
              <div className="relative w-full max-w-4xl h-96">
                {/* 왼쪽 칼과 옵션 */}
                <motion.div
                  initial={{ x: -200, opacity: 0, rotate: -45 }}
                  animate={{
                    x: [-200, -50, -80, -50, -80, -50],
                    opacity: 1,
                    rotate: [-45, 0, -10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    times: [0, 0.3, 0.5, 0.6, 0.8, 1],
                  }}
                  className="absolute left-1/4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
                >
                  <SwordIcon className="w-32 h-32 text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                    }}
                    className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                  >
                    {leftOption?.label || '옵션 1'}
                  </motion.div>
                </motion.div>
                
                {/* 오른쪽 칼과 옵션 */}
                <motion.div
                  initial={{ x: 200, opacity: 0, rotate: 45 }}
                  animate={{
                    x: [200, 50, 80, 50, 80, 50],
                    opacity: 1,
                    rotate: [45, 0, 10, 0, 10, 0],
                    scale: winner.id === rightOption?.id ? 1 : [1, 1, 1, 1, 1, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    times: [0, 0.3, 0.5, 0.6, 0.8, 1],
                  }}
                  className="absolute right-1/4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
                >
                  <SwordIcon className="w-32 h-32 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] scale-x-[-1]" />
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                    }}
                    className="text-2xl font-bold text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                  >
                    {rightOption?.label || '옵션 2'}
                  </motion.div>
                </motion.div>
                
                {/* 중앙 충돌 불꽃 효과 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 1, 0] }}
                  transition={{
                    duration: 2.5,
                    times: [0, 0.3, 0.5, 0.8, 1],
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative w-20 h-20">
                    {[...Array(8)].map((_, i) => (
                      <SparkParticle key={i} delay={i * 0.1} />
                    ))}
                  </div>
                </motion.div>
                
                {/* VS 텍스트 */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3,
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
                >
                  VS
                </motion.div>
              </div>
            )}
            
            {/* 승자 표시 단계 */}
            {animationStage === 'winner' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl shadow-2xl max-w-2xl w-full p-12 border-2 border-yellow-500/50 relative overflow-hidden"
              >
                {/* 배경 빛나는 효과 */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-gradient-radial from-yellow-500/20 via-transparent to-transparent"
                />
                
                {/* 승리 칼 아이콘 */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex justify-center mb-6"
                >
                  <SwordIcon className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]" />
                </motion.div>
                
                {/* 결과 제목 */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-black text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400"
                >
                  ⚔️ 승리! ⚔️
                </motion.h2>
                
                {/* 당첨 옵션 */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="text-center py-8 relative z-10"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="text-5xl font-black text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                  >
                    {winner.label}
                  </motion.div>
                  <div className="text-lg text-zinc-300 font-semibold">
                    승률: {(winner.probability * 100).toFixed(1)}%
                  </div>
                </motion.div>
                
                {/* 닫기 버튼 */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleClose}
                  className="relative z-10 w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-zinc-900 rounded-xl text-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  확인
                </motion.button>
              </motion.div>
            )}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
