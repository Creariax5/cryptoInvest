import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { ArrowLeftRight, Home, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import TradingSimulator from '../simulator/TradingSimulator';

const TokenPair = ({ token0, token1, onSwap }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-semibold text-lg">
        {token0.symbol}/{token1.symbol}
      </span>
      <button
        onClick={onSwap}
        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
        title="Switch token order"
      >
        <ArrowLeftRight className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

export const PoolHeader = ({ 
  poolAddress, 
  poolInfo, 
  currentPrice, 
  isTokenOrderReversed,
  onToggleTokenOrder 
}) => {
  const [showSimulator, setShowSimulator] = useState(false);

  if (!poolInfo?.token0 || !poolInfo?.token1) {
    return (
      <Card className="bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Pool {poolAddress.slice(0, 6)}...{poolAddress.slice(-4)}
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const token0 = isTokenOrderReversed ? poolInfo.token1 : poolInfo.token0;
  const token1 = isTokenOrderReversed ? poolInfo.token0 : poolInfo.token1;

  return (
    <>
      <Card className="bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={`/`}
              className="block no-underline"
            >
              <Home className="w-6 h-6 text-gray-400 hover:text-gray-300" />
            </Link>
            <TokenPair 
              token0={token0}
              token1={token1}
              onSwap={onToggleTokenOrder}
            />
            <div className="bg-blue-900 px-2 py-1 rounded text-sm">
              {((poolInfo?.fee || 0) / 10000).toFixed(2)}% Fee
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{showSimulator ? 'Hide Simulator' : 'Trading Simulator'}</span>
            </button>
            <div className="font-mono">
              ${currentPrice.toFixed(4)}
            </div>
          </div>
        </CardHeader>
      </Card>

      {showSimulator && (
        <div className="mt-6">
          <TradingSimulator 
            poolInfo={poolInfo} 
            onClose={() => setShowSimulator(false)} 
          />
        </div>
      )}
    </>
  );
};