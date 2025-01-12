import React, { memo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/Alert';
import { usePoolData } from './hooks/usePoolData';
import { usePoolMetrics } from './hooks/usePoolMetrics';
import { LoadingState } from './components/ui/LoadingState';
import { PoolHeader } from './components/PoolHeader';
import { PositionConfig } from './components/PositionConfig';
import { PositionMetrics } from './components/PositionMetrics';
import { PoolMetrics } from './components/PoolMetrics';
import { StatsGrid } from './components/StatsGrid';

// Memoize child components to prevent unnecessary re-renders
const MemoizedPoolHeader = memo(PoolHeader);
const MemoizedPositionConfig = memo(PositionConfig);
const MemoizedPositionMetrics = memo(PositionMetrics);
const MemoizedPoolMetrics = memo(PoolMetrics);
const MemoizedStatsGrid = memo(StatsGrid);

const PoolSimulator = ({ poolAddress }) => {
  const { 
    poolData, 
    positionConfig, 
    uiState, 
    setPositionConfig, 
    setTimeframe,
    toggleTokenOrder 
  } = usePoolData(poolAddress);
  
  const metrics = usePoolMetrics(poolData, uiState, positionConfig);

  if (uiState.loading) {
    return <LoadingState />;
  }

  if (uiState.error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{uiState.error}</AlertDescription>
      </Alert>
    );
  }

  const handleTimeframeChange = (days) => {
    setTimeframe(days);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <MemoizedPoolHeader 
        poolAddress={poolAddress} 
        poolInfo={poolData.poolInfo} 
        currentPrice={uiState.currentPrice}
        isTokenOrderReversed={uiState.isTokenOrderReversed}
        onToggleTokenOrder={toggleTokenOrder}
      />

      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-6">  
          <MemoizedPositionConfig
            positionConfig={positionConfig}
            setPositionConfig={setPositionConfig}
            currentPrice={uiState.currentPrice}
            timeframe={uiState.selectedTimeframe}
            onTimeframeChange={handleTimeframeChange}
          />
          <MemoizedPositionMetrics 
            metrics={metrics}
            positionConfig={positionConfig}
            isInRange={metrics?.activeRange}
          />
        </div>
        <MemoizedStatsGrid 
          poolData={poolData} 
          priceRange={positionConfig.range}
          depositAmount={positionConfig.depositAmount}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <></>
      </div>
    </div>
  );
};

export default PoolSimulator;