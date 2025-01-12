import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import ChartWrapper from './ChartWrapper';

// Shared chart configurations
const chartConfig = {
  grid: {
    strokeDasharray: "3 3",
    stroke: "#374151"
  },
  axis: {
    stroke: "#9CA3AF",
    tick: { fill: "#9CA3AF" }
  },
  tooltip: {
    contentStyle: {
      backgroundColor: "#1F2937",
      border: "1px solid #374151",
      borderRadius: "0.375rem"
    }
  }
};

// Price Chart Component
export const PriceChart = ({ data, priceRange }) => {
  const formatPrice = (value) => `$${Number(value).toFixed(2)}`;
  const sortedData = [...data].sort((a, b) => a.date - b.date);
  
  const values = sortedData.map(item => Number(item.token0Price));
  let min = Math.min(...values, priceRange?.min || Infinity);
  let max = Math.max(...values, priceRange?.max || -Infinity);
  const padding = (max - min) * 0.05;
  const yDomain = [Math.max(0, min - padding), max + padding];

  return (
    <ChartWrapper>
      <LineChart data={sortedData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid {...chartConfig.grid} />
        <XAxis 
          dataKey="date"
          {...chartConfig.axis}
          tickFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
          padding={{ left: 30, right: 30 }}
        />
        <YAxis
          {...chartConfig.axis}
          tickFormatter={formatPrice}
          domain={yDomain}
          width={80}
        />
        <Tooltip
          {...chartConfig.tooltip}
          formatter={(value) => [formatPrice(value), 'Price']}
          labelFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
        />
        <Line
          type="monotone"
          dataKey="token0Price"
          stroke="#10B981"
          dot={false}
          strokeWidth={2}
        />
        {priceRange && (
          <>
            <ReferenceLine
              y={priceRange.min}
              stroke="#EF4444"
              strokeDasharray="3 3"
              label={{
                value: `Min: ${formatPrice(priceRange.min)}`,
                position: 'right',
                fill: '#EF4444'
              }}
            />
            <ReferenceLine
              y={priceRange.max}
              stroke="#EF4444"
              strokeDasharray="3 3"
              label={{
                value: `Max: ${formatPrice(priceRange.max)}`,
                position: 'right',
                fill: '#EF4444'
              }}
            />
          </>
        )}
      </LineChart>
    </ChartWrapper>
  );
};

// TVL Chart Component
export const TvlChart = ({ data }) => {
  const sortedData = [...data].sort((a, b) => a.date - b.date);
  const formatValue = (value) => `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  
  const values = sortedData.map(item => Number(item.tvlUSD));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1;
  const yDomain = [Math.max(0, min - padding), max + padding];

  return (
    <ChartWrapper>
      <LineChart data={sortedData} margin={{ top: 5, right: 30, left: 10, bottom: 0 }}>
        <CartesianGrid {...chartConfig.grid} />
        <XAxis
          dataKey="date"
          {...chartConfig.axis}
          tickFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
          padding={{ left: 30, right: 30 }}
        />
        <YAxis
          {...chartConfig.axis}
          tickFormatter={formatValue}
          width={80}
          domain={yDomain}
        />
        <Tooltip
          {...chartConfig.tooltip}
          formatter={(value) => [formatValue(value), 'TVL']}
          labelFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
        />
        <Line
          type="monotone"
          dataKey="tvlUSD"
          stroke="#10B981"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ChartWrapper>
  );
};

// Combined Volume and Fees Chart Component
export const VolumeAndFeesChart = ({ data }) => {
  const formatValue = (value) => `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const sortedData = [...data].sort((a, b) => a.date - b.date);
  
  const volumes = sortedData.map(item => Number(item.volumeUSD));
  const fees = sortedData.map(item => Number(item.feesUSD));
  const maxValue = Math.max(...volumes, ...fees);
  const yDomain = [0, maxValue * 1.1];

  return (
    <ChartWrapper>
      <BarChart data={sortedData} margin={{ top: 5, right: 30, left: 10, bottom: 0 }}>
        <CartesianGrid {...chartConfig.grid} />
        <XAxis
          dataKey="date"
          {...chartConfig.axis}
          tickFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
          padding={{ left: 30, right: 30 }}
        />
        <YAxis
          {...chartConfig.axis}
          tickFormatter={formatValue}
          width={80}
          domain={yDomain}
        />
        <Tooltip
          {...chartConfig.tooltip}
          formatter={(value, name) => [formatValue(value), name === 'volumeUSD' ? 'Volume' : 'Fees']}
          labelFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
        />
        <Bar dataKey="volumeUSD" fill="#10B981" name="Volume" />
        <Bar dataKey="feesUSD" fill="#6366F1" name="Fees" />
      </BarChart>
    </ChartWrapper>
  );
};

// Fees per TVL Chart Component
export const FeesPerTVLChart = ({ data, depositAmount }) => {
  const chartData = useMemo(() => {
    const processedData = data.map(day => ({
      date: day.date,
      feesPerTVL: (Number(day.feesUSD) / Number(day.tvlUSD)) * depositAmount
    })).filter(item => !isNaN(item.feesPerTVL) && isFinite(item.feesPerTVL));
    
    return [...processedData].sort((a, b) => a.date - b.date);
  }, [data, depositAmount]);

  return (
    <ChartWrapper>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 0 }}>
        <CartesianGrid {...chartConfig.grid} />
        <XAxis
          dataKey="date"
          {...chartConfig.axis}
          tickFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
          padding={{ left: 30, right: 30 }}
        />
        <YAxis
          {...chartConfig.axis}
          tickFormatter={(value) => `$${value.toFixed(2)}`}
          width={80}
        />
        <Tooltip
          {...chartConfig.tooltip}
          formatter={(value) => [`$${value.toFixed(2)}`, 'Daily Fees']}
          labelFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
        />
        <Bar
          dataKey="feesPerTVL"
          fill="#10B981"
          name="Daily Fees"
        />
      </BarChart>
    </ChartWrapper>
  );
};
