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

  const toggleTokenOrder = useCallback(() => {
    // Update URL without refresh by using state instead of URL params
    setUiState(prev => ({
      ...prev,
      isTokenOrderReversed: !prev.isTokenOrderReversed,
      currentPrice: 1 / prev.currentPrice
    }));

    // Update poolData with reversed prices
    setPoolData(prev => {
      if (!prev.analytics?.poolDayData) return prev;

      const reversedPoolDayData = prev.analytics.poolDayData.map(day => ({
        ...day,
        token0Price: 1 / Number(day.token0Price),
        token1Price: 1 / Number(day.token1Price)
      }));

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

    // Update URL without causing refresh
    setSearchParams(
      params => {
        params.set('reversed', (!isTokenOrderReversed).toString());
        return params;
      },
      { replace: true }
    );
  }, [isTokenOrderReversed, setSearchParams]);

  const setTimeframe = useCallback(async (days) => {
    setUiState(prev => ({
      ...prev,
      selectedTimeframe: days
    }));

    if (days > maxFetchedTimeframe.current) {
      try {
        const analytics = await fetchPoolAnalytics(poolAddress, days);
        allPoolDayData.current = analytics.poolDayData || [];
        maxFetchedTimeframe.current = days;

        const processedData = uiState.isTokenOrderReversed
          ? analytics.poolDayData.map(day => ({
              ...day,
              token0Price: 1 / Number(day.token0Price),
              token1Price: 1 / Number(day.token1Price)
            }))
          : analytics.poolDayData;

        setPoolData(prev => ({
          ...prev,
          analytics: {
            ...prev.analytics,
            ...analytics,
            poolDayData: processedData
          }
        }));
      } catch (err) {
        console.error('Error fetching additional data:', err);
      }
    } else {
      // Use existing data for shorter timeframes
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
    }
  }, [poolAddress, uiState.isTokenOrderReversed]);

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
        
        if (isTokenOrderReversed) {
          currentPrice = 1 / currentPrice;
          analytics.poolDayData = analytics.poolDayData.map(day => ({
            ...day,
            token0Price: 1 / Number(day.token0Price),
            token1Price: 1 / Number(day.token1Price)
          }));
        }

        allPoolDayData.current = analytics.poolDayData || [];
        maxFetchedTimeframe.current = uiState.selectedTimeframe;

        setPoolData({ poolInfo, analytics, ticks });
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
  }, [poolAddress]); // Remove isTokenOrderReversed dependency

  return { 
    poolData, 
    positionConfig, 
    uiState,
    setPositionConfig,
    setTimeframe,
    toggleTokenOrder
  };
};