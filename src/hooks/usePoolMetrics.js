import { useMemo } from 'react';
import { calculateImpermanentLoss } from '../utils/calculations';

export const usePoolMetrics = (poolData, uiState, positionConfig) => {
  return useMemo(() => {
    if (!poolData.analytics?.poolDayData || !uiState.currentPrice) return null;

    const initialPrice = Number(poolData.analytics.poolDayData?.[0]?.token0Price) || uiState.currentPrice;
    const tvl = Number(poolData.analytics.totalValueLockedUSD) || 0;
    const fee = (poolData.poolInfo?.fee || 0) / 1000000;

    // Calculate average daily fees over the timeframe
    const dailyFees = poolData.analytics.poolDayData.map(day => Number(day.feesUSD));
    const averageDailyFee = dailyFees.reduce((sum, fee) => sum + fee, 0) / dailyFees.length;
    
    // Calculate fee metrics
    const feeLast24 = (averageDailyFee / tvl) * 100;

    const il = calculateImpermanentLoss(
      initialPrice,
      uiState.currentPrice,
      positionConfig.range.min,
      positionConfig.range.max
    );

    return {
      impermanentLoss: il,
      feeLast24,
      projectedReturn: (feeLast24 * 365) - Math.abs(il),
      activeRange: uiState.currentPrice >= positionConfig.range.min && 
                  uiState.currentPrice <= positionConfig.range.max,
      volume24h: Number(poolData.analytics.volumeUSD),
      tvl,
      volatility: (poolData.analytics?.volatility24h || 0) * 100
    };
  }, [poolData, uiState.currentPrice, positionConfig.range]);
};