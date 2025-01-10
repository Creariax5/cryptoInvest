import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from './Card';

const StatChart = ({ data, metric }) => {
  const formatValue = (value) => {
    switch (metric) {
      case 'volume':
        return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      case 'tvl':
        return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      case 'fees':
        return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      case 'price':
        return `$${Number(value).toFixed(2)}`;
      default:
        return value;
    }
  };

  const getDataKey = () => {
    switch (metric) {
      case 'volume':
        return 'volumeUSD';
      case 'tvl':
        return 'tvlUSD';
      case 'fees':
        return 'feesUSD';
      case 'price':
        return 'token0Price';
      default:
        return '';
    }
  };

  const dataKey = getDataKey();

  // Sort data chronologically
  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => a.date - b.date);
  }, [data]);

  // Calculate Y-axis domain with padding
  const yDomain = useMemo(() => {
    if (!sortedData.length) return [0, 0];
    
    const values = sortedData.map(item => Number(item[dataKey]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const padding = (max - min) * 0.05;
    return [
      Math.max(0, min - padding),
      max + padding
    ];
  }, [sortedData, dataKey]);

  return (
    <Card className="mt-4 bg-gray-800">
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={sortedData}
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
                padding={{ left: 30, right: 30 }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={formatValue}
                domain={yDomain}
                padding={{ top: 20, bottom: 20 }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.375rem'
                }}
                formatter={value => [formatValue(value), metric.toUpperCase()]}
                labelFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey}
                stroke="#10B981"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatChart;