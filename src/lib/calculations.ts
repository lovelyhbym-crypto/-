import { DecisionOption } from '@/types/decision';

/**
 * 가중치 배열을 기반으로 각 옵션의 확률을 계산합니다
 * @param options - DecisionOption 배열
 * @returns 확률이 계산된 DecisionOption 배열
 */
export function calculateProbabilities(options: DecisionOption[]): DecisionOption[] {
  // 모든 가중치의 합계 계산
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  
  // 가중치 합계가 0이면 모든 옵션에 동일한 확률 부여
  if (totalWeight === 0) {
    const equalProbability = options.length > 0 ? 1 / options.length : 0;
    return options.map(option => ({
      ...option,
      probability: equalProbability
    }));
  }
  
  // 각 옵션의 확률 = 해당 옵션의 가중치 / 전체 가중치 합계
  return options.map(option => ({
    ...option,
    probability: option.weight / totalWeight
  }));
}

/**
 * 가중치 기반으로 랜덤하게 당첨자를 선정합니다
 * @param options - 확률이 계산된 DecisionOption 배열
 * @returns 당첨된 DecisionOption
 */
export function pickWinner(options: DecisionOption[]): DecisionOption {
  if (options.length === 0) {
    throw new Error('옵션이 없습니다.');
  }
  
  // 0부터 1 사이의 랜덤 숫자 생성
  const random = Math.random();
  
  // 누적 확률을 사용하여 당첨자 결정
  let cumulativeProbability = 0;
  for (const option of options) {
    cumulativeProbability += option.probability;
    if (random <= cumulativeProbability) {
      return option;
    }
  }
  
  // 마지막 옵션 반환 (반올림 오차 대비)
  return options[options.length - 1];
}




