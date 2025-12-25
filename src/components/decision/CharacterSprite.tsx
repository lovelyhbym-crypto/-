'use client';

import { motion } from 'framer-motion';
import { DecisionOption } from '@/types/decision';
import { getCharacter } from '@/lib/characters';

interface CharacterSpriteProps {
    option: DecisionOption;
    position: 'left' | 'right' | 'center';
    state: 'idle' | 'attacking' | 'hit' | 'defeated' | 'victorious';
    delay?: number;
    index: number;
}

/**
 * Animated character sprite for battle sequences
 */
export default function CharacterSprite({ option, position, state, delay = 0, index }: CharacterSpriteProps) {
    const characterId = (option.characterId as 1 | 2 | 3 | 4) || 1;
    const character = getCharacter(characterId);

    // Position variants
    const getInitialPosition = () => {
        if (position === 'left') return { x: '-100vw', rotate: 15 };
        if (position === 'right') return { x: '100vw', rotate: -15 };
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
            // Calculate unique bounce direction based on option ID (pseudo-random but deterministic)
            const idNum = parseInt(option.id) || 1;
            const seed = idNum * 17;

            // X-axis: Bounce AWAY from center (negative for left, positive for right)
            // Magnitude: 120 ~ 180px
            const bounceXMag = 120 + (seed % 60);
            const bounceX = position === 'left' ? -bounceXMag : bounceXMag;

            // Y-axis: Scatter up or down (-80 ~ 80px)
            // Use bitwise or modulo to decide up/down based on ID
            const yDir = seed % 2 === 0 ? 1 : -1;
            const bounceY = (40 + (seed % 40)) * yDir;

            return {
                x: [0, bounceX], // Start at center (0), bounce out
                y: [0, bounceY], // Start at center (0), bounce up/down
                scale: [1, 0.9], // Squash on impact (at 0), normal at peak
                rotate: [0, position === 'left' ? -15 : 15],
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
                scale: 1,
                rotate: 0,
                ...getStateAnimation(),
            }}
            transition={{
                // Entrance (x-axis move) should be slow and linear
                // Elastic Overhaul:
                // Attacking: Fast ping-pong with large amplitude
                duration: state === 'attacking' ? 0.4 : state === 'idle' ? 2.5 : state === 'defeated' ? 0.8 : 1, // Slower than 0.2s to see the bounce
                type: 'tween',
                ease: state === 'idle' ? 'linear' : state === 'attacking' ? 'easeInOut' : 'easeInOut',
                repeat: state === 'idle' || state === 'attacking' ? Infinity : 0,
                repeatType: state === 'attacking' ? 'reverse' : 'loop',
                delay: state === 'attacking' ? (option.id ? (parseInt(option.id) % 2) * 0.1 : 0) : delay, // Stagger based on ID/index approximation
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
                filter: `drop-shadow(0 0 30px ${character.glowColor})`,
                zIndex: state === 'defeated' ? 0 : 10,
            }}
        >
            <div className="flex flex-col items-center gap-2">
                {/* Character Image */}
                <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4">
                    <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-contain"
                        style={{
                            filter: `drop-shadow(0 0 20px ${character.glowColor})`,
                        }}
                    />
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
                    className="text-xl font-bold px-4 py-1 rounded-full bg-black/50 backdrop-blur-sm whitespace-nowrap"
                    style={{
                        color: character.color,
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
