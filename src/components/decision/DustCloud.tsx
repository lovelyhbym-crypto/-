'use client';

import { motion } from 'framer-motion';

/**
 * Comic-style dust cloud explosion effect
 */
export default function DustCloud() {
    // Multiple particles for the cloud
    const particles = [0, 1, 2, 3, 4];

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-0">
            {particles.map((i) => {
                // Randomize direction for each particle
                const angle = (i * 72) + Math.random() * 30; // 360 / 5 = 72
                const rad = angle * (Math.PI / 180);
                const distance = 40 + Math.random() * 20;

                const x = Math.cos(rad) * distance;
                const y = Math.sin(rad) * distance;

                return (
                    <motion.div
                        key={i}
                        className="absolute w-16 h-16 bg-white rounded-full opacity-80"
                        initial={{ scale: 0.5, opacity: 0.8, x: 0, y: 0 }}
                        animate={{
                            scale: 1.5,
                            opacity: 0,
                            x: x,
                            y: y,
                        }}
                        transition={{
                            duration: 0.4,
                            repeat: Infinity,
                            ease: "easeOut",
                            repeatDelay: 0.1 // Sync roughly with character bounce (0.4s + delay)
                        }}
                        style={{
                            filter: 'blur(4px)',
                        }}
                    />
                );
            })}
            {/* Core impact flash */}
            <motion.div
                className="absolute w-20 h-20 bg-white rounded-full"
                animate={{
                    scale: [0.5, 1.2],
                    opacity: [1, 0],
                }}
                transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    ease: "easeOut",
                    repeatDelay: 0.2
                }}
            />
        </div>
    );
}
