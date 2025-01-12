import React from 'react';
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

const PoolSimulator = ({ poolAddress }) => {
  const { poolData, positionConfig, uiState, setPositionConfig, setTimeframe } = usePoolData(poolAddress);
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
      <PoolHeader 
        poolAddress={poolAddress} 
        poolInfo={poolData.poolInfo} 
        currentPrice={uiState.currentPrice} 
      />

      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-6">  
          <PositionConfig
            positionConfig={positionConfig}
            setPositionConfig={setPositionConfig}
            currentPrice={uiState.currentPrice}
            timeframe={uiState.selectedTimeframe}
            onTimeframeChange={handleTimeframeChange}
          />
          <PositionMetrics 
            metrics={metrics}
            positionConfig={positionConfig}
            isInRange={metrics?.activeRange}
          />
        </div>
        <PoolMetrics 
          metrics={metrics} 
          isInRange={metrics?.activeRange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatsGrid 
          poolData={poolData} 
          priceRange={positionConfig.range}
        />
      </div>
    </div>
  );
};

export default PoolSimulator;