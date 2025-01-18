import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ArrowUpCircle, ArrowDownCircle, Coins } from 'lucide-react';

const TradingSimulator = ({ poolInfo, onClose }) => {
  // Generate realistic price data based on pool info
  const generateTradeData = () => {
    const data = [];
    let price = poolInfo?.token0Price || 35000;
    const volatility = 0.03;
    const trend = 0.001;
    
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const change = (Math.random() - 0.5) * 2 * volatility + trend;
      price = price * (1 + change);
      
      if (Math.random() < 0.1) {
        price = price * (1 + (Math.random() - 0.5) * 0.1);
      }
      
      data.push({
        date: date.toLocaleDateString(),
        price: Number(price.toFixed(4)),
        volume: Math.round(Math.random() * 1000 + 500)
      });
    }
    return data;
  };

  const [data] = useState(generateTradeData());
  const [trades, setTrades] = useState([]);
  const [tradeType, setTradeType] = useState('buy');
  const [hoveredPrice, setHoveredPrice] = useState(null);

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload;
      const newTrade = {
        type: tradeType,
        date: clickedData.date,
        price: clickedData.price,
        timestamp: new Date().getTime()
      };
      setTrades(prev => [...prev, newTrade]);
    }
  };

  const calculateRealizedProfit = () => {
    let totalProfit = 0;
    let buyStack = [];

    trades.forEach(trade => {
      if (trade.type === 'buy') {
        buyStack.push(trade);
      } else if (trade.type === 'sell' && buyStack.length > 0) {
        const buyTrade = buyStack.shift();
        totalProfit += trade.price - buyTrade.price;
      }
    });

    return totalProfit.toFixed(2);
  };

  const removeTrade = (timestamp) => {
    setTrades(prev => prev.filter(trade => trade.timestamp !== timestamp));
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 border border-gray-700 rounded shadow">
          <p className="font-semibold text-white">Date: {data.date}</p>
          <p className="text-blue-400">Price: ${data.price.toLocaleString()}</p>
          <p className="text-gray-300">Volume: {data.volume}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="text-blue-400" />
            <CardTitle className="text-white">Trading Simulator</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setTradeType('buy')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              tradeType === 'buy' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <ArrowUpCircle size={16} />
            Buy
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              tradeType === 'sell' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <ArrowDownCircle size={16} />
            Sell
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              onClick={handleChartClick}
              onMouseMove={(e) => {
                if (e && e.activePayload) {
                  setHoveredPrice(e.activePayload[0].payload.price);
                }
              }}
              onMouseLeave={() => setHoveredPrice(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis 
                domain={['dataMin - 1000', 'dataMax + 1000']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                stroke="#9CA3AF"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                dot={false}
                name="Price"
              />
              {trades.map((trade) => (
                <ReferenceDot
                  key={trade.timestamp}
                  x={trade.date}
                  y={trade.price}
                  r={6}
                  fill={trade.type === 'buy' ? '#22c55e' : '#ef4444'}
                  stroke="none"
                  onClick={() => removeTrade(trade.timestamp)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Trading Summary</h3>
            {hoveredPrice && (
              <p className="text-gray-300">
                Current Price: ${hoveredPrice.toLocaleString()}
              </p>
            )}
          </div>
          <div className="mt-2">
            <p className="text-lg">
              Realized Profit: 
              <span className={`font-bold ml-2 ${
                calculateRealizedProfit() >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                ${Number(calculateRealizedProfit()).toLocaleString()}
              </span>
            </p>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Trade History:</h4>
            <div className="max-h-40 overflow-y-auto">
              {trades.map((trade) => (
                <div
                  key={trade.timestamp}
                  className="flex items-center justify-between p-2 border-b border-gray-700"
                >
                  <span className={`flex items-center gap-2 ${
                    trade.type === 'buy' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {trade.type === 'buy' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                    {trade.type.toUpperCase()} at ${trade.price.toLocaleString()} ({trade.date})
                  </span>
                  <button
                    onClick={() => removeTrade(trade.timestamp)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingSimulator;