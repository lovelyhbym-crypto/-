'use client';

import { motion } from 'framer-motion';
import { CHARACTERS, Character } from '@/lib/characters';

interface CharacterSelectorProps {
    selectedCharacterId: 1 | 2 | 3 | 4;
    onChange: (characterId: 1 | 2 | 3 | 4) => void;
}

/**
 * Character selector component - allows users to pick a character (1-4)
 */
export default function CharacterSelector({ selectedCharacterId, onChange }: CharacterSelectorProps) {
    const characters = Object.values(CHARACTERS) as Character[];

    return (
        <div className="grid grid-cols-4 gap-2">
            {characters.map((character) => {
                const isSelected = character.id === selectedCharacterId;

                return (
                    <motion.button
                        key={character.id}
                        type="button"
                        onClick={() => onChange(character.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
              relative p-3 rounded-lg border-2 transition-all
              ${isSelected
                                ? 'border-yellow-400 bg-gradient-to-br from-purple-900/50 to-purple-800/50 shadow-lg shadow-yellow-400/30'
                                : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                            }
            `}
                    >
                        {/* Character Emoji */}
                        <div className="text-3xl mb-1 filter drop-shadow-lg">
                            {character.emoji}
                        </div>

                        {/* Character Name */}
                        <div className={`text-xs font-medium ${isSelected ? 'text-yellow-400' : 'text-zinc-400'}`}>
                            {character.name}
                        </div>

                        {/* Selection Glow */}
                        {isSelected && (
                            <motion.div
                                layoutId="character-selection"
                                className="absolute inset-0 rounded-lg border-2 border-yellow-400"
                                style={{
                                    boxShadow: `0 0 20px ${character.glowColor}`,
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
