import { redirect } from 'next/navigation';

export default function RootPage() {
  // 접속하자마자 로그인 페이지(auth 폴더 안의 페이지)로 던져버립니다!
  redirect('/login');
}