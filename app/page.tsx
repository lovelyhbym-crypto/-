'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 접속하자마자 대시보드나 뽑기 화면으로 바로 보내버립니다.
    router.push('/dashboard'); 
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <p className="animate-pulse">포돌이 출동 준비 중...</p>
    </div>
  );
}