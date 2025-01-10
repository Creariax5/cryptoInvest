import { useState, useCallback, useEffect } from 'react';
import { fetchPoolInfo, fetchPoolAnalytics, fetchPoolTicks } from '../services/ApiServices';

export const usePoolData = (poolAddress) => {
  const [poolData, setPoolData] = useState({
    poolInfo: null,
    analytics: null,
    ticks: null
  });
  
  const [positionConfig, setPositionConfig] = useState({
    depositAmount: 1000,
    range: { min: 0, max: 0 }
  });
  
  const [uiState, setUiState] = useState({
    loading: true,
    error: null,
    selectedTimeframe: 365,
    currentPrice: 0
  });

  const fetchPoolData = useCallback(async () => {
    try {
      setUiState(prev => ({ ...prev, loading: true, error: null }));
      
      const [poolInfo, analytics, ticks] = await Promise.all([
        fetchPoolInfo(poolAddress),
        fetchPoolAnalytics(poolAddress, uiState.selectedTimeframe),
        fetchPoolTicks(poolAddress)
      ]);

      const currentPrice = analytics?.token0Price ? Number(analytics.token0Price) : 0;
      
      setPoolData({ poolInfo, analytics, ticks });
      setUiState(prev => ({ ...prev, currentPrice }));
      
      if (positionConfig.range.min === 0 && currentPrice > 0) {
        setPositionConfig(prev => ({
          ...prev,
          range: {
            min: currentPrice * 0.8,
            max: currentPrice * 1.2
          }
        }));
      }
    } catch (err) {
      setUiState(prev => ({ 
        ...prev, 
        error: 'Failed to load pool data. Please try again later.'
      }));
      console.error('Error fetching data:', err);
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  }, [poolAddress, uiState.selectedTimeframe]);

  useEffect(() => {
    fetchPoolData();
  }, [fetchPoolData]);

  return { poolData, positionConfig, uiState, setPositionConfig };
};