/**
 * Character metadata for battle animation system
 */

export interface Character {
    id: 1 | 2 | 3 | 4;
    name: string;
    emoji: string;
    color: string;
    glowColor: string;
    description: string;
}

export const CHARACTERS: Record<number, Character> = {
    1: {
        id: 1,
        name: '보라 도사',
        emoji: '🧙‍♂️',
        color: '#8B5CF6', // Purple
        glowColor: 'rgba(139, 92, 246, 0.8)',
        description: '신비로운 보라색 마법사',
    },
    2: {
        id: 2,
        name: '초록 현자',
        emoji: '🧙‍♀️',
        color: '#10B981', // Green
        glowColor: 'rgba(16, 185, 129, 0.8)',
        description: '지혜로운 초록색 현자',
    },
    3: {
        id: 3,
        name: '불꽃 마법사',
        emoji: '🔥',
        color: '#EF4444', // Red
        glowColor: 'rgba(239, 68, 68, 0.8)',
        description: '열정적인 불꽃 마법사',
    },
    4: {
        id: 4,
        name: '번개 술사',
        emoji: '⚡',
        color: '#3B82F6', // Blue
        glowColor: 'rgba(59, 130, 246, 0.8)',
        description: '빠른 번개 술사',
    },
};

export const getCharacter = (id: 1 | 2 | 3 | 4): Character => {
    return CHARACTERS[id];
};
