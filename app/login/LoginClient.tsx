'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * 영만이의 뽑기 도사 - 초고퀄리티 로그인/회원가입 페이지
 * Supabase 실제 인증 로직 구현
 */
export default function LoginClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [username, setUsername] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 마운트 상태 관리 (Hydration 에러 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 로그인 핸들러
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 핸들러
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username, // User Metadata에 닉네임 저장
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        alert('회원가입이 완료되었습니다! 이메일을 확인하여 인증을 완료해주세요.');
        // 회원가입 성공 시 로그인 모드로 전환
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        setUsername('');
      }
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 소셜 로그인 핸들러
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
          },
          redirectTo: `${window.location.origin}/login/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      alert('Google 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          queryParams: {
            prompt: 'login',
          },
          redirectTo: `${window.location.origin}/login/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Kakao login error:', error);
      alert('Kakao 로그인 중 오류가 발생했습니다.');
    }
  };

  // 별무리 효과 (useMemo로 최적화, 개수 감소)
  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 2 + 3,
      delay: Math.random() * 3,
    })), []
  );

  // 시차 애니메이션 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
      {/* 운명의 수레바퀴 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* 수레바퀴 원형 */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-500/5"
              style={{
                width: `${(i + 1) * 400}px`,
                height: `${(i + 1) * 400}px`,
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.05, 0.1, 0.05],
              }}
              transition={{
                duration: 8,
                delay: i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* 수레바퀴 스포크 */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`spoke-${i}`}
              className="absolute top-1/2 left-1/2 w-1 h-[600px] bg-gradient-to-b from-yellow-500/10 via-yellow-500/5 to-transparent origin-top"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* 별무리 효과 (마운트 후에만 렌더링) */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-yellow-200"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: '0 0 4px rgba(250, 204, 21, 0.8)',
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [0, -10, 0],
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* 신비로운 오라 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <motion.div
        className="relative z-10 flex min-h-screen items-center justify-center p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md">
          {/* 헤더 */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            {/* 로고/아이콘 */}
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block text-8xl mb-6 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]"
            >
              🔮
            </motion.div>

            {/* 세리프 스타일 타이틀 */}
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                영만이의
              </span>
              <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]">
                뽑기 도사
              </span>
            </h1>

            <motion.p
              className="text-lg text-yellow-200/70 font-light tracking-wide"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              운명을 결정하는 가장 명쾌한 방법
            </motion.p>
          </motion.div>

          {/* 로그인/회원가입 카드 */}
          <motion.div
            variants={itemVariants}
            className="relative backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border-2 border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 overflow-hidden"
          >
            {/* 카드 내부 빛나는 효과 */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* 모드 전환 탭 */}
            <div className="relative flex gap-2 mb-8 p-1.5 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
              <motion.div
                className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg"
                animate={{
                  left: isLogin ? '6px' : '50%',
                  right: isLogin ? '50%' : '6px',
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
              <button
                onClick={() => setIsLogin(true)}
                className={`relative z-10 flex-1 py-3 px-6 rounded-xl font-bold transition-colors ${isLogin ? 'text-black' : 'text-yellow-200/60 hover:text-yellow-200'
                  }`}
              >
                로그인
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`relative z-10 flex-1 py-3 px-6 rounded-xl font-bold transition-colors ${!isLogin ? 'text-black' : 'text-yellow-200/60 hover:text-yellow-200'
                  }`}
              >
                회원가입
              </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {isLogin ? (
                /* 로그인 폼 */
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleEmailLogin}
                  className="relative space-y-6 mb-8"
                >
                  {/* 이메일 입력 */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-yellow-200/90 mb-2 tracking-wide">
                      이메일
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="your@email.com"
                        className={`w-full px-5 py-4 bg-black/30 backdrop-blur-sm border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${focusedField === 'email'
                          ? 'border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                          : 'border-white/10 hover:border-white/20'
                          }`}
                        required
                      />
                    </div>
                  </div>

                  {/* 비밀번호 입력 */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-yellow-200/90 mb-2 tracking-wide">
                      비밀번호
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        className={`w-full px-5 py-4 bg-black/30 backdrop-blur-sm border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${focusedField === 'password'
                          ? 'border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                          : 'border-white/10 hover:border-white/20'
                          }`}
                        required
                      />
                    </div>
                  </div>

                  {/* 로그인 버튼 */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '처리 중...' : '로그인'}
                  </motion.button>
                </motion.form>
              ) : (
                /* 회원가입 폼 */
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignup}
                  className="relative space-y-5 mb-8"
                >
                  {/* 사용자 이름 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="signup-username" className="block text-sm font-semibold text-yellow-200/90 mb-2 tracking-wide">
                      사용자 이름 (닉네임)
                    </label>
                    <input
                      id="signup-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="영만이"
                      className={`w-full px-5 py-4 bg-black/30 backdrop-blur-sm border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${focusedField === 'username'
                        ? 'border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                        : 'border-white/10 hover:border-white/20'
                        }`}
                      required
                    />
                  </motion.div>

                  {/* 이메일 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label htmlFor="signup-email" className="block text-sm font-semibold text-yellow-200/90 mb-2 tracking-wide">
                      이메일
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('signup-email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="your@email.com"
                      className={`w-full px-5 py-4 bg-black/30 backdrop-blur-sm border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${focusedField === 'signup-email'
                        ? 'border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                        : 'border-white/10 hover:border-white/20'
                        }`}
                      required
                    />
                  </motion.div>

                  {/* 비밀번호 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="signup-password" className="block text-sm font-semibold text-yellow-200/90 mb-2 tracking-wide">
                      비밀번호
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('signup-password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className={`w-full px-5 py-4 bg-black/30 backdrop-blur-sm border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${focusedField === 'signup-password'
                        ? 'border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                        : 'border-white/10 hover:border-white/20'
                        }`}
                      required
                    />
                  </motion.div>

                  {/* 비밀번호 확인 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label htmlFor="signup-password-confirm" className="block text-sm font-semibold text-yellow-200/90 mb-2 tracking-wide">
                      비밀번호 확인
                    </label>
                    <input
                      id="signup-password-confirm"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      onFocus={() => setFocusedField('password-confirm')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className={`w-full px-5 py-4 bg-black/30 backdrop-blur-sm border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${focusedField === 'password-confirm'
                        ? 'border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                        : 'border-white/10 hover:border-white/20'
                        }`}
                      required
                    />
                  </motion.div>

                  {/* 가입하기 버튼 */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '처리 중...' : '가입하기'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* 구분선 */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-yellow-200/50 font-medium tracking-wide">
                  또는 소셜 계정으로 시작하기
                </span>
              </div>
            </div>

            {/* 소셜 로그인 버튼 */}
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Google 로그인 */}
              <motion.button
                onClick={handleGoogleLogin}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-2xl transition-all shadow-lg hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)]"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="tracking-wide">Google로 시작하기</span>
              </motion.button>

              {/* Kakao 로그인 */}
              <motion.button
                onClick={handleKakaoLogin}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] font-bold rounded-2xl transition-all shadow-lg hover:shadow-[0_20px_40px_rgba(254,229,0,0.3)]"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-1.363l.427-.413 1.428 2.033a.472.472 0 1 0 .773-.543l-1.514-2.155zm-2.958 1.924h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 1 0 0-.944zm-5.857-1.092l.696-1.707.638 1.707H9.092zm2.523.488l.002-.016a.469.469 0 0 0-.127-.32l-1.046-2.8a.69.69 0 0 0-.627-.474.696.696 0 0 0-.653.447l-1.661 4.075a.472.472 0 0 0 .874.357l.33-.813h2.07l.299.8a.472.472 0 1 0 .884-.33l-.345-.926zM8.293 9.302a.472.472 0 0 0-.471-.472H4.577a.472.472 0 1 0 0 .944h1.16v3.736a.472.472 0 0 0 .944 0V9.774h1.14c.261 0 .472-.212.472-.472z" />
                </svg>
                <span className="tracking-wide">카카오로 시작하기</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* 푸터 텍스트 */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-8"
          >
            <motion.p
              className="text-yellow-200/50 text-sm tracking-widest"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              당신의 선택, 운명이 되다 ✨
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
