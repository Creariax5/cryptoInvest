import { useState, useCallback, useEffect, useRef } from 'react';
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
    selectedTimeframe: 30,
    currentPrice: 0
  });

  // Keep track of the maximum timeframe we've already fetched
  const maxFetchedTimeframe = useRef(0);
  // Store the complete pool day data
  const allPoolDayData = useRef([]);

  const setTimeframe = (days) => {
    setUiState(prev => ({
      ...prev,
      selectedTimeframe: days
    }));

    // If we need more data, fetch it in the background
    if (days > maxFetchedTimeframe.current) {
      fetchAdditionalData(days);
    } else {
      // If we already have the data, just update the view
      updatePoolDataView(days);
    }
  };

  const updatePoolDataView = (days) => {
    if (!allPoolDayData.current.length) return;

    // Filter the data we already have to match the requested timeframe
    const filteredData = allPoolDayData.current
      .slice(0, days)
      .sort((a, b) => b.date - a.date);

    setPoolData(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        poolDayData: filteredData
      }
    }));
  };

  const fetchAdditionalData = async (days) => {
    try {
      // Only fetch analytics since we need more historical data
      const analytics = await fetchPoolAnalytics(poolAddress, days);
      
      // Update our cached data
      allPoolDayData.current = analytics.poolDayData || [];
      maxFetchedTimeframe.current = days;

      // Update the UI with new data
      setPoolData(prev => ({
        ...prev,
        analytics: {
          ...analytics,
          poolDayData: analytics.poolDayData || []
        }
      }));
    } catch (err) {
      console.error('Error fetching additional data:', err);
      // Don't show error UI for background fetch failures
    }
  };

  const fetchInitialPoolData = useCallback(async () => {
    try {
      setUiState(prev => ({ ...prev, loading: true, error: null }));
      
      const [poolInfo, analytics, ticks] = await Promise.all([
        fetchPoolInfo(poolAddress),
        fetchPoolAnalytics(poolAddress, uiState.selectedTimeframe),
        fetchPoolTicks(poolAddress)
      ]);

      const currentPrice = analytics?.token0Price ? Number(analytics.token0Price) : 0;
      
      // Store the initial pool day data
      allPoolDayData.current = analytics.poolDayData || [];
      maxFetchedTimeframe.current = uiState.selectedTimeframe;

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
  }, [poolAddress]);

  useEffect(() => {
    fetchInitialPoolData();
  }, [fetchInitialPoolData]);

  return { 
    poolData, 
    positionConfig, 
    uiState, 
    setPositionConfig,
    setTimeframe 
  };
};