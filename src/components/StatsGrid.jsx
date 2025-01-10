import React from 'react';
import { TrendingUp, DollarSign, Activity, Percent } from 'lucide-react';
import { Card, CardContent } from './Card';

// StatCard Component
const StatCard = ({ icon, label, value }) => (
  <Card className="bg-gray-800">
    <CardContent className="pt-6">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="text-xl mt-1 text-white">{value}</div>
    </CardContent>
  </Card>
);

// StatsGrid Component
export const StatsGrid = ({ metrics }) => (
  <div className="grid grid-cols-4 gap-4">
    {metrics && (
      <>
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-gray-400" />}
          label="24h Volume"
          value={`$${metrics.volume24h.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}`}
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-gray-400" />}
          label="TVL"
          value={`$${metrics.tvl.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}`}
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-gray-400" />}
          label="Price Volatility"
          value={`${metrics.volatility.toFixed(2)}%`}
        />
        <StatCard
          icon={<Percent className="w-5 h-5 text-gray-400" />}
          label="Avg Fee APR"
          value={`${(metrics.feeLast24 * 365).toFixed(2)}%`}
        />
      </>
    )}
  </div>
);

export default StatsGrid;