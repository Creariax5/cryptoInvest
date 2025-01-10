import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Activity, Percent, BarChart2 } from 'lucide-react';
import { Card, CardContent } from './Card';
import StatChart from './StatChart';

const StatCard = ({ icon, label, value, onShowChart }) => (
  <Card className="bg-gray-800">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        {onShowChart && (
          <button
            onClick={onShowChart}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            title="Show chart"
          >
            <BarChart2 className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
      <div className="text-xl mt-1 text-white">{value}</div>
    </CardContent>
  </Card>
);

export const StatsGrid = ({ poolData, priceRange }) => {
  const [activeChart, setActiveChart] = useState('price');

  const calculatedMetrics = useMemo(() => {
    if (!poolData?.analytics?.poolDayData) return null;

    // Calculate average daily fees over the timeframe
    const dailyFees = poolData.analytics.poolDayData.map(day => Number(day.feesUSD));
    const averageDailyFee = dailyFees.reduce((sum, fee) => sum + fee, 0) / dailyFees.length;
    
    const tvl = Number(poolData.analytics.totalValueLockedUSD);
    const feeAPR = (averageDailyFee * 365 * 100) / tvl;

    return {
      volume: Number(poolData.analytics.volumeUSD),
      tvl,
      price: Number(poolData.analytics.token0Price),
      feeAPR
    };
  }, [poolData]);

  if (!calculatedMetrics) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-gray-400" />}
          label="Total Volume"
          value={`$${calculatedMetrics.volume.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}`}
          onShowChart={() => setActiveChart('volume')}
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-gray-400" />}
          label="TVL"
          value={`$${calculatedMetrics.tvl.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}`}
          onShowChart={() => setActiveChart('tvl')}
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-gray-400" />}
          label="Token Price"
          value={`$${calculatedMetrics.price.toFixed(2)}`}
          onShowChart={() => setActiveChart('price')}
        />
        <StatCard
          icon={<Percent className="w-5 h-5 text-gray-400" />}
          label="Avg Fee APR"
          value={`${calculatedMetrics.feeAPR.toFixed(2)}%`}
          onShowChart={() => setActiveChart('fees')}
        />
      </div>
      
      {activeChart && poolData.analytics.poolDayData && (
        <StatChart 
          data={poolData.analytics.poolDayData}
          metric={activeChart}
          priceRange={activeChart === 'price' ? priceRange : null}
        />
      )}
    </div>
  );
};