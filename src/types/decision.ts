/**
 * 결정 옵션 인터페이스
 * 각 옵션은 고유 ID, 라벨, 가중치, 확률을 가집니다
 */
export interface DecisionOption {
  id: string;           // 고유 식별자
  label: string;        // 옵션 이름
  weight: number;       // 가중치 (0 이상의 숫자)
  probability: number;   // 계산된 확률 (0-1 사이)
  characterId?: number; // 할당된 캐릭터 ID (1-4)
}




