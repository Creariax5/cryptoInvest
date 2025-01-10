import { useMemo } from 'react';
import { calculateImpermanentLoss, calculateFeeLast24 } from '../utils/calculations';

export const usePoolMetrics = (poolData, uiState, positionConfig) => {
  return useMemo(() => {
    if (!poolData.analytics || !uiState.currentPrice) return null;

    const initialPrice = Number(poolData.analytics.poolDayData?.[0]?.token0Price) || uiState.currentPrice;
    const volume24h = Number(poolData.analytics.volumeUSD) || 0;
    const tvl = Number(poolData.analytics.totalValueLockedUSD) || 0;
    const fee = (poolData.poolInfo?.fee || 0) / 1000000;

    const il = calculateImpermanentLoss(
      initialPrice,
      uiState.currentPrice,
      positionConfig.range.min,
      positionConfig.range.max
    );

    const feeLast24 = calculateFeeLast24(volume24h, tvl, fee);

    return {
      impermanentLoss: il,
      feeLast24,
      projectedReturn: (feeLast24 * 365) - Math.abs(il),
      activeRange: uiState.currentPrice >= positionConfig.range.min && 
                  uiState.currentPrice <= positionConfig.range.max,
      volume24h,
      tvl,
      volatility: (poolData.analytics?.volatility24h || 0) * 100
    };
  }, [poolData, uiState.currentPrice, positionConfig.range]);
}
