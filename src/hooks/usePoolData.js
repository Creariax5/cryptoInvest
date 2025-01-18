import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPoolInfo, fetchPoolAnalytics, fetchPoolTicks } from '../services/ApiServices';

export const usePoolData = (poolAddress) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isTokenOrderReversed = searchParams.get('reversed') === 'true';
  
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
    currentPrice: 0,
    isTokenOrderReversed
  });

  const maxFetchedTimeframe = useRef(0);
  const allPoolDayData = useRef([]);

  // Helper function to reverse pool day data
  const reversePoolDayData = useCallback((data) => {
    return data.map(day => ({
      ...day,
      token0Price: 1 / Number(day.token0Price),
      token1Price: 1 / Number(day.token1Price)
    }));
  }, []);

  const toggleTokenOrder = useCallback(() => {
    const newIsReversed = !uiState.isTokenOrderReversed;

    // Update UI state first
    setUiState(prev => ({
      ...prev,
      isTokenOrderReversed: newIsReversed,
      currentPrice: 1 / prev.currentPrice
    }));

    // Update pool data
    setPoolData(prev => {
      if (!prev.analytics?.poolDayData) return prev;

      const reversedPoolDayData = reversePoolDayData(prev.analytics.poolDayData);

      return {
        ...prev,
        analytics: {
          ...prev.analytics,
          token0Price: 1 / Number(prev.analytics.token0Price),
          token1Price: 1 / Number(prev.analytics.token1Price),
          poolDayData: reversedPoolDayData
        }
      };
    });

    // Update position range
    setPositionConfig(prev => ({
      ...prev,
      range: {
        min: 1 / prev.range.max,
        max: 1 / prev.range.min
      }
    }));

    // Update URL params last, with replace: true to prevent navigation
    const newParams = new URLSearchParams(searchParams);
    newParams.set('reversed', newIsReversed.toString());
    setSearchParams(newParams, { replace: true });
  }, [uiState.isTokenOrderReversed, setSearchParams, reversePoolDayData, searchParams]);

  const setTimeframe = useCallback(async (days) => {
    setUiState(prev => ({
      ...prev,
      selectedTimeframe: days
    }));

    try {
      if (days > maxFetchedTimeframe.current) {
        // Fetch new data if needed
        const analytics = await fetchPoolAnalytics(poolAddress, days);
        
        // Store original data
        allPoolDayData.current = analytics.poolDayData || [];
        maxFetchedTimeframe.current = days;

        // Process data according to current token order
        const processedData = uiState.isTokenOrderReversed
          ? reversePoolDayData(analytics.poolDayData)
          : analytics.poolDayData;

        setPoolData(prev => ({
          ...prev,
          analytics: {
            ...prev.analytics,
            ...analytics,
            poolDayData: processedData
          }
        }));
      } else {
        // Use existing data for shorter timeframes
        const filteredData = allPoolDayData.current
          .slice(0, days)
          .sort((a, b) => b.date - a.date);

        // Process filtered data according to current token order
        const processedData = uiState.isTokenOrderReversed
          ? reversePoolDayData(filteredData)
          : filteredData;

        setPoolData(prev => ({
          ...prev,
          analytics: {
            ...prev.analytics,
            poolDayData: processedData
          }
        }));
      }
    } catch (err) {
      console.error('Error updating timeframe:', err);
    }
  }, [poolAddress, uiState.isTokenOrderReversed, reversePoolDayData]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialPoolData = async () => {
      try {
        setUiState(prev => ({ ...prev, loading: true, error: null }));
        
        const [poolInfo, analytics, ticks] = await Promise.all([
          fetchPoolInfo(poolAddress),
          fetchPoolAnalytics(poolAddress, uiState.selectedTimeframe),
          fetchPoolTicks(poolAddress)
        ]);

        let currentPrice = analytics?.token0Price ? Number(analytics.token0Price) : 0;
        let processedAnalytics = { ...analytics };
        
        if (isTokenOrderReversed) {
          currentPrice = 1 / currentPrice;
          processedAnalytics.token0Price = 1 / Number(analytics.token0Price);
          processedAnalytics.token1Price = 1 / Number(analytics.token1Price);
          processedAnalytics.poolDayData = reversePoolDayData(analytics.poolDayData);
        }

        // Store original data
        allPoolDayData.current = analytics.poolDayData || [];
        maxFetchedTimeframe.current = uiState.selectedTimeframe;

        setPoolData({ 
          poolInfo, 
          analytics: processedAnalytics, 
          ticks 
        });
        
        setUiState(prev => ({ 
          ...prev, 
          currentPrice,
          loading: false,
          isTokenOrderReversed 
        }));
        
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
          error: 'Failed to load pool data. Please try again later.',
          loading: false
        }));
        console.error('Error fetching data:', err);
      }
    };

    fetchInitialPoolData();
  }, [poolAddress, isTokenOrderReversed, reversePoolDayData]);

  return { 
    poolData, 
    positionConfig, 
    uiState,
    setPositionConfig,
    setTimeframe,
    toggleTokenOrder
  };
};