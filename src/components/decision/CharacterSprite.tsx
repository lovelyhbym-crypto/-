'use client';

import { motion } from 'framer-motion';
import { DecisionOption } from '@/types/decision';
import { getCharacter } from '@/lib/characters';

interface CharacterSpriteProps {
    option: DecisionOption;
    position: 'left' | 'right' | 'center';
    state: 'idle' | 'attacking' | 'hit' | 'defeated' | 'victorious';
    delay?: number;
}

/**
 * Animated character sprite for battle sequences
 */
export default function CharacterSprite({ option, position, state, delay = 0 }: CharacterSpriteProps) {
    const character = getCharacter(option.characterId);

    // Position variants
    const getInitialPosition = () => {
        if (position === 'left') return { x: '-40vw', rotate: 15 };
        if (position === 'right') return { x: '40vw', rotate: -15 };
        return { x: 0, rotate: 0 };
    };

    // Get animation based on state
    const getStateAnimation = () => {
        if (state === 'idle') {
            return {
                scale: [1, 1.05, 1],
                y: [0, -10, 0],
            };
        }
        if (state === 'attacking') {
            return {
                x: [0, position === 'left' ? 50 : -50, 0],
                rotate: [0, position === 'left' ? -20 : 20, 0],
            };
        }
        if (state === 'hit') {
            return {
                x: [0, position === 'left' ? -20 : 20, 0],
                opacity: [1, 0.5, 1],
            };
        }
        if (state === 'defeated') {
            return {
                opacity: 0,
                scale: 0.5,
                y: 100,
                rotate: position === 'left' ? -180 : 180,
            };
        }
        if (state === 'victorious') {
            return {
                scale: 1.3,
                y: -30,
                rotate: 360,
            };
        }
        return {};
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...getInitialPosition() }}
            animate={{
                opacity: state === 'defeated' ? 0 : 1,
                x: 0,
                rotate: 0,
                ...getStateAnimation(),
            }}
            transition={{
                delay,
                duration: state === 'attacking' ? 0.6 : state === 'defeated' ? 0.8 : 1,
                type: 'spring',
                stiffness: 100,
                repeat: state === 'idle' || state === 'attacking' ? Infinity : 0,
                repeatType: 'loop',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
                filter: `drop-shadow(0 0 30px ${character.glowColor})`,
            }}
        >
            <div className="flex flex-col items-center gap-2">
                {/* Character Emoji */}
                <div
                    className="text-8xl"
                    style={{
                        textShadow: `0 0 40px ${character.glowColor}, 0 0 80px ${character.glowColor}`,
                    }}
                >
                    {character.emoji}
                </div>

                {/* Character Name */}
                <motion.div
                    animate={{
                        opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                    className="text-xl font-bold px-4 py-1 rounded-full"
                    style={{
                        color: character.color,
                        backgroundColor: `${character.color}20`,
                        border: `2px solid ${character.color}`,
                        boxShadow: `0 0 20px ${character.glowColor}`,
                    }}
                >
                    {option.label}
                </motion.div>
            </div>
        </motion.div>
    );
}
