import { Profile } from '@/types/auth';
import LogoutButton from './LogoutButton';
import Image from 'next/image';

interface HeaderProps {
    profile: Profile | null;
}

export default function Header({ profile }: HeaderProps) {
    if (!profile) {
        return null; // 로그인하지 않은 경우 헤더를 표시하지 않음
    }

    return (
        <header className="w-full px-8 py-4 border-b flex justify-between items-center bg-white dark:bg-gray-900 shadow-sm">
            {/* 왼쪽: 서비스 이름 */}
            <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    🔮 영만이의 뽑기 도사
                </h1>
            </div>

            {/* 오른쪽: 프로필 사진 + 로그아웃 버튼 */}
            <div className="flex items-center gap-4">
                {profile.avatar_url ? (
                    <Image
                        src={profile.avatar_url}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-yellow-400"
                    />
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                            {profile.full_name?.charAt(0) || 'U'}
                        </span>
                    </div>
                )}
                <LogoutButton />
            </div>
        </header>
    );
}
