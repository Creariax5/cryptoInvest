import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Alert, AlertCircle, AlertDescription } from "./ui/Alert";

export const PositionMetrics = ({ metrics, positionConfig, isInRange }) => {
  const [showAPY, setShowAPY] = useState(false);
  const [reinvestmentDays, setReinvestmentDays] = useState(30);
  const [projectionYears, setProjectionYears] = useState(1);

  if (!metrics) return null;

  const baseRate = metrics.feeLast24 / 100; // Base daily rate

  // APR Calculations (simple interest)
  const calculateAPR = (depositAmount, years) => {
    const annualReturn = depositAmount * baseRate * 365;
    const totalReturn = annualReturn * years;
    const totalValue = depositAmount + totalReturn;
    
    // Daily return (linear average)
    const dailyReturn = totalReturn / (365 * years);
    const dailyRate = (dailyReturn / depositAmount) * 100;
    
    // Monthly return (linear average)
    const monthlyReturn = totalReturn / (12 * years);
    const monthlyRate = (monthlyReturn / depositAmount) * 100;
    
    // Annual rate (linear average)
    const annualRate = (totalReturn / years) / depositAmount * 100;
    
    return {
      dailyReturn,
      dailyRate,
      monthlyReturn,
      monthlyRate,
      annualRate,
      annualReturn: totalReturn / years,
      totalReturn,
      totalValue
    };
  };

  // APY Calculations (compound interest)
  const calculateAPY = (depositAmount, reinvestDays, years) => {
    const periodsPerYear = 365 / reinvestDays;
    const ratePerPeriod = baseRate * reinvestDays;
    
    // Calculate total value after the projection period
    const totalValue = depositAmount * Math.pow(1 + ratePerPeriod, periodsPerYear * years);
    const totalReturn = totalValue - depositAmount;
    
    // Calculate average annual return
    const annualReturn = totalReturn / years;
    const annualRate = (annualReturn / depositAmount) * 100;
    
    // Daily and monthly returns based on the annual average
    const dailyReturn = annualReturn / 365;
    const monthlyReturn = annualReturn / 12;
    
    return {
      dailyReturn,
      dailyRate: (dailyReturn / depositAmount) * 100,
      monthlyReturn,
      monthlyRate: (monthlyReturn / depositAmount) * 100,
      annualRate,
      annualReturn,
      totalReturn,
      totalValue
    };
  };

  // Calculate metrics based on selected mode
  const calculatedMetrics = showAPY 
    ? calculateAPY(positionConfig.depositAmount, reinvestmentDays, projectionYears)
    : calculateAPR(positionConfig.depositAmount, projectionYears);

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Position Metrics</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAPY(false)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                !showAPY ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              APR
            </button>
            <button
              onClick={() => setShowAPY(true)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                showAPY ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              APY
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Projection Years
              </label>
              <input
                type="number"
                value={projectionYears}
                onChange={(e) => setProjectionYears(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-gray-700 rounded p-2 text-white"
                min="0.1"
                step="0.1"
              />
            </div>
            {showAPY && (
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Reinvestment Frequency
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={reinvestmentDays}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setReinvestmentDays('');
                      } else {
                        const num = Number(value);
                        if (!isNaN(num)) {
                          setReinvestmentDays(Math.max(1, Math.min(365, num)));
                        }
                      }
                    }}
                    className="w-full bg-gray-700 rounded p-2 text-white pr-12"
                    min="1"
                    max="365"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    Days
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-400">Average Daily Return</span>
              <div className="text-2xl font-bold text-green-500">
                ${calculatedMetrics.dailyReturn.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                {calculatedMetrics.dailyRate.toFixed(4)}%
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-400">Average Monthly Return</span>
              <div className="text-2xl font-bold text-green-500">
                ${calculatedMetrics.monthlyReturn.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                {calculatedMetrics.monthlyRate.toFixed(2)}%
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-400">Average Annual Return</span>
              <div className="text-2xl font-bold text-green-500">
                {calculatedMetrics.annualRate.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-400">
                ${calculatedMetrics.annualReturn.toFixed(2)} / year
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-400">
                Total Value After {projectionYears} {projectionYears === 1 ? 'Year' : 'Years'}
              </span>
              <div className="text-2xl font-bold text-green-500">
                ${calculatedMetrics.totalValue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                +${calculatedMetrics.totalReturn.toFixed(2)} profit
              </div>
            </div>
          </div>

          {!isInRange && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Position is out of range. Not earning fees.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};