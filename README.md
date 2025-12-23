# 영만이의 뽑기 도사 🔮

**운명을 결정하는 가장 명쾌한 방법**

가중치 기반 결정 도구로, 각 옵션에 가중치를 설정하여 확률을 조절하고 운명을 결정할 수 있습니다.

## ✨ 주요 기능

### 🎯 가중치 기반 결정 시스템
- 각 옵션에 가중치를 설정하여 확률 조절
- 실시간 확률 계산 및 시각화
- 박진감 넘치는 칼 싸움 애니메이션으로 결과 표시
- 옵션 이름 직접 편집 가능

### 🎨 프리미엄 UI/UX
- 피그마 전문가 수준의 디자인
- Glassmorphism 효과 적용
- 운명의 수레바퀴 배경 효과
- 별무리(Starfield) 애니메이션
- 다크 모드 최적화

### 🔐 인증 시스템
- 이메일 로그인/회원가입
- Google 소셜 로그인
- Kakao 소셜 로그인
- 부드러운 모드 전환 애니메이션

## 🛠 기술 스택

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Effects**: canvas-confetti

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
cd my-project
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
my-project/
├── app/
│   ├── (auth)/          # 로그인/회원가입 페이지
│   │   └── page.tsx
│   ├── dashboard/       # 메인 대시보드
│   │   └── page.tsx
│   ├── layout.tsx       # 루트 레이아웃
│   └── globals.css      # 전역 스타일
├── src/
│   ├── components/
│   │   └── decision/    # 결정 관련 컴포넌트
│   │       ├── WeightSlider.tsx      # 가중치 슬라이더
│   │       ├── ProbabilityChart.tsx  # 확률 차트
│   │       └── ResultOverlay.tsx     # 결과 오버레이
│   ├── lib/
│   │   └── calculations.ts           # 확률 계산 로직
│   └── types/
│       └── decision.ts               # TypeScript 타입 정의
└── public/              # 정적 파일
```

## 🎮 사용 방법

1. **로그인/회원가입**: 첫 화면에서 계정을 생성하거나 로그인합니다.
2. **옵션 추가**: 대시보드에서 "+ 추가" 버튼을 클릭하여 옵션을 추가합니다.
3. **가중치 설정**: 각 옵션의 슬라이더를 조절하여 가중치를 설정합니다.
4. **결정하기**: "🎲 결정하기" 버튼을 클릭하면 칼 싸움 애니메이션과 함께 결과가 표시됩니다.

## 🎨 주요 컴포넌트

- **WeightSlider**: 가중치를 조절하는 슬라이더 컴포넌트 (Framer Motion 애니메이션)
- **ProbabilityChart**: 각 옵션의 확률을 시각적으로 보여주는 차트
- **ResultOverlay**: 박진감 넘치는 칼 싸움 애니메이션과 함께 결과를 표시

## 🔧 성능 최적화

- Hydration 에러 완전 해결
- 별무리 효과 최적화 (40개 파티클)
- GPU 가속 활용 (transform 속성만 사용)
- useMemo를 통한 불필요한 재계산 방지

## 📝 라이선스

MIT

---

**영만이의 뽑기 도사**로 당신의 운명을 결정하세요! ✨
