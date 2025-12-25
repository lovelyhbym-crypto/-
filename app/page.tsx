import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export default async function RootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 인증된 사용자는 대시보드로, 미인증 사용자는 로그인으로
  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}