'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-200 dark:border-zinc-800">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                        문제가 발생했습니다
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        {error.message.includes('환경 변수')
                            ? error.message
                            : '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
                    </p>
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        </div>
    )
}
