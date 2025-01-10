import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

export const PositionConfig = ({ 
  positionConfig, 
  setPositionConfig, 
  currentPrice,
  timeframe,
  onTimeframeChange 
}) => {
  // Calculate percentages based on current price
  const getPercentFromPrice = (price) => {
    const percentDiff = ((price / currentPrice) - 1) * 100;
    return Math.round(percentDiff);
  };

  // Calculate price from percentage
  const getPriceFromPercent = (percent) => {
    return currentPrice * (1 + percent / 100);
  };

  // Handle slider changes
  const handleMinPercentChange = (e) => {
    const percent = Number(e.target.value);
    const newPrice = getPriceFromPercent(-percent);
    setPositionConfig(prev => ({
      ...prev,
      range: { ...prev.range, min: newPrice }
    }));
  };

  const handleMaxPercentChange = (e) => {
    const percent = Number(e.target.value);
    const newPrice = getPriceFromPercent(percent);
    setPositionConfig(prev => ({
      ...prev,
      range: { ...prev.range, max: newPrice }
    }));
  };

  // Calculate current percentages
  const minPercent = getPercentFromPrice(positionConfig.range.min);
  const maxPercent = getPercentFromPrice(positionConfig.range.max);

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Position Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">Deposit Amount (USD)</label>
          </div>
          <input
            type="number"
            value={positionConfig.depositAmount}
            onChange={(e) => setPositionConfig(prev => ({
              ...prev,
              depositAmount: Number(e.target.value)
            }))}
            className="w-full bg-gray-700 rounded p-2"
            min="0"
          />
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Min Price</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{minPercent}%</span>
                </div>
              </div>
              <input
                type="number"
                value={positionConfig.range.min}
                onChange={(e) => setPositionConfig(prev => ({
                  ...prev,
                  range: { ...prev.range, min: Number(e.target.value) }
                }))}
                className="w-full bg-gray-700 rounded p-2"
                min="0"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={-minPercent}
                onChange={handleMinPercentChange}
                className="w-full accent-green-500 bg-gray-700"
                style={{ direction: 'rtl' }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Max Price</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{maxPercent}%</span>
                </div>
              </div>
              <input
                type="number"
                value={positionConfig.range.max}
                onChange={(e) => setPositionConfig(prev => ({
                  ...prev,
                  range: { ...prev.range, max: Number(e.target.value) }
                }))}
                className="w-full bg-gray-700 rounded p-2"
                min="0"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={maxPercent}
                onChange={handleMaxPercentChange}
                className="w-full accent-green-500 bg-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">Chart Timeframe (Days)</label>
            <span className="text-sm text-gray-400">{timeframe} days</span>
          </div>
          <input
            type="number"
            value={timeframe}
            onChange={(e) => onTimeframeChange(Math.max(1, Math.min(365, Number(e.target.value))))}
            className="w-full bg-gray-700 rounded p-2 mb-2"
            min="1"
            max="365"
          />
          <input
            type="range"
            min="1"
            max="365"
            value={timeframe}
            onChange={(e) => onTimeframeChange(Number(e.target.value))}
            className="w-full accent-green-500 bg-gray-700"
          />
        </div>

        <div className="text-sm text-gray-400 text-center">
          Current Price: ${currentPrice.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
};
