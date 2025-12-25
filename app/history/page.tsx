'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { DecisionOption } from '@/types/decision';
import { getCharacter } from '@/lib/characters';

interface DecisionRecord {
    id: string;
    winner_name: string;
    winner_character: number;
    options: DecisionOption[];
    created_at: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDecisions();
    }, []);

    const fetchDecisions = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('decisions')
                .select('*')
                .eq('user_id', user.id) // RLS handles this, but good to be explicit
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDecisions(data || []);
        } catch (error) {
            console.error('Error fetching decisions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-12"
                >
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                    >
                        ← 돌아가기
                    </button>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                        나의 결정 기록
                    </h1>
                    <div className="w-[100px]"></div> {/* Spacer for centering */}
                </motion.div>

                {loading ? (
                    <div className="text-center py-20 text-zinc-500">로딩 중...</div>
                ) : decisions.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 bg-white dark:bg-zinc-900 rounded-xl shadow p-10">
                        <div className="text-4xl mb-4">📝</div>
                        <p>아직 기록된 결정이 없습니다.</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="mt-4 text-blue-500 hover:underline"
                        >
                            첫 결정 내리러 가기
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {decisions.map((decision, index) => {
                                const character = getCharacter(decision.winner_character as 1 | 2 | 3 | 4 || 1);
                                const date = new Date(decision.created_at).toLocaleDateString() + ' ' + new Date(decision.created_at).toLocaleTimeString();

                                return (
                                    <motion.div
                                        key={decision.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row"
                                    >
                                        {/* Winner Section */}
                                        <div
                                            className="p-6 flex flex-col items-center justify-center md:w-1/3 relative overflow-hidden"
                                            style={{ backgroundColor: `${character.color}20` }}
                                        >
                                            <div
                                                className="absolute inset-0 opacity-10"
                                                style={{ backgroundColor: character.color }}
                                            />
                                            <div className="relative z-10 w-24 h-24 mb-2">
                                                <img
                                                    src={character.image}
                                                    alt={character.name}
                                                    className="w-full h-full object-contain drop-shadow-lg"
                                                />
                                            </div>
                                            <div className="relative z-10 text-center">
                                                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Winner</span>
                                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                                                    {decision.winner_name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Details Section */}
                                        <div className="p-6 md:w-2/3">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                                    {date}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                                    참여한 옵션들 ({decision.options.length}):
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {decision.options.map((opt) => (
                                                        <span
                                                            key={opt.id}
                                                            className={`text-xs px-2 py-1 rounded-full border ${opt.label === decision.winner_name
                                                                ? 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-200 font-bold'
                                                                : 'bg-zinc-100 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                                                                }`}
                                                        >
                                                            {opt.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
