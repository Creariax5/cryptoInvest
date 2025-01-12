import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, ArrowUpDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { Alert, AlertCircle, AlertDescription } from './components/ui/Alert';
import { Skeleton } from './components/ui/Skeleton';

// Time period selector component
const TimePeriodSelector = ({ currentPeriod, onPeriodChange }) => {
  const periods = [
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
  ];

  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="flex gap-2">
        {periods.map(period => (
          <button
            key={period.value}
            onClick={() => onPeriodChange(period.value)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              currentPeriod === period.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Sorting options component
const SortControls = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: 'tvl', label: 'TVL' },
    { value: 'volume', label: '24h Volume' },
    { value: 'feeApr', label: 'Fee APR' },
    { value: 'fee', label: 'Fee Tier' }
  ];

  return (
    <div className="flex items-center space-x-2 mb-4">
      <ArrowUpDown className="h-4 w-4 text-gray-400" />
      <span className="text-sm text-gray-400">Sort by:</span>
      <div className="flex gap-2">
        {sortOptions.map(option => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              currentSort === option.value
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const TopPools = () => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('tvl');
  const [timePeriod, setTimePeriod] = useState('1D');

  useEffect(() => {
    const fetchTopPools = async () => {
      try {
        const response = await fetch('https://crypto-api-xi.vercel.app/api/v1/crypto/pools/top');
        if (!response.ok) throw new Error('Failed to fetch top pools');
        const data = await response.json();
        
        // Filter and process pools
        const validPools = data.filter(pool => {
          if (!pool.token0?.symbol || !pool.token1?.symbol) return false;
          if (Number(pool.volumeUSD) === 0) return false;
          if (Number(pool.totalValueLockedUSD) > 1000000000) return false;
          if (pool.token0.symbol.toLowerCase().includes('ez-') || 
              pool.token1.symbol.toLowerCase().includes('ez-')) return false;
          return true;
        }).map(pool => {
          const calculateMetrics = (days) => {
            const relevantData = pool.poolDayData.slice(0, days);
            const avgVolume = relevantData.reduce((sum, day) => sum + Number(day.volumeUSD), 0) / days;
            const avgFees = relevantData.reduce((sum, day) => sum + Number(day.feesUSD), 0) / days;
            return {
              volume: avgVolume,
              feeApr: (avgFees / Number(pool.totalValueLockedUSD)) * 365 * 100
            };
          };

          let metrics;
          switch (timePeriod) {
            case '1W':
              metrics = calculateMetrics(7);
              break;
            case '1M':
              metrics = calculateMetrics(30);
              break;
            default: // 1D
              metrics = {
                volume: Number(pool.poolDayData[0]?.volumeUSD),
                feeApr: Number(pool.poolDayData[0]?.feesUSD) / Number(pool.totalValueLockedUSD) * 365 * 100
              };
          }

          return {
            ...pool,
            tvl: Number(pool.totalValueLockedUSD),
            volume: metrics.volume,
            feeApr: metrics.feeApr,
            fee: pool.feeTier / 10000
          };
        });

        setPools(validPools);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPools();
  }, [timePeriod]);

  const sortedPools = useMemo(() => {
    return [...pools].sort((a, b) => {
      switch (sortBy) {
        case 'tvl':
          return b.tvl - a.tvl;
        case 'volume':
          return b.volume - a.volume;
        case 'feeApr':
          return b.feeApr - a.feeApr;
        case 'fee':
          return b.fee - a.fee;
        default:
          return 0;
      }
    });
  }, [pools, sortBy]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Top Liquidity Pools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TimePeriodSelector 
                currentPeriod={timePeriod} 
                onPeriodChange={setTimePeriod} 
              />
              <SortControls 
                currentSort={sortBy} 
                onSortChange={setSortBy} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {sortedPools.map((pool) => (
            <Link 
              key={pool.id}
              to={`/${pool.id}`}
              className="block no-underline"
            >
              <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-xl font-semibold text-white">
                        {pool.token0.symbol}/{pool.token1.symbol}
                      </div>
                      <div className="bg-blue-900 px-2 py-1 rounded text-sm">
                        {pool.fee.toFixed(2)}% Fee
                      </div>
                      <div className="bg-green-900 px-2 py-1 rounded text-sm">
                        {pool.feeApr.toFixed(2)}% APR
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-400">TVL</div>
                          <div className="font-medium text-white">
                            ${pool.tvl.toLocaleString(undefined, {
                              maximumFractionDigits: 0
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-400">{timePeriod} Volume</div>
                          <div className="font-medium text-white">
                            ${pool.volume.toLocaleString(undefined, {
                              maximumFractionDigits: 0
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPools;