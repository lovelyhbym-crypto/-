// 환경 변수 검증 헬퍼 함수
export function getSupabaseEnvVars() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error(
            '🚨 Supabase 환경 변수가 설정되지 않았습니다.\n\n' +
            '로컬 개발: .env.local 파일에 다음 변수를 추가하세요:\n' +
            '- NEXT_PUBLIC_SUPABASE_URL\n' +
            '- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n' +
            'Vercel 배포: Vercel 대시보드의 Settings > Environment Variables에서 설정하세요.'
        );
    }

    return { url, anonKey };
}
