import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export default async function HistoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!user) {
        redirect('/login');
    }

    return <>{children}</>;
}
