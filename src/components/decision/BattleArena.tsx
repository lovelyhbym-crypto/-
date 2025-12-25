'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DecisionOption } from '@/types/decision';
import CharacterSprite from './CharacterSprite';
import DustCloud from './DustCloud';
import { getCharacter } from '@/lib/characters';

interface BattleArenaProps {
    winner: DecisionOption | null;
    competitors: DecisionOption[];
    onClose: () => void;
}

type BattleStage = 'intro' | 'entrance' | 'clash' | 'elimination' | 'victory';

/**
 * Battle Arena - orchestrates the character battle animation sequence
 */
export default function BattleArena({ winner, competitors, onClose }: BattleArenaProps) {
    const [stage, setStage] = useState<BattleStage>('intro');

    useEffect(() => {
        if (!winner) return;

        // Animation sequence timeline
        const timeline = [
            { stage: 'intro' as BattleStage, duration: 500 },
            { stage: 'entrance' as BattleStage, duration: 2500 },
            { stage: 'clash' as BattleStage, duration: 3500 },
            { stage: 'elimination' as BattleStage, duration: 1000 },
            { stage: 'victory' as BattleStage, duration: 0 },
        ];

        let currentTime = 0;
        const timers: NodeJS.Timeout[] = [];

        timeline.forEach(({ stage, duration }) => {
            const timer = setTimeout(() => {
                setStage(stage);

                // Trigger confetti on victory
                if (stage === 'victory') {
                    triggerConfetti();
                }
            }, currentTime);

            timers.push(timer);
            currentTime += duration;
        });

        return () => {
            timers.forEach(clearTimeout);
            setStage('intro');
        };
    }, [winner]);

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                origin: { x: Math.random(), y: Math.random() - 0.2 },
                colors: ['#8B5CF6', '#F59E0B', '#FBBF24', '#A78BFA'],
            });
        }, 250);
    };

    if (!winner) return null;

    // CRITICAL: Do not use || 1 fallback! This causes all winners to show as character 1 (wizard)
    if (!winner.characterId) {
        console.error('Winner has no characterId:', winner);
    }
    const winnerCharacterId = (winner.characterId as 1 | 2 | 3 | 4) ?? 1;
    const winnerCharacter = getCharacter(winnerCharacterId);

    return (
        <AnimatePresence>
            {winner && (
                <>
                    {/* Dark Background Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-black z-40"
                    >
                        {/* Magical particles background */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1.5, 0],
                                        y: [0, -50, -100],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Battle Arena Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Intro Stage - Arena Title */}
                        {stage === 'intro' && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="text-center"
                            >
                                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400">
                                    ⚔️ 결투장 ⚔️
                                </h1>
                            </motion.div>
                        )}

                        {/* Entrance & Clash & Elimination Stages */}
                        {(stage === 'entrance' || stage === 'clash' || stage === 'elimination') && (
                            <motion.div
                                className="relative w-full max-w-6xl h-96"
                                animate={stage === 'clash' ? {
                                    x: [-3, 3, -2, 2, 0], // Sharp jitter
                                    y: [-3, 3, -1, 1, 0],
                                } : {}}
                                transition={{
                                    duration: 0.1, // Ultra-fast shake
                                    repeat: stage === 'clash' ? Infinity : 0,
                                    repeatType: "reverse",
                                    ease: "easeInOut"
                                }}
                            >
                                {/* Impact Effects (Dust Cloud) - Only during Clash */}
                                {stage === 'clash' && (
                                    <DustCloud />
                                )}

                                {competitors.map((option, index) => {
                                    const isWinner = option.id === winner.id;
                                    const position = index % 2 === 0 ? 'left' : 'right';

                                    let characterState: 'idle' | 'attacking' | 'hit' | 'defeated' | 'victorious' = 'idle';

                                    if (stage === 'entrance') {
                                        characterState = 'idle';
                                    } else if (stage === 'clash') {
                                        characterState = 'attacking';
                                    } else if (stage === 'elimination') {
                                        characterState = isWinner ? 'victorious' : 'defeated';
                                    }

                                    return (
                                        <CharacterSprite
                                            key={option.id}
                                            option={option}
                                            index={index}
                                            position={position}
                                            state={characterState}
                                            delay={index * 0.2}
                                        />
                                    );
                                })}

                                {/* VS Text during clash */}
                                {stage === 'clash' && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: 0,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            type: "tween",
                                            ease: "easeOut",
                                            scale: {
                                                repeat: Infinity,
                                                duration: 1,
                                                type: "tween",
                                                ease: "easeInOut"
                                            },
                                        }}
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-white z-10"
                                        style={{
                                            textShadow: '0 0 40px rgba(251, 191, 36, 0.8), 0 0 80px rgba(251, 191, 36, 0.4)',
                                        }}
                                    >
                                        VS
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Victory Stage */}
                        {stage === 'victory' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-3xl shadow-2xl max-w-2xl w-full p-12 border-4 border-yellow-500 relative overflow-hidden"
                            >
                                {/* Glowing background effect */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.5, 0.3],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        type: "tween"
                                    }}
                                    className="absolute inset-0 bg-gradient-radial from-yellow-500/20 via-transparent to-transparent"
                                />

                                {/* Winner Character */}
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="flex justify-center mb-6"
                                >
                                    <div
                                        className="text-9xl"
                                        style={{
                                            textShadow: `0 0 60px ${winnerCharacter.glowColor}, 0 0 120px ${winnerCharacter.glowColor}`,
                                            filter: `drop-shadow(0 0 40px ${winnerCharacter.glowColor})`,
                                        }}
                                    >
                                        {winnerCharacter.emoji}
                                    </div>
                                </motion.div>

                                {/* Victory Title */}
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl font-black text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400"
                                >
                                    ⚔️ 승리! ⚔️
                                </motion.h2>

                                {/* Winner Option */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                                    className="text-center py-8 relative z-10"
                                >
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            type: "tween",
                                            ease: "easeInOut"
                                        }}
                                        className="text-5xl font-black text-white mb-4"
                                        style={{
                                            textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                                        }}
                                    >
                                        {winner.label}
                                    </motion.div>
                                    <div className="text-xl text-yellow-300 font-semibold">
                                        승률: {(winner.probability * 100).toFixed(1)}%
                                    </div>
                                </motion.div>

                                {/* Close Button */}
                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={onClose}
                                    className="relative z-10 w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-purple-900 rounded-xl text-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
